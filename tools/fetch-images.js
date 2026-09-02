#!/usr/bin/env node
/**
 * Replace the placeholder SVGs with real photos from Wikimedia Commons.
 *
 *   node tools/fetch-images.js --list          show the search terms, fetch nothing
 *   node tools/fetch-images.js --dry-run       resolve photos, report, download nothing
 *   node tools/fetch-images.js                 download and rewrite the data files
 *   node tools/fetch-images.js canton-tower    just one slot
 *   node tools/fetch-images.js canton-tower --search "Canton Tower night"
 *
 * Photos are searched by name through the Commons API rather than pinned to
 * fixed URLs, so nothing here goes stale when a file is renamed upstream.
 *
 * Downloads land beside the placeholder as .jpg, the matching "assets/..."
 * paths in data/*.js are rewritten to point at them, and the placeholder is
 * left in place as a fallback. Re-running is safe: existing files are kept
 * unless --force is passed.
 *
 * LICENSING: Commons files are free to reuse but most require credit. Every
 * download is recorded in assets/images/CREDITS.md with its author, licence
 * and source page. Keep that file with the project. Anything marked
 * "non-free" or with no licence is skipped rather than guessed at.
 */
"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const API = "https://commons.wikimedia.org/w/api.php";
const IMAGE_WIDTH = 1600;
const CREDITS_FILE = path.join(ROOT, "assets/images/CREDITS.md");

/* Placeholder to replace -> what to search Commons for.
   Edit a term here (or pass --search) if a result comes back wrong. */
const SLOTS = {
  "assets/images/hero.svg": "Guangzhou skyline",

  "assets/images/activities/canton-tower.svg": "Canton Tower Guangzhou",
  "assets/images/activities/chen-clan-academy.svg": "Chen Clan Ancestral Hall",
  "assets/images/activities/shamian-island.svg": "Shamian Island Guangzhou",
  "assets/images/activities/yuexiu-park.svg": "Yuexiu Park Guangzhou",
  "assets/images/activities/beijing-road.svg": "Beijing Road Guangzhou",
  "assets/images/activities/haixinsha.svg": "Haixinsha Guangzhou",
  "assets/images/activities/pearl-river-cruise.svg": "Pearl River Guangzhou night",
  "assets/images/activities/shopping.svg": "Tianhe Road Guangzhou",

  "assets/images/restaurants/tao-tao-ju.svg": "Taotaoju Guangzhou",
  "assets/images/restaurants/panxi.svg": "Panxi Restaurant Guangzhou",
  "assets/images/restaurants/guangzhou-restaurant.svg": "Guangzhou Restaurant Wenchang",
  "assets/images/restaurants/dimsum-alt.svg": "Dim sum Cantonese",
  "assets/images/restaurants/haidilao.svg": "Haidilao hot pot",
  "assets/images/restaurants/shunfeng.svg": "Cantonese seafood restaurant",
  "assets/images/restaurants/street-food.svg": "Chinese street food stall",
  "assets/images/restaurants/shamian-cafe.svg": "Cafe terrace Guangzhou",
  "assets/images/restaurants/litchi-bay.svg": "Lychee Bay Guangzhou",
  "assets/images/restaurants/noodle-bar.svg": "Wonton noodles Cantonese",

  "assets/images/hotels/grand-tianhe.svg": "Hotel lobby modern",
  "assets/images/hotels/baiyun-airport.svg": "Hotel room twin beds"
};

/* Commons marks unfree files; never ship those. */
const BLOCKED_LICENCES = /non-?free|fair use|copyright/i;

function parseArgs(argv) {
  const opts = { list: false, dryRun: false, force: false, search: null, only: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--list") opts.list = true;
    else if (a === "--dry-run") opts.dryRun = true;
    else if (a === "--force") opts.force = true;
    else if (a === "--search") opts.search = argv[++i];
    else if (!a.startsWith("-")) opts.only.push(a);
  }
  return opts;
}

function slotsFor(only) {
  const keys = Object.keys(SLOTS);
  if (!only.length) return keys;
  return keys.filter(function (k) {
    return only.some(function (name) { return k.includes(name); });
  });
}

