# Guangzhou Trip 2026 --- Data Specification

## Principle

Trip-specific content must be separated from UI code.

Recommended files: - `data/trip.js` - `data/itinerary.js` -
`data/restaurants.js` - `data/hotels.js`

JavaScript data files are preferred for a no-build static
implementation, although equivalent static JSON is acceptable.

## Trip

Fields: - id - title - destination - startDate - endDate - heroImage -
days

Example:

``` js
{
  id: "guangzhou-2026",
  title: "Guangzhou Trip 2026",
  destination: "Guangzhou, China",
  startDate: "2026-10-22",
  endDate: "2026-10-25",
  heroImage: "assets/images/hero.webp",
  days: ["day-1", "day-2", "day-3", "day-4"]
}
```

## Day

Fields: - id - dayNumber - date - weather - items

Weather is optional.

## Weather

Optional: - forecast - temperature - rain - humidity - wind -
feelsLike - uvIndex

## Itinerary Item

Common: - id - type - time - title - titleZh - thumbnail - icon -
details

Supported types: - activity - restaurant - flight - transfer - other

## Activity Details

Optional: - description - location - transport - travelDuration -
travelCost - entranceFee - ticketUrl - metroStation - metroExit -
referenceUrl - referenceLabel

## Restaurant Reference

Never embed a full restaurant object in itinerary data.

Use:

``` js
{
  type: "restaurant",
  restaurantId: "restaurant-001",
  nearbyRestaurantIds: ["restaurant-001", "restaurant-002"]
}
```

## Flight

``` js
{
  type: "flight",
  airline: "Example Airline",
  flightNumber: "XX123",
  departureAirport: "CNX",
  arrivalAirport: "CAN",
  departureTime: "10:30",
  arrivalTime: "14:20",
  price: "฿5,900"
}
```

Times are local.

## Restaurant Master Record

Fields: - id - zone - name - nameZh - image - gallery - cuisine -
description - address - price - recommendedDishes - referenceUrl -
referenceLabel

Example:

``` js
{
  id: "restaurant-001",
  zone: "Tianhe",
  name: "Example Restaurant",
  nameZh: "示例餐厅",
  image: "assets/images/restaurants/example.webp",
  gallery: [],
  cuisine: ["Cantonese", "Dim Sum"],
  description: "คำอธิบายภาษาไทย",
  address: "Example address",
  price: "¥80–150",
  recommendedDishes: ["Shrimp Dumpling", "Char Siu Bun"],
  referenceUrl: "https://example.com/review",
  referenceLabel: "Reviews"
}
```

No price-level field.

## Hotel

Fields: - id - stayFrom - stayTo - name - nameZh - address - checkIn -
checkOut

## Images

Use relative local paths, preferably WebP. Use descriptive filenames
without spaces.

Example: `assets/images/activities/canton-tower.webp`

## Optional Data

Omit or clearly support empty optional properties. Never render
`undefined`, `null`, empty labels, or empty buttons.

## Validation

-   IDs unique.
-   Every restaurantId resolves.
-   Referenced images exist.
-   URLs valid when present.
-   Dates use `YYYY-MM-DD`.
-   Times use `HH:mm`.
-   No duplicated master restaurant data in itinerary.
