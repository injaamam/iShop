const fs = require("fs");
const path = require("path");

const FILE = path.resolve(
  __dirname,
  "..",
  "constants",
  "products",
  "mouse.json"
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

const brandFromName = (name) => {
  if (!name) return undefined;
  const first = String(name).trim().split(/\s+/)[0];
  return first.charAt(0).toUpperCase() + first.slice(1);
};

const formatKey = (snake) => {
  const acronyms = new Set([
    "dpi",
    "usb",
    "rgb",
    "led",
    "bt",
    "wifi",
    "2.4ghz",
    "ergonomic",
    "gaming",
    "wireless",
    "wired",
  ]);
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

const connectionTypeFromText = (specs, desc) => {
  const t = `${JSON.stringify(specs)}\n${desc}`.toUpperCase();
  if (/WIRELESS|BLUETOOTH|2\.4GHZ|DUAL\s+MODE|TRI-?MODE/.test(t))
    return "Wireless";
  if (/USB|WIRED/.test(t)) return "Wired";
  return undefined;
};

const dpiFromText = (specs, desc) => {
  const t = `${JSON.stringify(specs)}\n${desc}`.toUpperCase();
  const m = t.match(/(\d+(?:,\d+)?)\s*DPI/);
  if (m) {
    const dpi = m[1].replace(/,/g, "");
    return `${parseInt(dpi)} DPI`;
  }
  return undefined;
};

const buttonCountFromText = (specs, desc) => {
  const t = `${JSON.stringify(specs)}\n${desc}`.toUpperCase();
  const m = t.match(/(\d+)\s*(?:BUTTON|KEY)/);
  if (m) return `${parseInt(m[1])} Buttons`;
  return undefined;
};

const mouseTypeFromText = (name, desc) => {
  const t = `${name}\n${desc}`.toUpperCase();
  if (/GAMING/.test(t)) return "Gaming";
  if (/OFFICE|BUSINESS/.test(t)) return "Office";
  if (/ERGONOMIC/.test(t)) return "Ergonomic";
  if (/TRACKBALL/.test(t)) return "Trackball";
  return undefined;
};

const sensorTypeFromText = (specs, desc) => {
  const t = `${JSON.stringify(specs)}\n${desc}`.toUpperCase();
  if (/\bOPTICAL\b/.test(t)) return "Optical";
  if (/\bLASER\b/.test(t)) return "Laser";
  if (/\bTRACKBALL\b/.test(t)) return "Trackball";
  return undefined;
};

const rgbFromText = (specs, desc) => {
  const t = `${JSON.stringify(specs)}\n${desc}`.toUpperCase();
  return /RGB|LED|LIGHTING|ILLUMINATION/.test(t) ? "Yes" : undefined;
};

const programmableFromText = (specs, desc) => {
  const t = `${JSON.stringify(specs)}\n${desc}`.toUpperCase();
  return /PROGRAMMABLE|MACRO|CUSTOMIZABLE/.test(t) ? "Yes" : undefined;
};

const weightFromText = (specs, desc) => {
  const t = `${JSON.stringify(specs)}\n${desc}`.toUpperCase();
  const m = t.match(/(\d+(?:\.\d+)?)\s*(?:G|GRAM)/);
  if (m) return `${parseFloat(m[1])} g`;
  return undefined;
};

const colorFromSpecs = (specs) => {
  const c = specs.Color || undefined;
  return c ? String(c).split(/\r?\n|,\s*/)[0] : undefined;
};

const buildRawFilter = (item) => {
  const specs = item.Specifications || {};
  const desc = item.description || "";
  const name = item.name || "";

  const brand = brandFromName(name);
  const connectionType = connectionTypeFromText(specs, desc);
  const dpi = dpiFromText(specs, desc);
  const buttonCount = buttonCountFromText(specs, desc);
  const mouseType = mouseTypeFromText(name, desc);
  const sensorType = sensorTypeFromText(specs, desc);
  const rgb = rgbFromText(specs, desc);
  const programmable = programmableFromText(specs, desc);
  const weight = weightFromText(specs, desc);
  const color = colorFromSpecs(specs);

  const raw = {};
  if (brand) raw.brand = brand;
  if (connectionType) raw.connection_type = connectionType;
  if (dpi) raw.dpi = dpi;
  if (buttonCount) raw.button_count = buttonCount;
  if (mouseType) raw.mouse_type = mouseType;
  if (sensorType) raw.sensor_type = sensorType;
  if (rgb) raw.rgb_lighting = rgb;
  if (programmable) raw.programmable = programmable;
  if (weight) raw.weight = weight;
  if (color) raw.color = color;

  return raw;
};

const main = () => {
  const data = read();
  if (!Array.isArray(data)) {
    console.error("mouse.json is not an array");
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
  console.log(`Updated ${updated.length} mouse items with 'filter' objects.`);
};

main();
