# Guangzhou Trip 2026 --- UX/UI Wireframe

## 1. Information Architecture

``` text
HERO
  ↓
MAIN TABS
  ├── Itinerary
  ├── Restaurants
  └── Hotels
```

## 2. Hero

``` text
┌─────────────────────────────────────┐
│          [ HERO IMAGE ]             │
│                                     │
│       Guangzhou Trip 2026           │
│       22–25 Oct 2026                │
└─────────────────────────────────────┘
```

Mobile hero stays compact.

## 3. Main Tabs

``` text
┌─────────────────────────────────────┐
│ ITINERARY │ RESTAURANTS │ HOTELS    │
└─────────────────────────────────────┘
```

Clear active state.

## 4. Day Navigation

``` text
┌─────────────────────────────────────┐
│ Day 1 │ Day 2 │ Day 3 │ Day 4  →   │
└─────────────────────────────────────┘
```

Horizontal scrolling on mobile. Desktop can show all days.

## 5. Weather

``` text
┌─────────────────────────────────────┐
│ WEATHER                             │
│ Partly cloudy       24–29°C         │
│ Rain 30%            Humidity 72%    │
│ Wind 12 km/h        Feels like 30°C │
│ UV Index 6                           │
└─────────────────────────────────────┘
```

Hide when no data exists.

## 6. Activity Card

Collapsed:

``` text
┌─────────────────────────────────────┐
│ 13:00                               │
│ [IMG]  Canton Tower       [Copy]    │
│        广州塔              [Copy]    │
│        [landmark icon]              │
│                         [Details +] │
└─────────────────────────────────────┘
```

Expanded:

``` text
Description
คำอธิบายภาษาไทยสั้น ๆ

Location
...

Transport
Metro

Metro Station
Canton Tower

Exit
A

Travel time     20 min
Travel cost     ¥3
Entrance fee    ¥150

[Ticket] [Reviews]
```

## 7. Restaurant Timeline

``` text
┌─────────────────────────────────────┐
│ 12:00                               │
│ [food icon] Lunch                   │
│                         [Details +] │
└─────────────────────────────────────┘
```

Expanded shows preselected nearby restaurants from master data.

## 8. Restaurant Guide

``` text
┌─────────────────────────────────────┐
│ RESTAURANTS                         │
│                                     │
│ [ Search restaurants...          ]  │
│ Cuisine: [ All ▼ ]                  │
│                                     │
│ TIANHE                              │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ [image]                         │ │
│ │ Restaurant Name       [Copy]    │ │
│ │ Chinese Name          [Copy]    │ │
│ │ Cantonese · Dim Sum            │ │
│ │                     [Details +] │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

## 9. Restaurant Detail

``` text
Description
คำอธิบายภาษาไทย

Cuisine
Cantonese · Dim Sum

Address
...

Price
¥80–150

Recommended Dishes
• Shrimp Dumpling
• Char Siu Bun

[Gallery]

[Reviews]
```

## 10. Hotels

``` text
┌─────────────────────────────────────┐
│ HOTELS                              │
│                                     │
│ 22 Oct – 24 Oct                     │
│ Hotel Name                [Copy]    │
│ Chinese Name              [Copy]    │
│                         [Details +] │
└─────────────────────────────────────┘
```

Expanded:

``` text
Address
...

Check-in
15:00

Check-out
12:00
```

Multiple hotel cards are supported.

## 11. Flight

Flight is shown within the itinerary:

``` text
┌─────────────────────────────────────┐
│ ✈ FLIGHT                            │
│ Airline                             │
│ Flight Number                       │
│                                     │
│ CNX              →             CAN  │
│ 10:30                         14:20 │
│                                     │
│ Price: ฿5,900                       │
└─────────────────────────────────────┘
```

## 12. Copy Feedback

``` text
Canton Tower  [Copy]
广州塔         [Copy]

→ tap

广州塔         [✓ Copied]
```

Feedback disappears automatically.

## 13. Theme

Compact theme control with: - Light - Dark - System

Light is default.

## 14. Mobile Rules

-   Single-column cards
-   Large touch targets
-   Sticky/scrollable day navigation
-   Accordion details
-   Short text blocks
-   Easy copy buttons
-   No full-page horizontal scrolling
-   Important information visible quickly

## 15. Desktop Rules

Use a wider container and optional two-column supporting layouts where
useful. Do not turn the itinerary into a dense spreadsheet.

## 16. Visual Direction

Modern travel UI with: - light neutral base - restrained accents -
modern typography - rounded cards - subtle borders/shadows - timeline
line/dots - consistent SVG icons - restrained animation

Avoid neon, excessive gradients, excessive glassmorphism, huge headings,
and emoji as primary icons.

## 17. Accessibility

-   Accessible labels for copy buttons
-   `aria-expanded` for accordions
-   Alt text
-   Accessible icon-only buttons
-   Visible focus
-   External links clearly identified

## 18. Responsive Breakpoints

Concept: - Mobile \< 768px - Tablet 768--1023px - Desktop ≥ 1024px

Exact values can be tuned during implementation.

## 19. UX Priority

The user should answer these quickly: 1. วันนี้วันที่เท่าไร? 2. ต่อไปไปไหน? 3.
กี่โมง? 4. ชื่อจีนว่าอะไร? 5. Copy ชื่อจีนอย่างไร? 6. ไปด้วยอะไร? 7. ลง Metro
สถานีไหน? 8. Exit ไหน? 9. ค่าใช้จ่ายเท่าไร? 10. มีร้านอะไรใกล้ ๆ? 11. นอนที่ไหน?
