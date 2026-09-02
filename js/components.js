/**
 * Reusable render functions. No trip-specific data is hardcoded here —
 * every function takes data in and returns DOM nodes.
 */
(function () {
  "use strict";

  const U = window.Utils;

  /* ---------- Small building blocks ---------- */

  function copyRow(text, a11yLabel, extraClass) {
    const row = U.el("div", { class: "copy-row" + (extraClass ? " " + extraClass : "") });
    row.appendChild(U.el("span", { class: "copy-row-text" }, [text]));
    if (text) {
      const iconCopy = U.el("span", { class: "copy-btn-icon copy-btn-icon--copy" }, [U.icon("copy")]);
      const iconCheck = U.el("span", { class: "copy-btn-icon copy-btn-icon--check" }, [U.icon("check")]);
      row.appendChild(
        U.el(
          "button",
          {
            type: "button",
            class: "copy-btn",
            "data-copy-value": text,
            "aria-label": "Copy " + a11yLabel
          },
          [iconCopy, iconCheck, U.el("span", { class: "copy-feedback", "aria-hidden": "true" }, ["Copied"])]
        )
      );
    }
    return row;
  }

  function detailsToggle(panelId, label) {
    return U.el(
      "button",
      {
        type: "button",
        class: "details-toggle",
        "aria-expanded": "false",
        "aria-controls": panelId
      },
      [
        U.el("span", { class: "details-toggle-label" }, [label || "Details"]),
        U.icon("chevron", "details-toggle-icon")
      ]
    );
  }

  function detailsPanel(panelId) {
    const panel = U.el("div", { id: panelId, class: "details-panel", role: "region" });
    panel.hidden = true;
    return panel;
  }

  function mediaThumb(src, alt, iconKey, className, clickable) {
    const tag = clickable && src ? "button" : "div";
    const attrs = { class: "media-thumb " + (className || "") };
    if (clickable && src) {
      attrs.type = "button";
      attrs["data-lightbox-src"] = src;
      attrs["aria-label"] = "View larger photo of " + (alt || "");
    }
    const wrap = U.el(tag, attrs);
    if (src) {
      wrap.appendChild(
        U.el("img", {
          src: src,
          alt: alt || "",
          loading: "lazy",
          width: "400",
          height: "300"
        })
      );
    } else {
      wrap.classList.add("media-thumb--fallback");
      wrap.appendChild(U.icon(iconKey || "landmark"));
    }
    return wrap;
  }

  function statRow(pairs) {
    const visible = pairs.filter(function (p) {
      return p.value !== undefined && p.value !== null && p.value !== "";
    });
    if (!visible.length) return null;
    const row = U.el("dl", { class: "stat-row" });
    visible.forEach(function (p) {
      row.appendChild(U.el("div", { class: "stat-pair" }, [
        U.el("dt", {}, [p.label]),
        U.el("dd", {}, [String(p.value)])
      ]));
    });
    return row;
  }

  function externalLinkButton(url, label, variant) {
    if (!url || !U.isSafeExternalUrl(url)) return null;
    return U.el(
      "a",
      {
        href: url,
        target: "_blank",
        rel: "noopener noreferrer",
        class: "btn btn--" + (variant || "secondary"),
        "aria-label": label + " (opens in a new tab)"
      },
      [U.el("span", {}, [label]), U.icon("external", "btn-icon")]
    );
  }

  function fieldBlock(label, value) {
    if (!value) return null;
    return U.el("div", { class: "field-block" }, [
      U.el("h4", { class: "field-label" }, [label]),
      U.el("p", { class: "field-value" }, [value])
    ]);
  }

  /* ---------- Hero ---------- */

  function renderHero(trip) {
    const hero = U.el("header", { class: "hero", id: "top" });
    const media = U.el("div", { class: "hero-media" });
    if (trip.heroImage) {
      media.appendChild(
        U.el("img", {
          src: trip.heroImage,
          alt: trip.heroImageAlt || trip.destination || "",
          loading: "eager",
          fetchpriority: "high",
          width: "1600",
          height: "900"
        })
      );
    }
    hero.appendChild(media);
    hero.appendChild(
      U.el("div", { class: "hero-content" }, [
        U.el("p", { class: "hero-eyebrow" }, [trip.destination || ""]),
        U.el("h1", { class: "hero-title" }, [trip.title]),
        U.el("p", { class: "hero-dates" }, [
          U.icon("clock", "hero-dates-icon"),
          U.el("span", {}, [U.formatDateRange(trip.startDate, trip.endDate)])
        ])
      ])
    );
    return hero;
  }

  /* ---------- Main tabs ---------- */

  const TAB_DEFS = [
    { id: "itinerary", label: "Itinerary", icon: "calendar" },
    { id: "restaurants", label: "Restaurants", icon: "food" },
    { id: "hotels", label: "Hotels", icon: "hotel" }
  ];

  function renderMainTabs(activeTab) {
    const nav = U.el("div", { class: "main-tabs", role: "tablist", "aria-label": "Main sections" });
    TAB_DEFS.forEach(function (tab) {
      const isActive = tab.id === activeTab;
      nav.appendChild(
        U.el(
          "button",
          {
            type: "button",
            class: "main-tab" + (isActive ? " is-active" : ""),
            role: "tab",
            id: "tab-" + tab.id,
            "aria-selected": isActive ? "true" : "false",
            "aria-controls": "panel-" + tab.id,
            "data-tab-target": tab.id,
            tabindex: isActive ? "0" : "-1"
          },
          [U.icon(tab.icon, "main-tab-icon"), U.el("span", {}, [tab.label])]
        )
      );
    });
    return nav;
  }

  /* ---------- Day navigation ---------- */

  function renderDayNav(days, activeDayId) {
    const nav = U.el("nav", { class: "day-nav", "aria-label": "Select day" });
    const list = U.el("div", { class: "day-nav-list", role: "tablist" });
    days.forEach(function (day) {
      const isActive = day.id === activeDayId;
      list.appendChild(
        U.el(
          "button",
          {
            type: "button",
            class: "day-nav-btn" + (isActive ? " is-active" : ""),
            role: "tab",
            "aria-selected": isActive ? "true" : "false",
            "data-day-target": day.id
          },
          [
            U.el("span", { class: "day-nav-label" }, ["Day " + day.dayNumber]),
            U.el("span", { class: "day-nav-date" }, [U.formatDateShort(day.date)])
          ]
        )
      );
    });
    nav.appendChild(list);
    return nav;
  }

  /* ---------- Weather ---------- */

  function renderWeather(weather) {
    if (!weather) return null;
    const card = U.el("div", { class: "weather-card" });
    card.appendChild(
      U.el("div", { class: "weather-headline" }, [
        U.icon("weather", "weather-icon"),
        U.el("span", { class: "weather-forecast" }, [weather.forecast || ""]),
        weather.temperature ? U.el("span", { class: "weather-temp" }, [weather.temperature]) : null
      ].filter(Boolean))
    );
    const chips = [
      { label: "Rain", value: weather.rain },
      { label: "Humidity", value: weather.humidity },
      { label: "Wind", value: weather.wind },
      { label: "Feels like", value: weather.feelsLike },
      { label: "UV Index", value: weather.uvIndex }
    ].filter(function (c) { return c.value !== undefined && c.value !== null && c.value !== ""; });
    if (chips.length) {
      const chipRow = U.el("div", { class: "weather-chips" });
      chips.forEach(function (c) {
        chipRow.appendChild(U.el("span", { class: "weather-chip" }, [c.label + " " + c.value]));
      });
      card.appendChild(chipRow);
    }
    return card;
  }

  /* ---------- Activity details ---------- */

  function renderActivityDetails(details) {
    const wrap = U.el("div", { class: "detail-content" });
    if (!details) return wrap;

    [
      fieldBlock("Description", details.description),
      fieldBlock("Location", details.location)
    ].forEach(function (node) { if (node) wrap.appendChild(node); });

    const metroPairs = [
      { label: "Metro Station", value: details.metroStation },
      { label: "Exit", value: details.metroExit }
    ];
    const metroRow = statRow(metroPairs);
    if (metroRow) {
      metroRow.classList.add("stat-row--transport");
      wrap.appendChild(metroRow);
    }

    const costPairs = [
      { label: "Entrance fee", value: details.entranceFee }
    ];
    const costRow = statRow(costPairs);
    if (costRow) {
      costRow.classList.add("stat-row--cost");
      wrap.appendChild(costRow);
    }

    const links = [
      externalLinkButton(details.ticketUrl, "Ticket", "primary"),
      externalLinkButton(details.referenceUrl, details.referenceLabel || "Reviews", "secondary")
    ].filter(Boolean);
    if (links.length) {
      wrap.appendChild(U.el("div", { class: "detail-actions" }, links));
    }

    return wrap;
  }

  /* ---------- Restaurant card + detail (shared by Guide and Itinerary) ---------- */

  function renderRestaurantCard(restaurant, opts) {
    opts = opts || {};
    const panelId = U.uid("restaurant-panel");
    const card = U.el("article", {
      class: "restaurant-card" + (opts.compact ? " restaurant-card--compact" : ""),
      "data-cuisine": (restaurant.cuisine || []).join("|").toLowerCase(),
      "data-search": U.normalize(restaurant.name + " " + restaurant.nameZh)
    });

    card.appendChild(mediaThumb(restaurant.image, restaurant.name, "food", "restaurant-card-media"));

    const body = U.el("div", { class: "restaurant-card-body" });
    body.appendChild(copyRow(restaurant.name, restaurant.name, "copy-row--name"));
    if (restaurant.nameZh) {
      body.appendChild(copyRow(restaurant.nameZh, restaurant.nameZh, "copy-row--zh"));
    }
    if (restaurant.cuisine && restaurant.cuisine.length) {
      const tags = U.el("div", { class: "tag-row" });
      restaurant.cuisine.forEach(function (c) {
        tags.appendChild(U.el("span", { class: "tag" }, [c]));
      });
      body.appendChild(tags);
    }

    const footer = U.el("div", { class: "restaurant-card-footer" });
    footer.appendChild(detailsToggle(panelId, "Details"));
    body.appendChild(footer);
    card.appendChild(body);

    const panel = detailsPanel(panelId);
    panel.appendChild(renderRestaurantDetailContent(restaurant));
    card.appendChild(panel);

    return card;
  }

  function renderRestaurantDetailContent(restaurant) {
    const wrap = U.el("div", { class: "detail-content" });

    [
      fieldBlock("Description", restaurant.description),
      fieldBlock("Address", restaurant.address),
      fieldBlock("Price", restaurant.price)
    ].forEach(function (node) { if (node) wrap.appendChild(node); });

    if (restaurant.recommendedDishes && restaurant.recommendedDishes.length) {
      const block = U.el("div", { class: "field-block" });
      block.appendChild(U.el("h4", { class: "field-label" }, ["Recommended Dishes"]));
      const list = U.el("ul", { class: "dish-list" });
      restaurant.recommendedDishes.forEach(function (dish) {
        list.appendChild(U.el("li", {}, [dish]));
      });
      block.appendChild(list);
      wrap.appendChild(block);
    }

    if (restaurant.gallery && restaurant.gallery.length > 1) {
      const gallery = U.el("div", { class: "gallery", role: "list", "aria-label": "Photo gallery" });
      restaurant.gallery.forEach(function (src) {
        const btn = U.el(
          "button",
          {
            type: "button",
            class: "gallery-thumb",
            role: "listitem",
            "data-lightbox-src": src,
            "aria-label": "View larger photo of " + restaurant.name
          },
          [U.el("img", { src: src, alt: "", loading: "lazy", width: "300", height: "200" })]
        );
        gallery.appendChild(btn);
      });
      wrap.appendChild(gallery);
    }

    const link = externalLinkButton(restaurant.referenceUrl, restaurant.referenceLabel || "Reviews", "secondary");
    if (link) {
      wrap.appendChild(U.el("div", { class: "detail-actions" }, [link]));
    }

    return wrap;
  }

  /* ---------- Nearby restaurants (inside an itinerary restaurant item) ---------- */

  function renderNearbyRestaurants(restaurantIds, restaurantIndex) {
    const wrap = U.el("div", { class: "nearby-restaurants" });
    const valid = (restaurantIds || [])
      .map(function (id) { return restaurantIndex[id]; })
      .filter(Boolean);

    if (!valid.length) {
      wrap.appendChild(U.el("p", { class: "empty-note" }, ["No restaurant options available."]));
      return wrap;
    }

    const grid = U.el("div", { class: "restaurant-grid restaurant-grid--nearby" });
    valid.forEach(function (restaurant) {
      grid.appendChild(renderRestaurantCard(restaurant, { compact: true }));
    });
    wrap.appendChild(grid);
    return wrap;
  }

  /* ---------- Flight card ---------- */

  function renderFlightCard(item) {
    const card = U.el("div", { class: "flight-card" });
    card.appendChild(
      U.el("div", { class: "flight-card-header" }, [
        U.icon("flight", "flight-card-icon"),
        U.el("span", { class: "flight-card-airline" }, [item.airline || ""]),
        item.flightNumber ? U.el("span", { class: "flight-card-number" }, [item.flightNumber]) : null
      ].filter(Boolean))
    );

    const route = U.el("div", { class: "flight-route" });
    route.appendChild(
      U.el("div", { class: "flight-endpoint" }, [
        U.el("span", { class: "flight-airport" }, [item.departureAirport || ""]),
        U.el("span", { class: "flight-time" }, [item.departureTime || ""])
      ])
    );
    route.appendChild(U.el("div", { class: "flight-route-line", "aria-hidden": "true" }, [U.icon("flight", "flight-route-icon")]));
    route.appendChild(
      U.el("div", { class: "flight-endpoint flight-endpoint--arrival" }, [
        U.el("span", { class: "flight-airport" }, [item.arrivalAirport || ""]),
        U.el("span", { class: "flight-time" }, [item.arrivalTime || ""])
      ])
    );
    card.appendChild(route);

    if (item.price) {
      card.appendChild(U.el("div", { class: "flight-price" }, ["Price: " + item.price]));
    }

    return card;
  }

  /* ---------- Timeline item (day view) ---------- */

  function renderTimelineItem(item, restaurantIndex) {
    const li = U.el("li", { class: "timeline-item timeline-item--" + item.type, id: item.id });
    li.appendChild(U.el("div", { class: "timeline-time" }, [
      U.el("time", { datetime: item.time }, [item.time])
    ]));
    li.appendChild(U.el("div", { class: "timeline-marker", "aria-hidden": "true" }, [
      U.el("span", { class: "timeline-dot" })
    ]));

    const content = U.el("div", { class: "timeline-content" });

    if (item.type === "flight") {
      content.appendChild(renderFlightCard(item));
      li.appendChild(content);
      return li;
    }

    const row = U.el("div", { class: "timeline-row" });

    if (item.thumbnail) {
      row.appendChild(mediaThumb(item.thumbnail, item.title, item.icon, "timeline-media", true));
    }

    const main = U.el("div", { class: "timeline-main" });
    const heading = U.el("div", { class: "timeline-heading" });
    heading.appendChild(U.icon(item.icon || "landmark", "timeline-icon"));

    const titles = U.el("div", { class: "timeline-titles" });

    if (item.type === "restaurant") {
      titles.appendChild(U.el("span", { class: "timeline-title" }, [item.title]));
      if (item.titleZh) {
        titles.appendChild(U.el("span", { class: "timeline-title-zh" }, [item.titleZh]));
      }
    } else {
      titles.appendChild(copyRow(item.title, item.title, "copy-row--title"));
      if (item.titleZh) {
        titles.appendChild(copyRow(item.titleZh, item.titleZh, "copy-row--titlezh"));
      }
    }

    heading.appendChild(titles);
    main.appendChild(heading);
    row.appendChild(main);

    const hasDetails = item.type === "restaurant" ? true : !!item.details && hasAnyDetailField(item.details);
    let panelId = null;
    if (hasDetails) {
      panelId = U.uid("panel");
      const actions = U.el("div", { class: "timeline-actions" }, [detailsToggle(panelId, "Details")]);
      row.appendChild(actions);
    }

    content.appendChild(row);

    if (hasDetails) {
      const panel = detailsPanel(panelId);
      if (item.type === "restaurant") {
        panel.appendChild(renderNearbyRestaurants(item.nearbyRestaurantIds || [item.restaurantId], restaurantIndex));
      } else {
        panel.appendChild(renderActivityDetails(item.details));
      }
      content.appendChild(panel);
    }

    li.appendChild(content);
    return li;
  }

  function hasAnyDetailField(details) {
    return Object.keys(details).some(function (key) {
      const v = details[key];
      return v !== undefined && v !== null && v !== "";
    });
  }

  /* ---------- Day section ---------- */

  function renderDaySection(day, restaurantIndex) {
    const section = U.el("section", {
      class: "day-section",
      id: day.id,
      "aria-labelledby": day.id + "-heading"
    });

    section.appendChild(
      U.el("div", { class: "day-header" }, [
        U.el("h2", { id: day.id + "-heading", class: "day-heading" }, ["Day " + day.dayNumber]),
        U.el("p", { class: "day-date" }, [U.formatDateLong(day.date)])
      ])
    );

    const weather = renderWeather(day.weather);
    if (weather) section.appendChild(weather);

    const list = U.el("ol", { class: "timeline" });
    (day.items || []).forEach(function (item) {
      list.appendChild(renderTimelineItem(item, restaurantIndex));
    });
    section.appendChild(list);

    return section;
  }

  /* ---------- Hotel card ---------- */

  function renderHotelCard(hotel) {
    const panelId = U.uid("hotel-panel");
    const card = U.el("article", { class: "hotel-card" });

    card.appendChild(
      U.el("p", { class: "hotel-stay-range" }, [
        U.icon("clock", "hotel-stay-icon"),
        U.el("span", {}, [U.formatDateShort(hotel.stayFrom) + " – " + U.formatDateShort(hotel.stayTo)])
      ])
    );

    card.appendChild(copyRow(hotel.name, hotel.name, "copy-row--name"));
    if (hotel.nameZh) {
      card.appendChild(copyRow(hotel.nameZh, hotel.nameZh, "copy-row--zh"));
    }

    card.appendChild(U.el("div", { class: "hotel-card-footer" }, [detailsToggle(panelId, "Details")]));

    const panel = detailsPanel(panelId);
    const detail = U.el("div", { class: "detail-content" });
    const addressBlock = fieldBlock("Address", hotel.address);
    if (addressBlock) detail.appendChild(addressBlock);
    const stayRow = statRow([
      { label: "Check-in", value: hotel.checkIn },
      { label: "Check-out", value: hotel.checkOut }
    ]);
    if (stayRow) detail.appendChild(stayRow);
    panel.appendChild(detail);
    card.appendChild(panel);

    return card;
  }

  /* ---------- Restaurant Guide (search/filter/zone grouping) ---------- */

  function getUniqueCuisines(restaurants) {
    const set = {};
    restaurants.forEach(function (r) {
      (r.cuisine || []).forEach(function (c) { set[c] = true; });
    });
    return Object.keys(set).sort();
  }

  function renderCuisineFilter(cuisines) {
    const select = U.el("select", { id: "cuisine-filter", class: "select" });
    select.appendChild(U.el("option", { value: "" }, ["All cuisines"]));
    cuisines.forEach(function (c) {
      select.appendChild(U.el("option", { value: c }, [c]));
    });
    return select;
  }

  function groupByZone(restaurants) {
    const zones = {};
    const order = [];
    restaurants.forEach(function (r) {
      const zone = r.zone || "Other";
      if (!zones[zone]) {
        zones[zone] = [];
        order.push(zone);
      }
      zones[zone].push(r);
    });
    return order.map(function (zone) { return { zone: zone, restaurants: zones[zone] }; });
  }

  window.Components = {
    renderHero: renderHero,
    renderMainTabs: renderMainTabs,
    renderDayNav: renderDayNav,
    renderWeather: renderWeather,
    renderDaySection: renderDaySection,
    renderTimelineItem: renderTimelineItem,
    renderRestaurantCard: renderRestaurantCard,
    renderHotelCard: renderHotelCard,
    getUniqueCuisines: getUniqueCuisines,
    renderCuisineFilter: renderCuisineFilter,
    groupByZone: groupByZone,
    TAB_DEFS: TAB_DEFS
  };
})();
