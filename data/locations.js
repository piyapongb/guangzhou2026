/**
 * Location Master Data
 * Single source of truth for the places a trip visits. Days in
 * itinerary.js reference these records by key only (locationId) so the
 * same city can be reused across many days without repeating coordinates.
 *
 * Fields: name (display label), lat, lon
 *
 * Coordinates are passed straight to Open-Meteo, so no geocoding call is
 * needed. To reuse this template for another trip, replace the entries
 * below and point each day's `locationId` at the right key.
 * Tip: grab lat/lon from Google Maps (right-click a spot → the numbers at
 * the top of the menu) or https://open-meteo.com/en/docs/geocoding-api
 */
window.LOCATIONS_DATA = {
  guangzhou: {
    name: "Guangzhou",
    lat: 23.1291,
    lon: 113.2644
  }
};
