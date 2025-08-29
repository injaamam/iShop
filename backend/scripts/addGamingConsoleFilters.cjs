const fs = require("fs");
const path = require("path");

const FILE = path.resolve(
  __dirname,
  "..",
  "constants",
  "products",
  "gaming-console.json"
);

const read = () => JSON.parse(fs.readFileSync(FILE, "utf8"));
const write = (data) =>
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2) + "\n", "utf8");

const extractNumber = (s) => {
  if (!s) return undefined;
  const m = String(s)
    .replace(/,/g, "")
    .match(/(\d+(?:\.\d+)?)/);
  return m ? parseFloat(m[1]) : undefined;
};

const inchFromString = (s) => {
  if (!s) return undefined;
  const t = String(s).toLowerCase();
  const m = t.match(/(\d+(?:\.\d+)?)\s*(?:inch|in\.?|”|")/);
  if (m) return `${parseFloat(m[1])} Inch`;
  const n = extractNumber(t);
  return Number.isFinite(n) ? `${n} Inch` : undefined;
};

const hzFromString = (s) => {
  if (!s) return undefined;
  const m = String(s)
    .toLowerCase()
    .match(/(\d+(?:\.\d+)?)\s*hz/);
  if (m) return `${parseFloat(m[1])} Hz`;
  return undefined;
};

const resolutionFromString = (s) => {
  if (!s) return undefined;
  let t = String(s).toUpperCase();
  if (/\b8K\b/.test(t)) return "8K";
  if (/\b4K\b/.test(t)) return "4K";
  const m = t.replace(/[×xX*]/g, "x").match(/(\d{3,4})\s*x\s*(\d{3,4})/);
  return m ? `${m[1]} x ${m[2]}` : undefined;
};

const storageFromString = (s) => {
  if (!s) return undefined;
  const t = String(s).toLowerCase();
  const tb = t.match(/(\d+(?:\.\d+)?)\s*tb/);
  if (tb) return `${parseFloat(tb[1])} TB`;
  const gb = t.match(/(\d+(?:\.\d+)?)\s*gb/);
  if (gb) return `${parseFloat(gb[1])} GB`;
  return undefined;
};

const brandFromName = (name) => {
  if (!name) return undefined;
  const first = String(name).trim().split(/\s+/)[0];
  const map = {
    SONY: "Sony",
    MICROSOFT: "Microsoft",
    NINTENDO: "Nintendo",
    ASUS: "ASUS",
    VALVE: "Valve",
    "G-STORY": "G-STORY",
  };
  const up = first.toUpperCase();
  if (map[up]) return map[up];
  return first.charAt(0).toUpperCase() + first.slice(1);
};

const formatKey = (snake) => {
  const acronyms = new Set(["hdr", "usb", "ssd", "ram", "gpu", "cpu", "wifi"]);
  const parts = String(snake).split("_");
  const pretty = parts.map((p) => {
    const lower = p.toLowerCase();
    if (acronyms.has(lower)) return lower.toUpperCase();
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  });
  return pretty.join(" ");
};

const toPresentationKeys = (obj) => {
  const out = {};
  for (const [k, v] of Object.entries(obj)) out[formatKey(k)] = v;
  return out;
};

const buildRawFilter = (item) => {
  const specs = item.Specifications || {};
  const desc = item.description || "";

  const brand = brandFromName(item.name);
  const displaySize = inchFromString(specs["Display Size"] || desc);
  const refreshRate = hzFromString(specs["Refresh Rate"] || desc);
  const resolution = resolutionFromString(specs.Resolution || desc);
  const storage = storageFromString(
    specs["Internal Storage"] || specs["Storage"] || desc
  );
  const color = specs.Color || undefined;

  const raw = {};
  if (brand) raw.brand = brand;
  if (displaySize) raw.display_size = displaySize;
  if (resolution) raw.resolution = resolution;
  if (refreshRate) raw.refresh_rate = refreshRate;
  if (storage) raw.storage = storage;
  if (color) raw.color = String(color).split(/\r?\n|,\s*/)[0];

  return raw;
};

const main = () => {
  const data = read();
  if (!Array.isArray(data)) {
    console.error("gaming-console.json is not an array");
    process.exit(1);
  }

  const rawFilters = data.map((item) => buildRawFilter(item));
  const keyToValues = new Map();
  for (const rf of rawFilters) {
    for (const [k, v] of Object.entries(rf)) {
      if (!keyToValues.has(k)) keyToValues.set(k, new Set());
      keyToValues.get(k).add(String(v));
    }
  }
  const keysToKeep = new Set(
    [...keyToValues.entries()].filter(([, set]) => set.size > 1).map(([k]) => k)
  );

  const updated = data.map((item, idx) => {
    const rf = rawFilters[idx];
    const filtered = Object.fromEntries(
      Object.entries(rf).filter(([k]) => keysToKeep.has(k))
    );
    const filter = toPresentationKeys(filtered);
    return { ...item, filter };
  });

  write(updated);
  console.log(
    `Updated ${updated.length} gaming console items with 'filter' objects.`
  );
};

main();
