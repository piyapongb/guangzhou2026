#!/usr/bin/env node
/**
 * Wire up a photo you already have on disk to a restaurant, hotel, or
 * itinerary stop — one command instead of hand-editing folders and paths.
 *
 *   node tools/add-image.js --list                 show every id you can target
 *   node tools/add-image.js ~/Downloads/pic.jpg restaurant-011
 *   node tools/add-image.js ~/Downloads/pic.jpg restaurant-011 --gallery
 *   node tools/add-image.js ~/Downloads/pic.jpg d2-chen-clan
 *   node tools/add-image.js ~/Downloads/pic.jpg hotel-002 --force
 *   node tools/add-image.js ~/Downloads/pic.jpg hero        the header/cover photo
 *
 * What it does:
 *   1. Looks up <id> in data/restaurants.js, data/hotels.js, and
 *      data/itinerary.js to find which one owns it and which field that
 *      record uses (`image` for restaurants/hotels, `thumbnail` for
 *      itinerary stops). The one exception is the special id "hero",
 *      which always means the site's header/cover photo in data/trip.js.
 *   2. Copies your file into the matching assets/images/<category>/
 *      folder as <id>.<ext> (e.g. restaurant-011.jpg) - a fixed,
 *      predictable name, so re-running the same command later just
 *      replaces the photo instead of piling up files.
 *   3. Rewrites that one field in the data file to point at the new path.
 *
 * It does not touch git - review the change and commit/push it yourself
 * (the last section printed after a successful run has the exact
 * commands).
 */
"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const ALLOWED_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"]);
const CREDITS_FILE = path.join(ROOT, "assets/images/CREDITS.md");

const SOURCES = [
  { file: "data/restaurants.js", global: "RESTAURANTS_DATA", dir: "assets/images/restaurants", field: "image", label: "restaurant" },
  { file: "data/hotels.js", global: "HOTELS_DATA", dir: "assets/images/hotels", field: "image", label: "hotel" },
  { file: "data/itinerary.js", global: "ITINERARY_DATA", dir: "assets/images/activities", field: "thumbnail", label: "itinerary stop" }
];

const TRIP_FILE = "data/trip.js";
const HERO_SOURCE = { file: TRIP_FILE, dir: "assets/images", field: "heroImage", label: "hero image" };

function loadDataGlobal(relPath, globalName) {
  const sandbox = { window: {} };
  const code = fs.readFileSync(path.join(ROOT, relPath), "utf8");
  new Function("window", code + "\nreturn window;")(sandbox.window);
  return sandbox.window[globalName];
}

function flattenItinerary(days) {
  const rows = [];
  days.forEach(function (day) {
    (day.items || []).forEach(function (item) {
      rows.push({ id: item.id, name: item.title + (item.titleZh ? " / " + item.titleZh : "") + "  [" + day.id + "]" });
    });
  });
  return rows;
}

function findTarget(id) {
  if (id === "hero") {
    const trip = loadDataGlobal(TRIP_FILE, "TRIP_DATA");
    return { source: HERO_SOURCE, record: trip };
  }

  const restaurants = loadDataGlobal("data/restaurants.js", "RESTAURANTS_DATA");
  const hit1 = restaurants.find(function (r) { return r.id === id; });
  if (hit1) return { source: SOURCES[0], record: hit1 };

  const hotels = loadDataGlobal("data/hotels.js", "HOTELS_DATA");
  const hit2 = hotels.find(function (h) { return h.id === id; });
  if (hit2) return { source: SOURCES[1], record: hit2 };

  const days = loadDataGlobal("data/itinerary.js", "ITINERARY_DATA");
  for (const day of days) {
    const hit3 = (day.items || []).find(function (item) { return item.id === id; });
    if (hit3) return { source: SOURCES[2], record: hit3 };
  }
  return null;
}

