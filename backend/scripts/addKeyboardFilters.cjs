const fs = require("fs");
const path = require("path");

const FILE = path.resolve(
  __dirname,
  "..",
  "constants",
  "products",
  "keyboard.json"
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

const mmFromString = (s) => {
  if (!s) return undefined;
  const t = String(s).toLowerCase();
  const m = t.match(/(\d+(?:\.\d+)?)\s*mm/);
  if (m) return `${parseFloat(m[1])} mm`;
  const n = extractNumber(t);
  return Number.isFinite(n) ? `${n} mm` : undefined;
};

const brandFromName = (name) => {
  if (!name) return undefined;
  const first = String(name).trim().split(/\s+/)[0];
  return first.charAt(0).toUpperCase() + first.slice(1);
};

const formatKey = (snake) => {
  const acronyms = new Set(["usb", "rgb", "bt"]);
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

const connectionType = (specs, desc) => {
  const t = `${JSON.stringify(specs)}\n${desc}`.toUpperCase();
  if (/WIRELESS|BLUETOOTH|2\.4GHZ|DUAL MODE|TRI-?MODE/.test(t))
    return "Wireless";
  if (/USB|WIRED/.test(t)) return "Wired";
  return undefined;
};

const interfaceType = (specs) => {
  const s = (specs.Interface || specs["Connection Interface"] || "")
    .toString()
    .toUpperCase();
  if (/USB\s*-?C|TYPE-?C/.test(s)) return "USB Type-C";
  if (/USB\s*3|USB\s*2/.test(s)) return "USB";
  if (/BLUETOOTH/.test(s)) return "Bluetooth";
  return undefined;
};

const backlightType = (specs, desc) => {
  const t = `${JSON.stringify(specs)}\n${desc}`.toUpperCase();
  if (/RGB/.test(t)) return "RGB";
  if (/BACKLIGHT|LED/.test(t)) return "LED";
  return undefined;
};

const keyCount = (specs) => {
  const k = specs.Keys || specs["Number of Keys"] || specs["Key Number"];
  const n = extractNumber(k);
  return Number.isFinite(n) ? `${n}` : undefined;
};

const sizeFromDimensions = (specs) => {
  const d = specs.Dimensions || "";
  const n = extractNumber(d);
  // too noisy; we won't include unless necessary
  return undefined;
};

const colorFromSpecs = (specs) => {
  const c = specs.Color || undefined;
  return c ? String(c).split(/\r?\n|,\s*/)[0] : undefined;
};

const buildRawFilter = (item) => {
  const specs = item.Specifications || {};
  const desc = item.description || "";

  const brand = brandFromName(item.name);
  const conn = connectionType(specs, desc);
  const iface = interfaceType(specs);
  const backlight = backlightType(specs, desc);
  const keys = keyCount(specs);
  const cableLen = mmFromString(specs["Cable Length"]);
  const color = colorFromSpecs(specs);

  const raw = {};
  if (brand) raw.brand = brand;
  if (conn) raw.connectivity = conn;
  if (iface) raw.interface = iface;
  if (backlight) raw.backlight = backlight;
  if (keys) raw.keys = keys;
  if (cableLen) raw.cable_length = cableLen;
  if (color) raw.color = color;

  return raw;
};

const main = () => {
  const data = read();
  if (!Array.isArray(data)) {
    console.error("keyboard.json is not an array");
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
    `Updated ${updated.length} keyboard items with 'filter' objects.`
  );
};

main();
