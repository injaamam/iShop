const fs = require("fs");
const path = require("path");

const FILE = path.resolve(
  __dirname,
  "..",
  "constants",
  "products",
  "camera.json"
);

const read = () => JSON.parse(fs.readFileSync(FILE, "utf8"));
const write = (data) =>
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2) + "\n", "utf8");

const normYesNo = (v) => {
  if (v === undefined || v === null) return undefined;
  const s = String(v).trim().toLowerCase();
  if (["yes", "y", "true", "1"].includes(s)) return "Yes";
  if (["no", "n", "false", "0"].includes(s)) return "No";
  return undefined;
};

const extractNumber = (s) => {
  if (!s) return undefined;
  const m = String(s)
    .replace(/,/g, "")
    .match(/(\d+(?:\.\d+)?)/);
  return m ? parseFloat(m[1]) : undefined;
};

const gbFromString = (s) => {
  if (!s) return undefined;
  const txt = String(s).toLowerCase();
  const tb = txt.match(/(\d+(?:\.\d+)?)\s*tb/);
  if (tb) return `${parseFloat(tb[1]) * 1024} GB`;
  const gb = txt.match(/(\d+(?:\.\d+)?)\s*gb/);
  if (gb) return `${parseFloat(gb[1])} GB`;
  const onlyNum = extractNumber(txt);
  return Number.isFinite(onlyNum) ? `${onlyNum} GB` : undefined;
};

const mahFromString = (s) => {
  if (!s) return undefined;
  const m = String(s)
    .toLowerCase()
    .match(/(\d+(?:\.\d+)?)\s*mah/);
  if (m) return `${parseFloat(m[1])} mAh`;
  const only = extractNumber(s);
  return Number.isFinite(only) ? `${only} mAh` : undefined;
};