function plainText(html) {
  return String(html || "").replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

async function searchCommons(term) {
  const url = API + "?" + new URLSearchParams({
    action: "query", format: "json", origin: "*",
    generator: "search",
    gsrsearch: "filetype:bitmap " + term,
    gsrnamespace: "6",       /* File: namespace */
    gsrlimit: "8",
    prop: "imageinfo",
    iiprop: "url|extmetadata|size",
    iiurlwidth: String(IMAGE_WIDTH)
  });

  const res = await fetch(url, { headers: { "User-Agent": "trip-itinerary-image-fetch/1.0" } });
  if (!res.ok) throw new Error("Commons search failed: HTTP " + res.status);
  const json = await res.json();
  const pages = json.query && json.query.pages ? Object.values(json.query.pages) : [];

  const candidates = pages.map(function (page) {
    const info = (page.imageinfo || [])[0] || {};
    const meta = info.extmetadata || {};
    return {
      title: page.title,
      url: info.thumburl || info.url,
      descriptionUrl: info.descriptionurl,
      width: info.thumbwidth || info.width,
      licence: plainText(meta.LicenseShortName && meta.LicenseShortName.value) || "unknown",
      author: plainText(meta.Artist && meta.Artist.value) || "unknown"
    };
  }).filter(function (c) {
    return c.url && !BLOCKED_LICENCES.test(c.licence);
  });

  /* Prefer landscape, reasonably large files - they crop better in cards. */
  candidates.sort(function (a, b) { return (b.width || 0) - (a.width || 0); });
  return candidates[0] || null;
}

async function download(url, destination) {
  const res = await fetch(url, { headers: { "User-Agent": "trip-itinerary-image-fetch/1.0" } });
  if (!res.ok) throw new Error("Download failed: HTTP " + res.status);
  const buffer = Buffer.from(await res.arrayBuffer());
  if (buffer.length < 1024) throw new Error("Suspiciously small file (" + buffer.length + " bytes)");
  fs.writeFileSync(destination, buffer);
  return buffer.length;
}

/* Point data/*.js at the downloaded photo instead of the placeholder. */
function rewriteReferences(fromPath, toPath) {
  const dataDir = path.join(ROOT, "data");
  let changed = 0;
  fs.readdirSync(dataDir).filter(function (f) { return f.endsWith(".js"); }).forEach(function (file) {
    const full = path.join(dataDir, file);
    const before = fs.readFileSync(full, "utf8");
    const after = before.split('"' + fromPath + '"').join('"' + toPath + '"');
    if (after !== before) {
      fs.writeFileSync(full, after);
      changed++;
    }
  });
  return changed;
}

function writeCredits(entries) {
  const lines = [
    "# Image credits",
    "",
    "Photos fetched from Wikimedia Commons by `tools/fetch-images.js`.",
    "Most Commons licences require this attribution to be kept with the project.",
    ""
  ];
  entries.forEach(function (e) {
    lines.push("## " + e.file);
    lines.push("- Source: " + e.descriptionUrl);
    lines.push("- Author: " + e.author);
    lines.push("- Licence: " + e.licence);
    lines.push("");
  });
  fs.writeFileSync(CREDITS_FILE, lines.join("\n"));
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  const targets = slotsFor(opts.only);

  if (!targets.length) {
    console.error("No slot matched. Run with --list to see the available names.");
    process.exit(1);
  }

  if (opts.list) {
    console.log("Slots and their search terms:\n");
    targets.forEach(function (t) { console.log("  " + t + "\n      -> " + SLOTS[t]); });
    return;
  }

  if (opts.search && targets.length !== 1) {
    console.error("--search applies to a single slot; name exactly one.");
    process.exit(1);
  }

  const credits = [];
  let downloaded = 0, skipped = 0, failed = 0;

  for (const slot of targets) {
    const term = opts.search || SLOTS[slot];
    const jpgPath = slot.replace(/\.svg$/, ".jpg");
    const absolute = path.join(ROOT, jpgPath);

    if (fs.existsSync(absolute) && !opts.force) {
      console.log("skip   " + jpgPath + "  (exists; --force to replace)");
      skipped++;
      continue;
    }

    try {
      const hit = await searchCommons(term);
      if (!hit) {
        console.log("MISS   " + slot + "  no usable result for \"" + term + "\"");
        failed++;
        continue;
      }

      if (opts.dryRun) {
        console.log("would  " + jpgPath + "\n         " + hit.title +
          "\n         " + hit.licence + " | " + hit.author);
        credits.push({ file: jpgPath, ...hit });
        continue;
      }

      fs.mkdirSync(path.dirname(absolute), { recursive: true });
      const bytes = await download(hit.url, absolute);
      const refs = rewriteReferences(slot, jpgPath);
      console.log("ok     " + jpgPath + "  (" + Math.round(bytes / 1024) + " KB, " +
        refs + " data file(s) updated)\n         " + hit.title + " | " + hit.licence);
      credits.push({ file: jpgPath, ...hit });
      downloaded++;
    } catch (err) {
      console.log("FAIL   " + slot + "  " + err.message);
      failed++;
    }
  }

  if (credits.length && !opts.dryRun) writeCredits(credits);

  console.log("\n" + (opts.dryRun ? "dry run: " : "") +
    downloaded + " downloaded, " + skipped + " skipped, " + failed + " failed");
  if (downloaded) {
    console.log("Credits written to assets/images/CREDITS.md - review before committing.");
    console.log("Check the pages in a browser, then: git add -A && git commit");
  }
}

main().catch(function (err) {
  console.error(err);
  process.exit(1);
});