function listAll() {
  const trip = loadDataGlobal(TRIP_FILE, "TRIP_DATA");
  console.log("Site header (data/trip.js):");
  console.log("  " + "hero".padEnd(16) + "Cover photo" + (trip.heroImage ? "" : "   (no image yet)"));

  console.log("\nRestaurants (data/restaurants.js):");
  loadDataGlobal("data/restaurants.js", "RESTAURANTS_DATA").forEach(function (r) {
    console.log("  " + r.id.padEnd(16) + r.name + (r.image ? "" : "   (no image yet)"));
  });

  console.log("\nHotels (data/hotels.js):");
  loadDataGlobal("data/hotels.js", "HOTELS_DATA").forEach(function (h) {
    console.log("  " + h.id.padEnd(16) + h.name + (h.image ? "" : "   (no image yet)"));
  });

  console.log("\nItinerary stops (data/itinerary.js):");
  flattenItinerary(loadDataGlobal("data/itinerary.js", "ITINERARY_DATA")).forEach(function (row) {
    console.log("  " + row.id.padEnd(24) + row.name);
  });
}

/* Rewrite exactly the one field on the one record whose id matches -
   plain text substitution, not a JS AST, so it only ever touches the
   field belonging to this id even if the same path string appears
   elsewhere in the file. */
function rewriteField(relPath, id, field, newPath, isGalleryPush) {
  const full = path.join(ROOT, relPath);
  const src = fs.readFileSync(full, "utf8");

  // trip.js holds one plain object, not an array of id-tagged records, so
  // there's nothing to bound the edit to - just replace its one field.
  if (relPath === TRIP_FILE) {
    const fieldRegex = new RegExp(field + ':\\s*"[^"]*"');
    if (!fieldRegex.test(src)) throw new Error("Could not find `" + field + "` in " + relPath + ".");
    fs.writeFileSync(full, src.replace(fieldRegex, field + ': "' + newPath + '"'));
    return;
  }

  const idIndex = src.indexOf('id: "' + id + '"');
  if (idIndex === -1) throw new Error("Could not relocate id \"" + id + "\" for rewriting.");

  // Bound the edit to this one record: from its `id:` line to the next
  // record's `id:` line (or end of file), so the substitution can only
  // land inside this entry.
  const nextIdIndex = src.indexOf('id: "', idIndex + 1);
  const recordEnd = nextIdIndex === -1 ? src.length : nextIdIndex;
  const before = src.slice(0, idIndex);
  const record = src.slice(idIndex, recordEnd);
  const after = src.slice(recordEnd);

  let newRecord;
  if (isGalleryPush) {
    const galleryMatch = record.match(/gallery:\s*\[([^\]]*)\]/);
    if (!galleryMatch) throw new Error("No `gallery: []` field found on this record.");
    const items = galleryMatch[1].trim();
    const sep = items ? ",\n      " : "";
    const insertion = items + sep + '"' + newPath + '"';
    newRecord = record.replace(galleryMatch[0], "gallery: [\n      " + insertion + "\n    ]");
  } else {
    const fieldRegex = new RegExp(field + ':\\s*"[^"]*"');
    if (fieldRegex.test(record)) {
      newRecord = record.replace(fieldRegex, field + ': "' + newPath + '"');
    } else {
      // Field absent (e.g. an itinerary stop with no thumbnail yet) -
      // add it right after the id line.
      newRecord = record.replace(
        /(id:\s*"[^"]*",\n)/,
        '$1        ' + field + ': "' + newPath + '",\n'
      );
    }
  }

  fs.writeFileSync(full, before + newRecord + after);
}

/* Every file already in destRelDir named <id>.<anything>, so a replace
   can be recognized (and cleaned up) even when the extension changes. */
function findExistingForId(destRelDir, id) {
  const absDir = path.join(ROOT, destRelDir);
  if (!fs.existsSync(absDir)) return [];
  return fs.readdirSync(absDir)
    .filter(function (f) { return f === id || f.startsWith(id + "."); })
    .map(function (f) { return destRelDir + "/" + f; });
}

function appendCredit(destRelPath, note) {
  const line = "\n## " + destRelPath + "\n- Added manually from a local file" +
    (note ? ": " + note : "") + "\n";
  fs.appendFileSync(CREDITS_FILE, line);
}