const normalizeInch = (v) => {
  if (!v) return undefined;
  const txt = String(v)
    .toLowerCase()
    .replace(/(“|”|\"|inch(?:es)?|in\.?)/g, " inch");
  const num = extractNumber(txt);
  if (!Number.isFinite(num)) return undefined;
  return `${num} Inch`;
};

const hasDualScreen = (display) => {
  if (!display) return undefined;
  return /(dual\s*screen|\+\s*1\.?\d|2\.0\s*”?\s*\+|2\s*inch\s*\+|front\s*screen)/i.test(
    String(display)
  )
    ? "Yes"
    : undefined;
};

const normalizeVideoMax = (v) => {
  if (!v) return undefined;
  const s = String(v).toUpperCase();
  if (/6K/.test(s)) return "6K";
  if (/5K/.test(s)) return "5K";
  if (/4K/.test(s)) return "4K";
  if (/2\.7K|2K/.test(s)) return "2.7K";
  if (/1080P|FHD/.test(s)) return "1080P";
  if (/720P/.test(s)) return "720P";
  return undefined;
};

const normalizeImageMaxMP = (v) => {
  if (!v) return undefined;
  const s = String(v).toUpperCase();
  // find the max M/MP value in the string list
  const matches = [...s.matchAll(/(\d+(?:\.\d+)?)\s*MP?\b/g)].map((m) =>
    parseFloat(m[1])
  );
  if (matches.length > 0) {
    const max = Math.max(...matches);
    return `${max} MP`;
  }
  const mAlt = [...s.matchAll(/(\d+(?:\.\d+)?)\s*M\b/g)].map((m) =>
    parseFloat(m[1])
  );
  if (mAlt.length > 0) {
    const max = Math.max(...mAlt);
    return `${max} MP`;
  }
  return undefined;
};

const brandFromName = (name) => {
  if (!name) return undefined;
  const firstWord = String(name).trim().split(/\s+/)[0];
  const map = {
    ORDRO: "ORDRO",
    AUSEK: "Ausek",
    SONY: "Sony",
    CANON: "Canon",
    NIKON: "Nikon",
    GOPRO: "GoPro",
    DJI: "DJI",
  };
  const upper = firstWord.toUpperCase();
  if (map[upper]) return map[upper];
  return firstWord.charAt(0).toUpperCase() + firstWord.slice(1);
};

const formatKey = (snake) => {
  const acronyms = new Set(["ram", "ssd", "hdd", "os", "gpu", "wifi", "usb"]);
  const parts = String(snake).split("_");
  if (parts.length === 0) return snake;
  const pretty = parts.map((p) => {
    const lower = p.toLowerCase();
    if (acronyms.has(lower)) return lower.toUpperCase();
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  });
  return pretty.join(" ");
};

const toPresentationKeys = (obj) => {
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    out[formatKey(k)] = v;
  }
  return out;
};

const buildRawFilter = (item) => {
  const specs = item.Specifications || {};
  const description = item.description || "";

  const brand = brandFromName(item.name);

  const imageSensorRaw = specs["Image Sensor"] || undefined;
  const sensorType = (() => {
    if (!imageSensorRaw) return undefined;
    const s = String(imageSensorRaw).toUpperCase();
    if (s.includes("CMOS")) return "CMOS";
    if (s.includes("CCD")) return "CCD";
    return undefined;
  })();
  const maxImage = normalizeImageMaxMP(specs.Image || description);
  const maxVideo = normalizeVideoMax(specs.Video || description);

  // Display size: attempt to parse a numeric inch from Display text
  const displaySize = normalizeInch(specs.Display || description);
  const dualScreen = hasDualScreen(specs.Display || description);

  const memoryMax = gbFromString(specs.Memory);

  const wifi = normYesNo(specs["Wi-Fi"]);
  const waterResistant = normYesNo(specs["Water Resistant"]);
  const slowMotion = normYesNo(specs["Slow Motion Recording"]);

  const batteryCapacity = mahFromString(specs.Capacity);
  const usbPort = (() => {
    const v = specs["USB Port"];
    if (!v) return undefined;
    const s = String(v).toUpperCase();
    if (/(TYPE[-\s]?C|USB[-\s]?C)/.test(s)) return "Type-C";
    if (/MICRO\s*USB/.test(s)) return "Micro USB";
    if (/USB/.test(s)) return "USB";
    return undefined;
  })();
  const chargingInterface = (() => {
    const v = specs["Charging Interface"];
    if (!v) return undefined;
    const s = String(v).toUpperCase();
    if (/(TYPE[-\s]?C|USB[-\s]?C)/.test(s)) return "Type-C";
    if (/MICRO\s*USB/.test(s)) return "Micro USB";
    return "Other";
  })();

  const raw = {};
  if (brand) raw.brand = brand;
  if (sensorType) raw.sensor_type = sensorType;
  if (maxImage) raw.max_image_resolution = maxImage;
  if (maxVideo) raw.max_video_resolution = maxVideo;
  if (displaySize) raw.display_size = displaySize;
  if (dualScreen) raw.dual_screen = dualScreen;
  if (memoryMax) raw.memory_max = memoryMax;
  if (wifi) raw.wifi = wifi;
  if (waterResistant) raw.water_resistant = waterResistant;
  if (slowMotion) raw.slow_motion = slowMotion;
  if (batteryCapacity) raw.battery_capacity = batteryCapacity;
  if (usbPort) raw.usb_port = usbPort;
  if (chargingInterface) raw.charging_interface = chargingInterface;

  return raw;
};

const main = () => {
  const data = read();
  if (!Array.isArray(data)) {
    console.error("camera.json is not an array");
    process.exit(1);
  }

  // First pass: build raw filters and collect unique values per key
  const rawFilters = data.map((item) => buildRawFilter(item));
  const keyToValues = new Map();
  for (const rf of rawFilters) {
    for (const [k, v] of Object.entries(rf)) {
      if (!keyToValues.has(k)) keyToValues.set(k, new Set());
      keyToValues.get(k).add(String(v));
    }
  }
  // Determine keys that have more than one unique value
  const keysToKeep = new Set(
    [...keyToValues.entries()].filter(([, set]) => set.size > 1).map(([k]) => k)
  );

  // Second pass: filter keys and convert to presentation keys
  const updated = data.map((item, idx) => {
    const rf = rawFilters[idx];
    const filtered = Object.fromEntries(
      Object.entries(rf).filter(([k]) => keysToKeep.has(k))
    );
    const filter = toPresentationKeys(filtered);
    return { ...item, filter };
  });

  write(updated);
  console.log(`Updated ${updated.length} camera items with 'filter' objects.`);
};

main();
