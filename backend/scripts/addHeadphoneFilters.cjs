const fs = require("fs");
const path = require("path");

const FILE = path.resolve(
  __dirname,
  "..",
  "constants",
  "products",
  "headphone.json"
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

const normalizeOhm = (s) => {
  if (!s) return undefined;
  const t = String(s).toLowerCase();
  const m = t.match(/(\d+(?:\.\d+)?)\s*(ohm|Ω)/i);
  if (m) return `${parseFloat(m[1])} Ohm`;
  const n = extractNumber(t);
  return Number.isFinite(n) ? `${n} Ohm` : undefined;
};

const normalizeMm = (s) => {
  if (!s) return undefined;
  const t = String(s).toLowerCase();
  const m = t.match(/(\d+(?:\.\d+)?)\s*mm/);
  if (m) return `${parseFloat(m[1])} mm`;
  const n = extractNumber(t);
  return Number.isFinite(n) ? `${n} mm` : undefined;
};

const mahFromString = (s) => {
  if (!s) return undefined;
  const t = String(s).toLowerCase();
  const m = t.match(/(\d+(?:\.\d+)?)\s*mah/);
  if (m) return `${parseFloat(m[1])} mAh`;
  const n = extractNumber(t);
  return Number.isFinite(n) ? `${n} mAh` : undefined;
};

const hoursFromString = (s) => {
  if (!s) return undefined;
  const m = String(s).match(/(\d{1,3})\s*(?:h|hr|hrs|hours)\b/i);
  if (m) return `${parseInt(m[1], 10)} Hours`;
  return undefined;
};

const bluetoothVersion = (s) => {
  if (!s) return undefined;
  const t = String(s).toUpperCase();
  const m = t.match(/BLUETOOTH\s*V?\s*(\d(?:\.\d)?)/);
  return m
    ? `Bluetooth ${m[1]}`
    : /BLUETOOTH/.test(t)
    ? "Bluetooth"
    : undefined;
};

const connectionType = (specs, desc) => {
  const t = `${JSON.stringify(specs)}\n${desc}`.toUpperCase();
  if (/TRI-?MODE|QUAD-?MODE|2\.4GHZ/.test(t)) return "Wireless";
  if (/WIRELESS|BLUETOOTH/.test(t)) return "Wireless";
  if (/USB|3\.5MM|AUX|WIRED/.test(t)) return "Wired";
  return undefined;
};

const normYesNo = (v) => {
  if (v === undefined || v === null) return undefined;
  const s = String(v).trim().toLowerCase();
  if (["yes", "y", "true", "1"].includes(s)) return "Yes";
  if (["no", "n", "false", "0"].includes(s)) return "No";
  return undefined;
};

const hasANC = (specs, desc) => {
  const t = `${JSON.stringify(specs)}\n${desc}`.toUpperCase();
  return /(\bANC\b|ACTIVE\s+NOISE\s+CANCELL)/.test(t) ? "Yes" : undefined;
};

const formatKey = (snake) => {
  const acronyms = new Set(["usb", "anc", "bt"]);
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

const brandFromName = (name) => {
  if (!name) return undefined;
  const first = String(name).trim().split(/\s+/)[0];
  return first.charAt(0).toUpperCase() + first.slice(1);
};

const buildRawFilter = (item) => {
  const specs = item.Specifications || {};
  const desc = item.description || "";

  const brand = brandFromName(item.name);
  const conn = connectionType(specs, desc);
  const bt = bluetoothVersion(specs.Connectivity || specs.Connection || desc);
  const inputJack = (() => {
    const s = (specs["Input Jack"] || specs["Connector"] || "")
      .toString()
      .toUpperCase();
    if (/USB\s*-?C|TYPE-?C/.test(s)) return "USB Type-C";
    if (/USB/.test(s)) return "USB";
    if (/3\.5\s*MM/.test(s)) return "3.5 mm";
    return undefined;
  })();
  const driverSize = normalizeMm(
    specs["Driver Diameter"] ||
      specs["Driver Magnet"] ||
      specs["Drivers"] ||
      desc
  );
  const impedance = normalizeOhm(specs.Impedance);
  const battery = mahFromString(
    specs["Battery Capacity"] || specs.Battery || desc
  );
  const batteryLife = hoursFromString(specs["Battery Life"] || desc);
  const mic = (() => {
    const t = `${JSON.stringify(specs)}\n${desc}`.toUpperCase();
    if (/MICROPHONE|MIC\b/.test(t)) {
      return "Yes";
    }
    return undefined;
  })();
  const color = specs.Color || undefined;
  const weight = (() => {
    const w = specs.Weight || undefined;
    if (!w) return undefined;
    const n = extractNumber(w);
    if (!Number.isFinite(n)) return undefined;
    if (/kg|kilogram/i.test(String(w))) return `${n} kg`;
    return `${n} g`;
  })();

  const raw = {};
  if (brand) raw.brand = brand;
  if (conn) raw.connectivity = conn;
  if (bt) raw.bluetooth = bt;
  if (inputJack) raw.input_jack = inputJack;
  if (driverSize) raw.driver_size = driverSize;
  if (impedance) raw.impedance = impedance;
  if (battery) raw.battery_capacity = battery;
  if (batteryLife) raw.battery_life = batteryLife;
  if (mic) raw.microphone = mic;
  if (weight) raw.weight = weight;
  if (color) raw.color = String(color).split(/\r?\n|,\s*/)[0];

  return raw;
};

const main = () => {
  const data = read();
  if (!Array.isArray(data)) {
    console.error("headphone.json is not an array");
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
    `Updated ${updated.length} headphone items with 'filter' objects.`
  );
};

main();
