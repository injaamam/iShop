const fs = require("fs");
const path = require("path");

const FILE = path.resolve(
  __dirname,
  "..",
  "constants",
  "products",
  "stylus.json"
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
    "type-c",
    "type-c",
    "bluetooth",
    "bt",
    "emr",
    "emr",
    "aaaa",
    "mah",
    "mah",
    "mm",
    "mm",
    "g",
    "g",
    "h",
    "h",
    "ipad",
    "ios",
    "android",
    "windows",
    "mac",
    "palm",
    "pom",
    "aaa",
  ]);
  const parts = String(snake).split("_");
  if (parts.length === 0) return snake;
  const pretty = parts.map((p, idx) => {
    const lower = p.toLowerCase();
    if (acronyms.has(lower)) return lower.toUpperCase();
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  });
  return pretty.join(" ");
};

const toPresentationKeys = (obj) => {
  const result = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v !== undefined && v !== null && v !== "") {
      result[formatKey(k)] = v;
    }
  }
  return result;
};

const main = () => {
  const data = read();
  console.log(`Processing ${data.length} stylus items...`);

  const rawFilters = data.map((item) => {
    const specs = item.specifications || {};
    const desc = item.description || "";
    const name = item.name || "";

    return {
      brand: brandFromName(name),
      material: specs["Material"] || specs["Pen Material"],
      battery_capacity: extractNumber(
        specs["Battery Capacity"] || specs["Capacity"] || specs["Battery"]
      ),
      charging_time: extractNumber(
        specs["Charging Time"] || specs["Charge Time"] || specs["Charging"]
      ),
      working_time: extractNumber(
        specs["Working Time"] || specs["Battery Life"] || specs["Working"]
      ),
      usb_type: specs["USB"] || specs["USB Port"] || specs["Charging Port"],
      dimensions: specs["Dimensions"] || specs["Size"] || specs["Length"],
      weight: extractNumber(specs["Weight"]),
      pressure_levels: extractNumber(
        specs["Pressure Sensitivity"] || specs["Pressure Levels"]
      ),
      tip_size: extractNumber(
        specs["Pen tip"] || specs["Tip"] || specs["Tip Size"]
      ),
      color: specs["Color"] || specs["Colour"],
      compatibility:
        specs["Compatible With"] || specs["Compatibility"] || specs["Supports"],
      palm_rejection: /PALM\s*REJECTION|PALM\s*REJECT/i.test(
        `${JSON.stringify(specs)}\n${desc}`
      )
        ? "Yes"
        : undefined,
      magnetic_attach: /MAGNETIC|MAGNET|ATTACH/i.test(
        `${JSON.stringify(specs)}\n${desc}`
      )
        ? "Yes"
        : undefined,
      tilt_sensitivity: /TILT|SENSITIVITY|SENSITIVE/i.test(
        `${JSON.stringify(specs)}\n${desc}`
      )
        ? "Yes"
        : undefined,
      active_stylus: /ACTIVE|BATTERY|RECHARGEABLE/i.test(
        `${JSON.stringify(specs)}\n${desc}`
      )
        ? "Yes"
        : undefined,
      passive_stylus: /PASSIVE|CAPACITIVE|UNIVERSAL/i.test(
        `${JSON.stringify(specs)}\n${desc}`
      )
        ? "Yes"
        : undefined,
    };
  });

  // Remove keys with only one unique value
  const allValues = {};
  rawFilters.forEach((rf) => {
    for (const [key, value] of Object.entries(rf)) {
      if (value !== undefined && value !== null && value !== "") {
        if (!allValues[key]) {
          allValues[key] = new Set();
        }
        allValues[key].add(value);
      }
    }
  });

  const keysToKeep = new Set(
    Object.keys(allValues).filter((key) => allValues[key].size > 1)
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
  console.log(`Updated ${updated.length} stylus items with 'filter' objects.`);
};

main();
