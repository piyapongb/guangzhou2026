/**
 * App: state, wiring, and rendering orchestration.
 */
(function () {
  "use strict";

  const U = window.Utils;
  const C = window.Components;

  const state = {
    activeTab: "itinerary",
    activeDay: null,
    theme: "system"
  };

  let restaurantIndex = {};
  let copyResetTimer = null;

  /* ---------- Bootstrap ---------- */

  function init() {
    const trip = window.TRIP_DATA;
    const days = window.ITINERARY_DATA || [];
    const restaurants = window.RESTAURANTS_DATA || [];
    const hotels = window.HOTELS_DATA || [];

    restaurantIndex = buildRestaurantIndex(restaurants);
    validateReferences(days, restaurantIndex);

    document.getElementById("hero-root").appendChild(C.renderHero(trip));

    document.title = trip.title + " — Travel Itinerary";

    renderTabs();
    renderItineraryPanel(days, restaurantIndex);
    renderRestaurantsPanel(restaurants);
    renderHotelsPanel(hotels);

    state.activeDay = days.length ? days[0].id : null;

    bindTabEvents();
    bindAccordionEvents();
    bindCopyEvents();
    bindDayNavEvents(days);
    bindLightboxEvents();
    bindThemeEvents();
    initTheme();
    initDayObserver(days);
    initStickyOffsets();
  }

  /* ---------- Sticky header offsets ---------- */

  function syncStickyOffsets() {
    const root = document.documentElement;
    const utilityBar = document.querySelector(".utility-bar");
    const tabsBar = document.querySelector(".main-tabs-bar");
    const dayNav = document.querySelector(".day-nav");
    root.style.setProperty("--utility-bar-height", (utilityBar ? utilityBar.offsetHeight : 0) + "px");
    root.style.setProperty("--main-tabs-height", (tabsBar ? tabsBar.offsetHeight : 0) + "px");
    if (dayNav) {
      root.style.setProperty("--day-nav-height", dayNav.offsetHeight + "px");
    }
  }

  function initStickyOffsets() {
    requestAnimationFrame(syncStickyOffsets);
    window.addEventListener("resize", U.debounce(syncStickyOffsets, 150));
  }

  function buildRestaurantIndex(restaurants) {
    const index = {};
    restaurants.forEach(function (r) {
      index[r.id] = r;
    });
    return index;
  }

  function validateReferences(days, index) {
    days.forEach(function (day) {
      (day.items || []).forEach(function (item) {
        if (item.type !== "restaurant") return;
        const ids = [item.restaurantId].concat(item.nearbyRestaurantIds || []);
        ids.forEach(function (id) {
          if (id && !index[id]) {
            console.warn("[itinerary] Unknown restaurantId referenced:", id, "in item", item.id);
          }
        });
      });
    });
  }

  /* ---------- Main tabs ---------- */

  function renderTabs() {
    const root = document.getElementById("main-tabs-root");
    root.appendChild(C.renderMainTabs(state.activeTab));
  }

  function bindTabEvents() {
    const root = document.getElementById("main-tabs-root");
    root.addEventListener("click", function (e) {
      const btn = e.target.closest("[data-tab-target]");
      if (!btn) return;
      setActiveTab(btn.getAttribute("data-tab-target"));
    });
    root.addEventListener("keydown", function (e) {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      const tabs = Array.from(root.querySelectorAll("[data-tab-target]"));
      const currentIndex = tabs.findIndex(function (t) { return t.getAttribute("aria-selected") === "true"; });
      const nextIndex = e.key === "ArrowRight"
        ? (currentIndex + 1) % tabs.length
        : (currentIndex - 1 + tabs.length) % tabs.length;
      tabs[nextIndex].focus();
      setActiveTab(tabs[nextIndex].getAttribute("data-tab-target"));
    });
  }

  function setActiveTab(tabId) {
    state.activeTab = tabId;
    document.querySelectorAll("[data-tab-target]").forEach(function (btn) {
      const isActive = btn.getAttribute("data-tab-target") === tabId;
      btn.classList.toggle("is-active", isActive);
      btn.setAttribute("aria-selected", isActive ? "true" : "false");
      btn.tabIndex = isActive ? 0 : -1;
    });
    document.querySelectorAll(".tab-panel").forEach(function (panel) {
      panel.hidden = panel.id !== "panel-" + tabId;
    });
  }

  /* ---------- Itinerary panel ---------- */

  function renderItineraryPanel(days, restaurantIndexMap) {
    const panel = document.getElementById("panel-itinerary");
    U.clear(panel);
    if (!days.length) return;

    panel.appendChild(C.renderDayNav(days, days[0].id));
    const daysWrap = U.el("div", { class: "days-wrap" });
    days.forEach(function (day) {
      daysWrap.appendChild(C.renderDaySection(day, restaurantIndexMap));
    });
    panel.appendChild(daysWrap);
  }

  function bindDayNavEvents(days) {
    document.addEventListener("click", function (e) {
      const btn = e.target.closest("[data-day-target]");
      if (!btn) return;
      const target = document.getElementById(btn.getAttribute("data-day-target"));
      if (!target) return;
      target.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
    });
  }

  function setActiveDay(dayId) {
    if (state.activeDay === dayId) return;
    state.activeDay = dayId;
    document.querySelectorAll("[data-day-target]").forEach(function (btn) {
      const isActive = btn.getAttribute("data-day-target") === dayId;
      btn.classList.toggle("is-active", isActive);
      btn.setAttribute("aria-selected", isActive ? "true" : "false");
      if (isActive) {
        btn.scrollIntoView({ behavior: "auto", block: "nearest", inline: "center" });
      }
    });
  }

  function initDayObserver(days) {
    if (!("IntersectionObserver" in window) || !days.length) return;
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            setActiveDay(entry.target.id);
          }
        });
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: 0 }
    );
    days.forEach(function (day) {
      const section = document.getElementById(day.id);
      if (section) observer.observe(section);
    });
  }

  /* ---------- Restaurants panel ---------- */

  function renderRestaurantsPanel(restaurants) {
    const panel = document.getElementById("panel-restaurants");
    U.clear(panel);

    const toolbar = U.el("div", { class: "restaurant-toolbar" });
    const searchWrap = U.el("div", { class: "search-field" });
    searchWrap.appendChild(U.icon("search", "search-field-icon"));
    const searchInput = U.el("input", {
      type: "search",
      id: "restaurant-search",
      class: "search-input",
      placeholder: "Search restaurants...",
      "aria-label": "Search restaurants by English or Chinese name"
    });
    searchWrap.appendChild(searchInput);
    toolbar.appendChild(searchWrap);

    const filterWrap = U.el("div", { class: "filter-field" });
    filterWrap.appendChild(U.el("label", { for: "cuisine-filter", class: "filter-label" }, ["Cuisine"]));
    const cuisineSelect = C.renderCuisineFilter(C.getUniqueCuisines(restaurants));
    filterWrap.appendChild(cuisineSelect);
    toolbar.appendChild(filterWrap);

    panel.appendChild(toolbar);

    const resultsWrap = U.el("div", { id: "restaurant-results" });
    const emptyState = U.el("p", { class: "empty-note", id: "restaurant-empty" }, ["No restaurants match your search."]);
    emptyState.hidden = true;

    const zones = C.groupByZone(restaurants);
    zones.forEach(function (group) {
      const zoneSection = U.el("div", { class: "zone-group", "data-zone-group": "" });
      zoneSection.appendChild(U.el("h3", { class: "zone-heading" }, [group.zone]));
      const grid = U.el("div", { class: "restaurant-grid" });
      group.restaurants.forEach(function (r) {
        grid.appendChild(C.renderRestaurantCard(r));
      });
      zoneSection.appendChild(grid);
      resultsWrap.appendChild(zoneSection);
    });

    panel.appendChild(resultsWrap);
    panel.appendChild(emptyState);

    const applyFilter = U.debounce(function () {
      filterRestaurants(searchInput.value, cuisineSelect.value);
    }, 120);

    searchInput.addEventListener("input", applyFilter);
    cuisineSelect.addEventListener("change", applyFilter);
  }

  function filterRestaurants(query, cuisine) {
    const q = U.normalize(query);
    const c = U.normalize(cuisine);
    let visibleCount = 0;

    document.querySelectorAll("#restaurant-results .restaurant-card").forEach(function (card) {
      const matchesQuery = !q || card.getAttribute("data-search").indexOf(q) !== -1;
      const matchesCuisine = !c || card.getAttribute("data-cuisine").split("|").indexOf(c) !== -1;
      const visible = matchesQuery && matchesCuisine;
      card.hidden = !visible;
      if (visible) visibleCount++;
    });

    document.querySelectorAll("[data-zone-group]").forEach(function (group) {
      const anyVisible = Array.from(group.querySelectorAll(".restaurant-card")).some(function (c) {
        return !c.hidden;
      });
      group.hidden = !anyVisible;
    });

    const empty = document.getElementById("restaurant-empty");
    if (empty) empty.hidden = visibleCount !== 0;
  }

  /* ---------- Hotels panel ---------- */

  function renderHotelsPanel(hotels) {
    const panel = document.getElementById("panel-hotels");
    U.clear(panel);
    if (!hotels.length) return;
    const list = U.el("div", { class: "hotel-list" });
    hotels.forEach(function (hotel) {
      list.appendChild(C.renderHotelCard(hotel));
    });
    panel.appendChild(list);
  }

  /* ---------- Accordion (event delegation) ---------- */

  function bindAccordionEvents() {
    document.addEventListener("click", function (e) {
      const btn = e.target.closest(".details-toggle");
      if (!btn) return;
      toggleAccordion(btn);
    });
  }

  function toggleAccordion(btn) {
    const panel = document.getElementById(btn.getAttribute("aria-controls"));
    if (!panel) return;
    const isOpen = btn.getAttribute("aria-expanded") === "true";

    if (isOpen) {
      btn.setAttribute("aria-expanded", "false");
      panel.classList.remove("is-open");
      const onEnd = function () {
        panel.hidden = true;
        panel.removeEventListener("transitionend", onEnd);
      };
      if (prefersReducedMotion()) {
        panel.hidden = true;
      } else {
        panel.addEventListener("transitionend", onEnd);
      }
    } else {
      panel.hidden = false;
      btn.setAttribute("aria-expanded", "true");
      requestAnimationFrame(function () {
        panel.classList.add("is-open");
      });
    }
  }

  /* ---------- Copy buttons (event delegation) ---------- */

  function bindCopyEvents() {
    document.addEventListener("click", function (e) {
      const btn = e.target.closest(".copy-btn");
      if (!btn) return;
      const value = btn.getAttribute("data-copy-value");
      if (!value) return;
      U.copyToClipboard(value).then(
        function () { showCopyFeedback(btn); },
        function () { console.warn("[copy] Clipboard copy failed."); }
      );
    });
  }

  function showCopyFeedback(btn) {
    btn.classList.add("is-copied");
    const prevLabel = btn.getAttribute("aria-label");
    btn.setAttribute("aria-label", "Copied");
    clearTimeout(btn._copyTimer);
    btn._copyTimer = setTimeout(function () {
      btn.classList.remove("is-copied");
      btn.setAttribute("aria-label", prevLabel);
    }, 1600);
  }

  /* ---------- Lightbox ---------- */

  function bindLightboxEvents() {
    const dialog = document.getElementById("lightbox");
    const img = document.getElementById("lightbox-image");
    const closeBtn = document.getElementById("lightbox-close");

    document.addEventListener("click", function (e) {
      const trigger = e.target.closest("[data-lightbox-src]");
      if (!trigger) return;
      img.src = trigger.getAttribute("data-lightbox-src");
      img.alt = trigger.getAttribute("aria-label") || "";
      if (typeof dialog.showModal === "function") {
        dialog.showModal();
      } else {
        dialog.setAttribute("open", "");
      }
    });

    closeBtn.addEventListener("click", function () {
      dialog.close ? dialog.close() : dialog.removeAttribute("open");
    });

    dialog.addEventListener("click", function (e) {
      if (e.target === dialog) {
        dialog.close ? dialog.close() : dialog.removeAttribute("open");
      }
    });
  }

  /* ---------- Theme ---------- */

  const THEME_KEY = "trip-theme-preference";

  function initTheme() {
    const stored = localStorage.getItem(THEME_KEY);
    state.theme = stored || "system";
    applyTheme(state.theme);
    updateThemeControlUI();

    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function () {
      if (state.theme === "system") applyTheme("system");
    });
  }

  function applyTheme(theme) {
    const root = document.documentElement;
    if (theme === "system") {
      root.removeAttribute("data-theme");
    } else {
      root.setAttribute("data-theme", theme);
    }
  }

  function bindThemeEvents() {
    const control = document.getElementById("theme-control");
    if (!control) return;
    control.addEventListener("click", function (e) {
      const btn = e.target.closest("[data-theme-option]");
      if (!btn) return;
      const theme = btn.getAttribute("data-theme-option");
      state.theme = theme;
      localStorage.setItem(THEME_KEY, theme);
      applyTheme(theme);
      updateThemeControlUI();
    });
  }

  function updateThemeControlUI() {
    document.querySelectorAll("[data-theme-option]").forEach(function (btn) {
      const isActive = btn.getAttribute("data-theme-option") === state.theme;
      btn.classList.toggle("is-active", isActive);
      btn.setAttribute("aria-pressed", isActive ? "true" : "false");
    });
  }

  /* ---------- Helpers ---------- */

  function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
