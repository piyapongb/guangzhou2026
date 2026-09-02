/**
 * Utils: DOM helpers, icons, formatting, clipboard.
 * No trip-specific content lives here.
 */
(function () {
  "use strict";

  /* ---------- DOM helpers ---------- */

  function el(tag, attrs, children) {
    const node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (key) {
        const value = attrs[key];
        if (value === undefined || value === null || value === false) return;
        if (key === "class") {
          node.className = value;
        } else if (key === "text") {
          node.textContent = value;
        } else if (key === "html") {
          // Only ever used with trusted, hardcoded UI markup (icons), never
          // with data-sourced strings.
          node.innerHTML = value;
        } else if (key.indexOf("data-") === 0 || key.indexOf("aria-") === 0) {
          node.setAttribute(key, value);
        } else if (key === "for") {
          node.setAttribute("for", value);
        } else {
          node.setAttribute(key, value);
        }
      });
    }
    (children || []).forEach(function (child) {
      if (child === undefined || child === null || child === false) return;
      node.appendChild(typeof child === "string" ? document.createTextNode(child) : child);
    });
    return node;
  }

  function clear(node) {
    while (node.firstChild) node.removeChild(node.firstChild);
  }

  /* ---------- Icons (inline SVG, consistent stroke) ---------- */

  const ICON_PATHS = {
    landmark:
      '<path d="M4 21h16"/><path d="M6 21V10"/><path d="M10 21V10"/><path d="M14 21V10"/><path d="M18 21V10"/><path d="M3 10l9-6 9 6"/>',
    park:
      '<path d="M12 3l4 6h-3l4 6h-3l3 5H5l3-5H5l4-6H6l4-6z"/><path d="M12 21v-3"/>',
    museum:
      '<path d="M3 21h18"/><path d="M4 21V10"/><path d="M20 21V10"/><path d="M3 10l9-6 9 6"/><path d="M8 21v-7"/><path d="M12 21v-7"/><path d="M16 21v-7"/>',
    shopping:
      '<path d="M6 8h12l-1 12H7L6 8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
    food:
      '<path d="M5 3v7a3 3 0 0 0 3 3v8"/><path d="M9 3v6"/><path d="M5 3v6"/><path d="M18 3c-1.7 0-3 2-3 5s1.3 5 3 5"/><path d="M18 3v18"/>',
    metro:
      '<rect x="5" y="4" width="14" height="13" rx="3"/><path d="M8 21l1.5-3"/><path d="M16 21l-1.5-3"/><circle cx="9" cy="13" r="1"/><circle cx="15" cy="13" r="1"/><path d="M5 11h14"/>',
    hotel:
      '<path d="M3 21V7l7-4 7 4v14"/><path d="M3 21h18"/><path d="M9 21v-6h6v6"/>',
    flight:
      '<path d="M10.5 20.5l1.5-4 1.5 4-1.5 1-1.5-1z"/><path d="M2 15.5l4-1.5 4 1.5-1-4 1-1.5-8-2.5v6.5l0 1.5z" transform="translate(0)"/><path d="M12 3l9 9-4 1.5L12 9l-5 4.5L3 12l9-9z"/>',
    walk:
      '<circle cx="13" cy="4" r="1.6"/><path d="M10 21l2-6 2 2 3 1"/><path d="M9 13l2-4 3 1 3 4"/><path d="M8 9l3-2"/>',
    "night-view":
      '<path d="M12 3a6 6 0 0 0 8.9 8.9A9 9 0 1 1 12 3z"/>',
    copy:
      '<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/>',
    check: '<path d="M20 6L9 17l-5-5"/>',
    chevron: '<path d="M6 9l6 6 6-6"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',
    close: '<path d="M18 6L6 18"/><path d="M6 6l12 12"/>',
    external: '<path d="M14 3h7v7"/><path d="M10 14L21 3"/><path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h5"/>',
    ticket:
      '<path d="M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4V8z"/><path d="M10 6v12" stroke-dasharray="2 3"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="M4.9 4.9l1.4 1.4"/><path d="M17.7 17.7l1.4 1.4"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="M4.9 19.1l1.4-1.4"/><path d="M17.7 6.3l1.4-1.4"/>',
    moon: '<path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z"/>',
    system: '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8"/><path d="M12 16v4"/>',
    "map-pin": '<path d="M12 21s7-6.1 7-11.5A7 7 0 0 0 5 9.5C5 14.9 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.3"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
    wallet: '<rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 10h18"/><circle cx="16.5" cy="14" r="1"/>',
    train: '<rect x="6" y="3" width="12" height="14" rx="3"/><path d="M6 12h12"/><circle cx="9" cy="16.5" r="0" /><path d="M9 20l-2 2"/><path d="M15 20l2 2"/><circle cx="9.5" cy="8" r="1"/><circle cx="14.5" cy="8" r="1"/>',
    filter: '<path d="M4 5h16"/><path d="M7 12h10"/><path d="M10 19h4"/>',
    image: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="1.6"/><path d="M21 16l-5.5-5.5L7 19"/>',
    weather: '<path d="M7 17a4 4 0 1 1 1.2-7.8A5 5 0 0 1 18 11a3.5 3.5 0 0 1-.5 6.9H7z"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4"/><path d="M8 3v4"/><path d="M3 10h18"/>'
  };

  function iconSvg(name, extraClass) {
    const paths = ICON_PATHS[name];
    if (!paths) return "";
    const cls = "icon" + (extraClass ? " " + extraClass : "");
    return (
      '<svg class="' +
      cls +
      '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' +
      paths +
      "</svg>"
    );
  }

  function icon(name, extraClass) {
    const wrapper = document.createElement("span");
    wrapper.className = "icon-wrap";
    wrapper.innerHTML = iconSvg(name, extraClass);
    return wrapper.firstElementChild;
  }

  /* ---------- Formatting ---------- */

  const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const MONTHS = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  function parseISODate(dateStr) {
    const parts = dateStr.split("-").map(Number);
    return new Date(parts[0], parts[1] - 1, parts[2]);
  }

  function formatDateLong(dateStr) {
    const d = parseISODate(dateStr);
    return WEEKDAYS[d.getDay()] + ", " + d.getDate() + " " + MONTHS[d.getMonth()] + " " + d.getFullYear();
  }

  function formatDateShort(dateStr) {
    const d = parseISODate(dateStr);
    return d.getDate() + " " + MONTHS[d.getMonth()];
  }

  function formatDateRange(startStr, endStr) {
    const start = parseISODate(startStr);
    const end = parseISODate(endStr);
    const sameMonth = start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear();
    if (sameMonth) {
      return start.getDate() + "–" + end.getDate() + " " + MONTHS[end.getMonth()] + " " + end.getFullYear();
    }
    return formatDateShort(startStr) + " – " + formatDateShort(endStr) + " " + end.getFullYear();
  }

  /* ---------- Clipboard ---------- */

  function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      try {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  }

  /* ---------- Misc ---------- */

  function normalize(str) {
    return (str || "").toString().trim().toLowerCase();
  }

  function debounce(fn, delay) {
    let timer = null;
    return function () {
      const args = arguments;
      const ctx = this;
      clearTimeout(timer);
      timer = setTimeout(function () {
        fn.apply(ctx, args);
      }, delay);
    };
  }

  function isSafeExternalUrl(url) {
    if (!url || typeof url !== "string") return false;
    try {
      const parsed = new URL(url, window.location.href);
      return parsed.protocol === "https:" || parsed.protocol === "http:";
    } catch (err) {
      return false;
    }
  }

  function uid(prefix) {
    return prefix + "-" + Math.random().toString(36).slice(2, 9);
  }

  window.Utils = {
    el: el,
    clear: clear,
    icon: icon,
    iconSvg: iconSvg,
    formatDateLong: formatDateLong,
    formatDateShort: formatDateShort,
    formatDateRange: formatDateRange,
    copyToClipboard: copyToClipboard,
    normalize: normalize,
    debounce: debounce,
    isSafeExternalUrl: isSafeExternalUrl,
    uid: uid
  };
})();
