const fs = require("fs");
const path = require("path");

const FILE = path.resolve(
  __dirname,
  "..",
  "constants",
  "products",
  "smart-watch.json"
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
    "gps",
    "wifi",
    "bluetooth",
    "nfc",
    "os",
    "ram",
    "rom",
    "ip",
    "atm",
    "hr",
    "spo2",
    "ecg",
    "ppg",
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
  console.log(`Processing ${data.length} smart watch items...`);

  const rawFilters = data.map((item) => {
    const specs = item.specifications || {};
    const desc = item.description || "";
    const name = item.name || "";

    return {
      brand: brandFromName(name),
      display_size: extractNumber(
        specs["Display Size"] || specs["Display"] || specs["Screen Size"]
      ),
      resolution:
        specs["Display Resolution"] ||
        specs["Resolution"] ||
        specs["Screen Resolution"],
      battery_life: extractNumber(
        specs["Battery Life"] || specs["Battery"] || specs["Battery Duration"]
      ),
      water_resistance:
        specs["Water Resistance"] || specs["Waterproof"] || specs["IP Rating"],
      connectivity:
        specs["Connectivity"] || specs["Connection"] || specs["Wireless"],
      os: specs["Operating System"] || specs["OS"] || specs["Platform"],
      storage: specs["Storage"] || specs["Internal Storage"] || specs["ROM"],
      ram: specs["RAM"] || specs["Memory"],
      color: specs["Color"] || specs["Colour"],
      material:
        specs["Material"] || specs["Case Material"] || specs["Band Material"],
      gps: /GPS|GLOBAL\s*POSITIONING/i.test(`${JSON.stringify(specs)}\n${desc}`)
        ? "Yes"
        : undefined,
      heart_rate: /HEART\s*RATE|HR\s*MONITOR/i.test(
        `${JSON.stringify(specs)}\n${desc}`
      )
        ? "Yes"
        : undefined,
      sleep_tracking: /SLEEP\s*TRACKING|SLEEP\s*MONITOR/i.test(
        `${JSON.stringify(specs)}\n${desc}`
      )
        ? "Yes"
        : undefined,
      fitness_tracking: /FITNESS|ACTIVITY|EXERCISE/i.test(
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
  console.log(
    `Updated ${updated.length} smart watch items with 'filter' objects.`
  );
};

main();
