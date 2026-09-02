/**
 * Weather: Open-Meteo integration.
 *
 * Public API:
 *   Weather.getWeatherForDay(location, "YYYY-MM-DD") -> Promise<weather|null>
 *
 * `location` is a record from data/locations.js ({ name, lat, lon }), so any
 * day can point at any city and the same call works unchanged.
 *
 * Source selection is automatic:
 *   - Date within the next ~14 days -> live forecast endpoint.
 *   - Anything further out (or past)  -> climatological average built from
 *     the same calendar window over the last few years of the archive.
 * That way the card shows sensible numbers today and sharpens into a real
 * forecast as the trip approaches, with no code change in between.
 *
 * Open-Meteo needs no API key, so nothing secret ships in this file.
 * Every result is cached in localStorage and every failure resolves to null,
 * letting the caller keep whatever static `weather` the day already had.
 */
window.Weather = (function () {
  "use strict";

  const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";
  const ARCHIVE_URL = "https://archive-api.open-meteo.com/v1/archive";
  /* The ERA5 archive publishes no UV, so past UV comes from the archived
     model output instead. Kept as a separate, optional enrichment: if it
     fails the rest of the average still renders. */
  const HISTORICAL_FORECAST_URL = "https://historical-forecast-api.open-meteo.com/v1/forecast";

  /* Open-Meteo publishes 16 days of forecast; stay just inside that. */
  const FORECAST_HORIZON_DAYS = 14;
  /* Years of history averaged for the "typical for this date" figure. */
  const CLIMATE_YEARS = 5;
  /* UV is driven by sun angle and ozone, so it barely moves year to year;
     two years is plenty and keeps the extra requests cheap. */
  const CLIMATE_UV_YEARS = 2;
  /* Calendar days either side of the target date folded into that average. */
  const CLIMATE_WINDOW_DAYS = 3;
  /* Rain counts as a "wet day" past this much accumulation. */
  const WET_DAY_MM = 1;

  const CACHE_PREFIX = "trip-weather:";
  const TTL_FORECAST = 3 * 60 * 60 * 1000;       /* 3 hours  */
  const TTL_CLIMATE = 30 * 24 * 60 * 60 * 1000;  /* 30 days  */

  /* WMO weather interpretation codes -> short label. */
  const WMO_LABELS = {
    0: "Clear sky", 1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
    45: "Fog", 48: "Rime fog",
    51: "Light drizzle", 53: "Drizzle", 55: "Heavy drizzle",
    56: "Freezing drizzle", 57: "Freezing drizzle",
    61: "Light rain", 63: "Rain", 65: "Heavy rain",
    66: "Freezing rain", 67: "Freezing rain",
    71: "Light snow", 73: "Snow", 75: "Heavy snow", 77: "Snow grains",
    80: "Light showers", 81: "Showers", 82: "Heavy showers",
    85: "Snow showers", 86: "Snow showers",
    95: "Thunderstorm", 96: "Thunderstorm with hail", 99: "Thunderstorm with hail"
  };

  /* In-flight requests, so days sharing a city share one network call. */
  const inflight = {};

  /* ---------- Date helpers (local dates only, no UTC drift) ---------- */

  function pad(n) { return n < 10 ? "0" + n : String(n); }

  function toKey(date) {
    return date.getFullYear() + "-" + pad(date.getMonth() + 1) + "-" + pad(date.getDate());
  }

  function parseKey(str) {
    const parts = String(str).split("-");
    if (parts.length !== 3) return null;
    const date = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    return isNaN(date.getTime()) ? null : date;
  }

  function addDays(date, days) {
    const copy = new Date(date.getTime());
    copy.setDate(copy.getDate() + days);
    return copy;
  }

  /* Rounded so daylight-saving hours never shift the day count. */
  function daysBetween(from, to) {
    return Math.round((to.getTime() - from.getTime()) / 86400000);
  }

  /* Day-of-year in a fixed non-leap year, for comparing "MM-DD" strings. */
  function dayOfYear(month, day) {
    return Math.round((new Date(2001, month - 1, day) - new Date(2001, 0, 1)) / 86400000);
  }

  /* Signed distance in days between an "MM-DD" string and a target date. */
  function monthDayDistance(monthDay, target) {
    const parts = monthDay.split("-");
    let delta = dayOfYear(Number(parts[0]), Number(parts[1])) -
      dayOfYear(target.getMonth() + 1, target.getDate());
    if (delta > 182) delta -= 365;
    if (delta < -182) delta += 365;
    return delta;
  }

  /* ---------- Cache (best effort; private browsing may throw) ---------- */

  function cacheGet(key) {
    try {
      const raw = localStorage.getItem(CACHE_PREFIX + key);
      if (!raw) return null;
      const entry = JSON.parse(raw);
      if (!entry || typeof entry.storedAt !== "number") return null;
      if (Date.now() - entry.storedAt > entry.ttl) {
        localStorage.removeItem(CACHE_PREFIX + key);
        return null;
      }
      return entry.value;
    } catch (e) {
      return null;
    }
  }

  function cacheSet(key, value, ttl) {
    try {
      localStorage.setItem(CACHE_PREFIX + key, JSON.stringify({
        storedAt: Date.now(), ttl: ttl, value: value
      }));
    } catch (e) {
      /* Quota or disabled storage: caching is optional, keep going. */
    }
  }

  /* ---------- Fetch plumbing ---------- */

  function getJSON(url) {
    return fetch(url, { mode: "cors" }).then(function (res) {
      if (!res.ok) throw new Error("Open-Meteo responded " + res.status);
      return res.json();
    });
  }

  function once(key, run) {
    if (!inflight[key]) {
      inflight[key] = run().then(
        function (value) { delete inflight[key]; return value; },
        function (err) { delete inflight[key]; throw err; }
      );
    }
    return inflight[key];
  }

  function locationKey(location) {
    return Number(location.lat).toFixed(3) + "," + Number(location.lon).toFixed(3);
  }

  function average(values) {
    const clean = values.filter(function (v) { return typeof v === "number" && !isNaN(v); });
    if (!clean.length) return null;
    return clean.reduce(function (a, b) { return a + b; }, 0) / clean.length;
  }

  /* Daily mean humidity, folded down from the hourly series. */
  function humidityByDate(hourly) {
    const byDate = {};
    if (!hourly || !hourly.time || !hourly.relative_humidity_2m) return byDate;
    hourly.time.forEach(function (stamp, i) {
      const date = String(stamp).slice(0, 10);
      if (!byDate[date]) byDate[date] = [];
      byDate[date].push(hourly.relative_humidity_2m[i]);
    });
    Object.keys(byDate).forEach(function (date) {
      byDate[date] = average(byDate[date]);
    });
    return byDate;
  }

  /* ---------- Live forecast ---------- */

  function loadForecast(location) {
    const today = new Date();
    const start = toKey(today);
    const end = toKey(addDays(today, FORECAST_HORIZON_DAYS));
    const key = "forecast|" + locationKey(location) + "|" + start;

    const cached = cacheGet(key);
    if (cached) return Promise.resolve(cached);

    return once(key, function () {
      const url = FORECAST_URL +
        "?latitude=" + encodeURIComponent(location.lat) +
        "&longitude=" + encodeURIComponent(location.lon) +
        "&daily=weather_code,temperature_2m_max,temperature_2m_min," +
        "apparent_temperature_max,precipitation_probability_max," +
        "wind_speed_10m_max,uv_index_max" +
        "&hourly=relative_humidity_2m" +
        "&timezone=auto&start_date=" + start + "&end_date=" + end;

      return getJSON(url).then(function (json) {
        const daily = json.daily || {};
        const humidity = humidityByDate(json.hourly);
        const byDate = {};
        (daily.time || []).forEach(function (date, i) {
          byDate[date] = {
            code: daily.weather_code ? daily.weather_code[i] : null,
            tempMax: daily.temperature_2m_max ? daily.temperature_2m_max[i] : null,
            tempMin: daily.temperature_2m_min ? daily.temperature_2m_min[i] : null,
            feelsLike: daily.apparent_temperature_max ? daily.apparent_temperature_max[i] : null,
            rain: daily.precipitation_probability_max ? daily.precipitation_probability_max[i] : null,
            wind: daily.wind_speed_10m_max ? daily.wind_speed_10m_max[i] : null,
            uvIndex: daily.uv_index_max ? daily.uv_index_max[i] : null,
            humidity: humidity[date] != null ? humidity[date] : null
          };
        });
        cacheSet(key, byDate, TTL_FORECAST);
        return byDate;
      });
    });
  }

  /* ---------- Historical averages ---------- */

  /**
   * One archive request per year, covering the target month padded by a week
   * on each side. Padding keeps the smoothing window intact for dates that
   * fall at a month boundary, and keying the cache by month (not by date)
   * means every day of a trip in the same city and month shares these calls.
   */
  function fetchArchiveWindow(location, year, month) {
    const start = toKey(addDays(new Date(year, month - 1, 1), -7));
    const end = toKey(addDays(new Date(year, month, 0), 7));
    const url = ARCHIVE_URL +
      "?latitude=" + encodeURIComponent(location.lat) +
      "&longitude=" + encodeURIComponent(location.lon) +
      "&daily=weather_code,temperature_2m_max,temperature_2m_min," +
      "apparent_temperature_max,precipitation_sum,wind_speed_10m_max" +
      "&hourly=relative_humidity_2m" +
      "&timezone=auto&start_date=" + start + "&end_date=" + end;

    return getJSON(url).then(function (json) {
      const daily = json.daily || {};
      const humidity = humidityByDate(json.hourly);
      return (daily.time || []).map(function (date, i) {
        return {
          monthDay: String(date).slice(5),
          code: daily.weather_code ? daily.weather_code[i] : null,
          tempMax: daily.temperature_2m_max ? daily.temperature_2m_max[i] : null,
          tempMin: daily.temperature_2m_min ? daily.temperature_2m_min[i] : null,
          feelsLike: daily.apparent_temperature_max ? daily.apparent_temperature_max[i] : null,
          precipitation: daily.precipitation_sum ? daily.precipitation_sum[i] : null,
          wind: daily.wind_speed_10m_max ? daily.wind_speed_10m_max[i] : null,
          humidity: humidity[date] != null ? humidity[date] : null
        };
      });
    });
  }

  function loadClimate(location, month) {
    const latestYear = new Date().getFullYear() - 1;
    const years = [];
    for (let i = 0; i < CLIMATE_YEARS; i++) years.push(latestYear - i);

    const key = "climate|" + locationKey(location) + "|" + pad(month) + "|" +
      years[years.length - 1] + "-" + years[0];

    const cached = cacheGet(key);
    if (cached) return Promise.resolve(cached);

    return once(key, function () {
      return Promise.all(years.map(function (year) {
        return fetchArchiveWindow(location, year, month);
      })).then(function (chunks) {
        const rows = chunks.reduce(function (all, chunk) { return all.concat(chunk); }, []);
        cacheSet(key, rows, TTL_CLIMATE);
        return rows;
      });
    });
  }

  /**
   * Past daily peak UV for one month, from the archived model output.
   * Resolves to [] on any failure so a missing UV chip is the worst that
   * can happen — the temperature, rain and wind average still renders.
   */
  function loadClimateUv(location, month) {
    const latestYear = new Date().getFullYear() - 1;
    const years = [];
    for (let i = 0; i < CLIMATE_UV_YEARS; i++) years.push(latestYear - i);

    const key = "climate-uv|" + locationKey(location) + "|" + pad(month) + "|" +
      years[years.length - 1] + "-" + years[0];

    const cached = cacheGet(key);
    if (cached) return Promise.resolve(cached);

    return once(key, function () {
      return Promise.all(years.map(function (year) {
        const start = toKey(addDays(new Date(year, month - 1, 1), -7));
        const end = toKey(addDays(new Date(year, month, 0), 7));
        const url = HISTORICAL_FORECAST_URL +
          "?latitude=" + encodeURIComponent(location.lat) +
          "&longitude=" + encodeURIComponent(location.lon) +
          "&daily=uv_index_max&timezone=auto" +
          "&start_date=" + start + "&end_date=" + end;

        return getJSON(url).then(function (json) {
          const daily = json.daily || {};
          return (daily.time || []).map(function (date, i) {
            return {
              monthDay: String(date).slice(5),
              uvIndex: daily.uv_index_max ? daily.uv_index_max[i] : null
            };
          });
        });
      })).then(function (chunks) {
        const rows = chunks.reduce(function (all, chunk) { return all.concat(chunk); }, []);
        cacheSet(key, rows, TTL_CLIMATE);
        return rows;
      });
    }).catch(function (err) {
      console.warn("[weather] Historical UV unavailable:", err.message);
      return [];
    });
  }

  function mostCommonCode(codes) {
    const tally = {};
    let best = null;
    let bestCount = 0;
    codes.forEach(function (code) {
      if (code == null) return;
      tally[code] = (tally[code] || 0) + 1;
      if (tally[code] > bestCount) {
        bestCount = tally[code];
        best = Number(code);
      }
    });
    return best;
  }

  function inWindow(rows, target) {
    return rows.filter(function (row) {
      return Math.abs(monthDayDistance(row.monthDay, target)) <= CLIMATE_WINDOW_DAYS;
    });
  }

  function summarizeClimate(rows, uvRows, target) {
    const window = inWindow(rows, target);
    if (!window.length) return null;

    const wetDays = window.filter(function (row) {
      return typeof row.precipitation === "number" && row.precipitation >= WET_DAY_MM;
    });

    return {
      code: mostCommonCode(window.map(function (r) { return r.code; })),
      tempMax: average(window.map(function (r) { return r.tempMax; })),
      tempMin: average(window.map(function (r) { return r.tempMin; })),
      feelsLike: average(window.map(function (r) { return r.feelsLike; })),
      rain: Math.round((wetDays.length / window.length) * 100),
      wind: average(window.map(function (r) { return r.wind; })),
      humidity: average(window.map(function (r) { return r.humidity; })),
      uvIndex: average(inWindow(uvRows || [], target).map(function (r) { return r.uvIndex; }))
    };
  }

  function climateFor(location, dateStr) {
    const target = parseKey(dateStr);
    if (!target) return Promise.resolve(null);
    const month = target.getMonth() + 1;
    return Promise.all([
      loadClimate(location, month),
      loadClimateUv(location, month)
    ]).then(function (results) {
      const summary = summarizeClimate(results[0], results[1], target);
      return summary ? toDisplay(summary, "average") : null;
    });
  }

  /* ---------- Shaping for the weather card ---------- */

  function degrees(value) {
    return typeof value === "number" && !isNaN(value) ? Math.round(value) + "°C" : "";
  }

  function toDisplay(sample, source) {
    const range = (typeof sample.tempMin === "number" && typeof sample.tempMax === "number")
      ? Math.round(sample.tempMin) + "–" + Math.round(sample.tempMax) + "°C"
      : "";
    return {
      /* Raw WMO code travels with the label so the card can pick an icon. */
      code: typeof sample.code === "number" ? sample.code : null,
      forecast: WMO_LABELS[sample.code] || "",
      temperature: range,
      rain: typeof sample.rain === "number" ? Math.round(sample.rain) + "%" : "",
      humidity: typeof sample.humidity === "number" ? Math.round(sample.humidity) + "%" : "",
      wind: typeof sample.wind === "number" ? Math.round(sample.wind) + " km/h" : "",
      feelsLike: degrees(sample.feelsLike),
      uvIndex: typeof sample.uvIndex === "number" ? Math.round(sample.uvIndex) : "",
      source: source
    };
  }

  /* ---------- Public API ---------- */

  /**
   * Resolve the weather for one day at one place.
   * Resolves to null (never rejects) when the location is incomplete or the
   * network is unavailable, so callers can fall back to static data.
   */
  function getWeatherForDay(location, dateStr) {
    if (!location || location.lat == null || location.lon == null) {
      return Promise.resolve(null);
    }
    const target = parseKey(dateStr);
    if (!target) return Promise.resolve(null);

    const today = parseKey(toKey(new Date()));
    const delta = daysBetween(today, target);
    const withinForecast = delta >= 0 && delta <= FORECAST_HORIZON_DAYS;

    const lookup = withinForecast
      ? loadForecast(location).then(function (byDate) {
          const sample = byDate[dateStr];
          /* Horizon can shrink between cache write and read; fall back. */
          return sample ? toDisplay(sample, "forecast") : climateFor(location, dateStr);
        })
      : climateFor(location, dateStr);

    return lookup.catch(function (err) {
      console.warn("[weather] Falling back to static data for " + dateStr + ":", err.message);
      return null;
    });
  }

  return {
    getWeatherForDay: getWeatherForDay
  };
})();
