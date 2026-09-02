# Guangzhou Trip 2026 --- Technical Specification

## Technology

Required: - HTML5 - CSS3 - Vanilla JavaScript

Avoid: - React/Vue/Angular - npm - Node runtime requirement - bundlers -
package installation - external API dependencies

## Project Structure

``` text
/
├── index.html
├── css/
│   ├── styles.css
│   └── responsive.css
├── js/
│   ├── app.js
│   ├── components.js
│   └── utils.js
├── data/
│   ├── trip.js
│   ├── itinerary.js
│   ├── restaurants.js
│   └── hotels.js
├── assets/
│   ├── icons/
│   └── images/
└── docs/
    ├── REQUIREMENTS.md
    ├── DATA_SPEC.md
    ├── TECHNICAL_SPEC.md
    └── UX_WIREFRAME.md
```

The exact JS split can be simplified, but data/UI separation is
mandatory.

## Rendering

``` text
Trip Data
   ↓
App State
   ↓
Main Navigation
   ↓
Itinerary / Restaurants / Hotels
```

Use reusable rendering functions for Day Navigation, Weather, Timeline
Items, Activity Details, Restaurant Cards, Hotel Cards, Accordion, Copy
Button, and Lightbox.

## State

Only minimal client state: - active main tab - active day - restaurant
search - cuisine filter - theme - accordion/lightbox state

## Theme

Use CSS custom properties. Support light, dark, and system. Store
explicit choice in localStorage. System uses `prefers-color-scheme`.

## Navigation

Main tabs switch sections without page navigation. Day navigation
scrolls to day sections. `scroll-behavior: smooth` and
IntersectionObserver may be used.

## Accordion

Use semantic buttons, keyboard support, `aria-expanded`, and controlled
panels.

## Copy

Use `navigator.clipboard.writeText()`. Provide brief visual and
accessible feedback.

## Restaurant Search

Search normalized English and Chinese names. Cuisine filtering is
client-side.

## Restaurant Resolution

Build a restaurant index by ID. Resolve itinerary restaurant IDs to
master records. Invalid references should fail gracefully and warn in
development.

## External Links

Use `target="_blank"` and `rel="noopener noreferrer"`. Do not render
empty links.

## Images

Local assets only. Use meaningful alt text, explicit dimensions/aspect
ratio, lazy loading for non-critical images, and eager loading for Hero.

## Image Optimization

Resize first, convert JPG/PNG to WebP, compress to an acceptable visual
quality, and keep originals outside deployed assets if desired. The
website itself does not need an image conversion library.

## Performance

No framework, no required network APIs, optimized images, lazy loading,
minimal JS/CSS, restrained animations.

## Security

No user-generated HTML. Avoid inserting untrusted data as raw HTML where
practical. Treat external URLs as untrusted data. No secrets/API keys.

## GitHub Pages

Use relative paths. Avoid server-side routing. Root `index.html` must
work as a static site and under a repository subpath.

## Browser Support

Modern Chrome, Edge, Safari, Firefox, iOS Safari, and Android Chrome.

## No Build

A developer can clone/copy the project and deploy it directly. No
package installation is required.

## Code Quality

Small functions, separated data, reusable components, descriptive IDs,
consistent naming, minimal comments, and no Guangzhou-specific
hardcoding inside generic components.

## Future Trip Workflow

``` text
Copy template
   ↓
Replace trip.js
   ↓
Replace itinerary.js
   ↓
Replace restaurants.js
   ↓
Replace hotels.js
   ↓
Replace images
   ↓
Deploy
```

## Definition of Done

Static deployment, all tabs, itinerary, shared restaurant data, hotels,
flights, copy, accordion, search/filter, themes, responsive layout,
optimized images, conditional optional fields, and future-trip data
replacement all work.
