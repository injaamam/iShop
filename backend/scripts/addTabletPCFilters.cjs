const fs = require("fs");
const path = require("path");

const FILE = path.resolve(
  __dirname,
  "..",
  "constants",
  "products",
  "tablet-pc.json"
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
    "cpu",
    "gpu",
    "ram",
    "rom",
    "ssd",
    "hdd",
    "os",
    "android",
    "ios",
    "windows",
    "linux",
    "macos",
    "usb",
    "type-c",
    "hdmi",
    "wifi",
    "bluetooth",
    "bt",
    "lte",
    "4g",
    "5g",
    "gps",
    "nfc",
    "ips",
    "oled",
    "lcd",
    "led",
    "mah",
    "wh",
    "mm",
    "inch",
    "gb",
    "tb",
    "hz",
    "ghz",
    "mp",
    "ppi",
    "mah",
    "mah",
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
  console.log(`Processing ${data.length} tablet PC items...`);

  const rawFilters = data.map((item) => {
    const specs = item.specifications || {};
    const desc = item.description || "";
    const name = item.name || "";

    return {
      brand: brandFromName(name),
      screen_size: extractNumber(
        specs["Display Size"] ||
          specs["Screen Size"] ||
          specs["Display"] ||
          specs["Screen"]
      ),
      resolution:
        specs["Display Resolution"] ||
        specs["Resolution"] ||
        specs["Screen Resolution"],
      processor: specs["Processor"] || specs["CPU"] || specs["Chipset"],
      ram: extractNumber(
        specs["RAM"] || specs["Memory"] || specs["System Memory"]
      ),
      storage: extractNumber(
        specs["Storage"] ||
          specs["Internal Storage"] ||
          specs["ROM"] ||
          specs["SSD"] ||
          specs["HDD"]
      ),
      operating_system:
        specs["Operating System"] || specs["OS"] || specs["Platform"],
      battery_capacity: extractNumber(
        specs["Battery Capacity"] || specs["Battery"] || specs["Battery Life"]
      ),
      camera_rear: extractNumber(
        specs["Rear Camera"] || specs["Back Camera"] || specs["Main Camera"]
      ),
      camera_front: extractNumber(
        specs["Front Camera"] || specs["Selfie Camera"]
      ),
      connectivity:
        specs["Connectivity"] || specs["Network"] || specs["Wireless"],
      color: specs["Color"] || specs["Colour"],
      weight: extractNumber(specs["Weight"]),
      dimensions: specs["Dimensions"] || specs["Size"],
      wifi: /WIFI|WIRELESS|802\.11/i.test(`${JSON.stringify(specs)}\n${desc}`)
        ? "Yes"
        : undefined,
      bluetooth: /BLUETOOTH|BT/i.test(`${JSON.stringify(specs)}\n${desc}`)
        ? "Yes"
        : undefined,
      cellular: /LTE|4G|5G|CELLULAR|SIM/i.test(
        `${JSON.stringify(specs)}\n${desc}`
      )
        ? "Yes"
        : undefined,
      gps: /GPS|GLOBAL\s*POSITIONING/i.test(`${JSON.stringify(specs)}\n${desc}`)
        ? "Yes"
        : undefined,
      nfc: /NFC|NEAR\s*FIELD/i.test(`${JSON.stringify(specs)}\n${desc}`)
        ? "Yes"
        : undefined,
      stylus_support: /STYLUS|PEN|PENCIL/i.test(
        `${JSON.stringify(specs)}\n${desc}`
      )
        ? "Yes"
        : undefined,
      fingerprint: /FINGERPRINT|BIOMETRIC/i.test(
        `${JSON.stringify(specs)}\n${desc}`
      )
        ? "Yes"
        : undefined,
      face_unlock: /FACE|FACE\s*ID|FACE\s*UNLOCK/i.test(
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
    `Updated ${updated.length} tablet PC items with 'filter' objects.`
  );
};

main();
