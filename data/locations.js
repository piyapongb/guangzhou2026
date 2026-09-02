/**
 * Location Master Data
 * Single source of truth for the places a trip visits. Days in
 * itinerary.js reference these records by key only (locationId) so the
 * same city can be reused across many days without repeating coordinates.
 *
 * Fields: name (display label), lat, lon
 *
 * Coordinates are passed straight to Open-Meteo, so no geocoding call is
 * needed. Only entries a day actually points at are ever fetched, so
 * keeping spare cities here costs nothing.
 *
 * To use one of these for a day, add its key to that day in itinerary.js:
 *   { id: "day-1", date: "2026-10-22", locationId: "shanghai", ... }
 *
 * To add a new city, copy this block and fill it in:
 *   cityKey: {
 *     name: "City Name",
 *     lat: 0.0000,
 *     lon: 0.0000
 *   },
 * City-centre coordinates are precise enough — Open-Meteo's grid is a few
 * kilometres wide, so decimals past the fourth place make no difference.
 * Find them by right-clicking a spot in Google Maps (the numbers at the top
 * of the menu are lat, lon) or at https://open-meteo.com/en/docs/geocoding-api
 * Note the order: latitude first, longitude second.
 */
window.LOCATIONS_DATA = {
  /* Used by this trip. */
  guangzhou: {
    name: "Guangzhou",
    lat: 23.1291,
    lon: 113.2644
  },

  /* Ready to use — reference them from a day whenever a trip goes there. */
  shanghai: {
    name: "Shanghai",
    lat: 31.2304,
    lon: 121.4737
  },
  beijing: {
    name: "Beijing",
    lat: 39.9042,
    lon: 116.4074
  },
  tianjin: {
    name: "Tianjin",
    lat: 39.1422,
    lon: 117.1767
  }
};