function parseArgs(argv) {
  const opts = { force: false, gallery: false, credit: null, list: false, positional: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--list") opts.list = true;
    else if (a === "--force") opts.force = true;
    else if (a === "--gallery") opts.gallery = true;
    else if (a === "--credit") opts.credit = argv[++i];
    else opts.positional.push(a);
  }
  return opts;
}

function main() {
  const opts = parseArgs(process.argv.slice(2));

  if (opts.list || opts.positional.length === 0) {
    listAll();
    if (opts.positional.length === 0 && !opts.list) {
      console.log("\nUsage: node tools/add-image.js <local-file> <id> [--gallery] [--force] [--credit \"text\"]");
    }
    return;
  }

  const [sourcePath, id] = opts.positional;
  if (!sourcePath || !id) {
    console.error("Usage: node tools/add-image.js <local-file> <id> [--gallery] [--force]");
    process.exit(1);
  }

  const absSource = path.resolve(process.cwd(), sourcePath);
  if (!fs.existsSync(absSource)) {
    console.error("File not found: " + absSource);
    process.exit(1);
  }

  const ext = path.extname(absSource).toLowerCase();
  if (!ALLOWED_EXT.has(ext)) {
    console.error("Unsupported file type \"" + ext + "\". Allowed: " + [...ALLOWED_EXT].join(", "));
    process.exit(1);
  }

  const target = findTarget(id);
  if (!target) {
    console.error("No record with id \"" + id + "\" found in restaurants.js, hotels.js, or itinerary.js.");
    console.error("Run `node tools/add-image.js --list` to see valid ids.");
    process.exit(1);
  }

  if (opts.gallery && target.source.label !== "restaurant") {
    console.error("--gallery only applies to restaurants (id starts with \"restaurant-\").");
    process.exit(1);
  }

  if (target.record.type === "flight") {
    console.warn("Note: flight timeline cards never show a thumbnail, so this photo will be saved but won't appear anywhere.");
  }

  const destRelDir = target.source.dir;
  const destRelPath = destRelDir + "/" + id + ext;
  const destAbsPath = path.join(ROOT, destRelPath);

  // Match <id>.<any extension> so switching e.g. .jpg -> .png is treated
  // as replacing the existing photo, not adding a second stray file.
  const existingSameId = opts.gallery ? [] : findExistingForId(destRelDir, id);

  if (existingSameId.length && !opts.force) {
    console.error(existingSameId.join(", ") + " already exists. Pass --force to overwrite it.");
    process.exit(1);
  }

  fs.mkdirSync(path.join(ROOT, destRelDir), { recursive: true });

  let finalDestRelPath = destRelPath;
  if (opts.gallery) {
    // Never overwrite another gallery photo for the same id: number it.
    let n = 2;
    while (fs.existsSync(path.join(ROOT, destRelDir, id + "-" + n + ext))) n++;
    finalDestRelPath = destRelDir + "/" + id + "-" + n + ext;
  }

  fs.copyFileSync(absSource, path.join(ROOT, finalDestRelPath));

  // Remove any leftover file(s) under the old extension now that the data
  // file is about to point at finalDestRelPath instead.
  existingSameId
    .filter(function (rel) { return rel !== finalDestRelPath; })
    .forEach(function (rel) { fs.unlinkSync(path.join(ROOT, rel)); });

  rewriteField(target.source.file, id, target.source.field, finalDestRelPath, opts.gallery);

  if (opts.credit) appendCredit(finalDestRelPath, opts.credit);

  console.log("Copied to " + finalDestRelPath);
  console.log((opts.gallery ? "Added to gallery" : "Set " + target.source.field) +
    " on " + target.source.label + " \"" + id + "\" in " + target.source.file);
  console.log("\nCheck it in the browser, then:");
  console.log("  git add " + finalDestRelPath + " " + target.source.file +
    (opts.credit ? " assets/images/CREDITS.md" : ""));
  console.log("  git commit -m \"Add photo for " + id + "\"");
  console.log("  git push");
}

main();
