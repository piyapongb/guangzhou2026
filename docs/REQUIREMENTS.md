# Guangzhou Trip 2026 --- Final Requirements

## Project

Reusable static one-page travel itinerary template for Guangzhou Trip
2026.

-   Destination: Guangzhou, China
-   Trip: Guangzhou Trip 2026
-   Date: 22--25 Oct 2026
-   Days: Day 1--Day 4
-   Primary device: mobile
-   Deployment: GitHub Pages
-   Stack: HTML5, CSS3, Vanilla JavaScript
-   No backend, database, login, CMS, build system, or package
    installation.

## Main Sections

1.  Itinerary
2.  Restaurants
3.  Hotels

Flight is an itinerary item, not a top-level tab.

## Hero

Show: - Guangzhou Trip 2026 - 22--25 Oct 2026 - Hero image

Modern, attractive, compact, and responsive.

## Trip Navigation

Day 1--Day 4 navigation below Hero. Horizontal scrolling on mobile.
Active day is clear. Sticky behavior may be used.

## Itinerary

Each day contains a date, optional weather summary, and about 5--8
timeline items.

Activity cards support: - Time - English name - Chinese name - Copy
English - Copy Chinese - Thumbnail - Universal SVG icon - Accordion
details

Details may contain: - Thai description - Location - Transportation -
Travel duration - Travel cost - Entrance fee - Ticket URL - Metro
station - Metro exit - External review/reference URL

Hide missing optional fields.

## Copy

Use explicit copy buttons beside English and Chinese names. After
copying, show brief feedback such as "Copied".

UI/headings are English. Place names can be English + Chinese.
Explanatory content is Thai.

## Metro

No Google Maps or interactive map. Only show the Metro station to get
off at and Exit number/name. No GPS or route planner.

## Weather

No weather API. Weather is static data and may contain: - Forecast -
Approximate temperature - Rain - Humidity - Wind - Feels like - UV index

Hide weather when no data exists.

## Restaurants

Top-level Restaurant Guide with: - Search English/Chinese - Zone
grouping - Cuisine filter - Restaurant cards - Accordion details -
Images/gallery - English + Chinese names - Copy English/Chinese -
Cuisine - Description - Address - Price - Recommended dishes - External
review/reference

No user rating, price level, comments, booking engine, or live
restaurant discovery.

## Restaurant Master Data

A restaurant has one master record. It must be referenced by ID from
both Itinerary and Restaurant Guide. Never duplicate the restaurant
record.

Itinerary restaurant/lunch items may show preselected nearby restaurant
options using restaurant IDs.

## Hotels

Top-level Hotels section supporting multiple stays.

Each hotel contains: - Stay from - Stay to - English name - Chinese
name - Address - Check-in - Check-out

Hotel names support copy actions.

## Flights

Flight stays inside Itinerary.

Fields: - Airline - Flight Number - Departure Airport - Arrival
Airport - Departure Time - Arrival Time - Price

Times are local time.

## External References

Activities and restaurants may have review/reference URLs. Tickets may
have ticket URLs. Show a button only when a URL exists. Open external
links safely in a new tab.

## Images

Use local images. Prefer WebP. Optimize dimensions and file size.
Lazy-load non-critical images. Do not lazy-load Hero.

Suggested widths: - Hero \~1600px - Cards \~800--1000px - Gallery
\~1200--1600px

## Theme

Light mode is default. Dark mode is alternate. Support System
Preference. Persist explicit theme selection with localStorage.

## Visual Style

Modern, contemporary travel UI. Colorful but restrained; modern rather
than plain, but not neon or overly flashy. Use clear typography,
whitespace, rounded cards, subtle depth, and strong hierarchy.

## Icons

Use bundled SVG/universal icons. Do not depend on platform-specific
emoji for important UI.

## Responsive

Mobile-first; support mobile, tablet, and desktop. Use accessible
semantic HTML, keyboard navigation, focus states, good contrast,
accessible buttons, ARIA for accordions, alt text, and reduced-motion
consideration.

## Performance

Prioritize fast mobile loading, local optimized images, WebP, lazy
loading, small JS, minimal dependencies, and no unnecessary API calls.

## Explicitly Out of Scope

Google Maps, Weather API, GPS, live navigation, live restaurant search,
backend, database, login, CMS, user ratings, comments, price level,
booking engine, PWA, service worker, npm/build/install requirement, and
large UI frameworks.

## Reusable Template

Future trips should primarily require changing: - trip data - itinerary
data - restaurant data - hotel data - images

Generic UI must not contain Guangzhou-specific hardcoded content.

## Acceptance Criteria

-   Works as a static site.
-   Deploys to GitHub Pages.
-   No install/build required.
-   Four-day itinerary is clear.
-   Day navigation works.
-   Accordion works.
-   English/Chinese copy works.
-   Restaurant search/filter works.
-   Restaurant references are shared by ID.
-   Multiple hotel stays work.
-   Flights appear in Itinerary.
-   Missing optional fields stay hidden.
-   Light/Dark/System works.
-   Local optimized images are used.
-   No required external API exists.
-   Future trips can be created mainly by changing data/assets.
