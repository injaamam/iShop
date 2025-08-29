const fs = require("fs");
const path = require("path");

const FILE = path.resolve(
  __dirname,
  "..",
  "constants",
  "products",
  "pen-drive.json"
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
    "usb",
    "otg",
    "mb",
    "gb",
    "gen",
    "type",
    "read",
    "write",
    "speed",
    "capacity",
    "connectivity",
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

const capacityFromText = (specs, desc) => {
  const t = `${JSON.stringify(specs)}\n${desc}`.toUpperCase();
  const m = t.match(/(\d+)\s*GB/);
  if (m) return `${parseInt(m[1])} GB`;
  return undefined;
};

const usbVersionFromText = (specs, desc) => {
  const t = `${JSON.stringify(specs)}\n${desc}`.toUpperCase();
  if (/USB\s*3\.2\s*GEN\s*2/.test(t)) return "USB 3.2 Gen 2";
  if (/USB\s*3\.2\s*GEN\s*1|USB\s*3\.2/.test(t)) return "USB 3.2 Gen 1";
  if (/USB\s*3\.1\s*GEN\s*2/.test(t)) return "USB 3.1 Gen 2";
  if (/USB\s*3\.1\s*GEN\s*1|USB\s*3\.1/.test(t)) return "USB 3.1 Gen 1";
  if (/USB\s*3\.0/.test(t)) return "USB 3.0";
  if (/USB\s*2\.0/.test(t)) return "USB 2.0";
  return undefined;
};

const connectorTypeFromText = (specs, desc) => {
  const t = `${JSON.stringify(specs)}\n${desc}`.toUpperCase();
  const hasC = /TYPE[-\s]?C|USB[-\s]?C/.test(t);
  const hasA = /USB(?!-?C)\b|USB\s*A\b/.test(t);
  const hasLightning = /LIGHTNING/.test(t);

  if (hasLightning && hasC) return "Lightning + Type-C";
  if (hasLightning && hasA) return "Lightning + USB-A";
  if (hasC && hasA) return "Type-C + USB-A";
  if (hasC) return "Type-C";
  if (hasA) return "USB-A";
  return undefined;
};

const readSpeedFromText = (specs, desc) => {
  const t = `${JSON.stringify(specs)}\n${desc}`.toUpperCase();
  const m = t.match(/(\d+(?:\.\d+)?)\s*(?:MB\/S|MBPS)/);
  if (m) return `${parseFloat(m[1])} MB/s`;
  return undefined;
};

const writeSpeedFromText = (specs, desc) => {
  const t = `${JSON.stringify(specs)}\n${desc}`.toUpperCase();
  const m = t.match(/(\d+(?:\.\d+)?)\s*(?:MB\/S|MBPS)/);
  if (m) return `${parseFloat(m[1])} MB/s`;
  return undefined;
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
  const capacity = capacityFromText(specs, desc);
  const usbVersion = usbVersionFromText(specs, desc);
  const connectorType = connectorTypeFromText(specs, desc);
  const readSpeed = readSpeedFromText(specs, desc);
  const writeSpeed = writeSpeedFromText(specs, desc);
  const weight = weightFromText(specs, desc);
  const color = colorFromSpecs(specs);

  const raw = {};
  if (brand) raw.brand = brand;
  if (capacity) raw.capacity = capacity;
  if (usbVersion) raw.usb_version = usbVersion;
  if (connectorType) raw.connector_type = connectorType;
  if (readSpeed) raw.read_speed = readSpeed;
  if (writeSpeed) raw.write_speed = writeSpeed;
  if (weight) raw.weight = weight;
  if (color) raw.color = color;

  return raw;
};

const main = () => {
  const data = read();
  if (!Array.isArray(data)) {
    console.error("pen-drive.json is not an array");
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
    `Updated ${updated.length} pen drive items with 'filter' objects.`
  );
};

main();
