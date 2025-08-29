const fs = require("fs");
const path = require("path");

const FILE = path.resolve(
  __dirname,
  "..",
  "constants",
  "products",
  "speaker-and-home-theater.json"
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
    "watt",
    "w",
    "rms",
    "hz",
    "khz",
    "db",
    "ohm",
    "mm",
    "cm",
    "inch",
    "bluetooth",
    "bt",
    "usb",
    "hdmi",
    "aux",
    "rca",
    "optical",
    "coaxial",
    "dolby",
    "dts",
    "atmos",
    "ipx",
    "atm",
    "rgb",
    "led",
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
  console.log(`Processing ${data.length} speaker and home theater items...`);

  const rawFilters = data.map((item) => {
    const specs = item.specifications || {};
    const desc = item.description || "";
    const name = item.name || "";

    return {
      brand: brandFromName(name),
      output_power:
        specs["Output Power"] || specs["Power"] || specs["Amplifier Power"],
      frequency_response:
        specs["Frequency response"] ||
        specs["Frequency Response"] ||
        specs["Frequency"],
      drivers: specs["Drivers"] || specs["Driver Unit"] || specs["Speaker"],
      subwoofer: specs["Subwoofer"] || specs["Bass Driver"],
      bluetooth: specs["Bluetooth"] || specs["BT"] || specs["Connection Type"],
      wired:
        specs["Wired"] || specs["Input Connetor"] || specs["Input Connector"],
      usb: specs["USB"] || specs["USB Port"],
      color: specs["Color"] || specs["Colour"],
      dimension: specs["Dimension"] || specs["Size"],
      weight: specs["Weight"],
      channel_config:
        specs["Type"] || specs["Channel"] || specs["Total Speakers"],
      signal_noise_ratio: specs["Signal / noise ratio"] || specs["Noise Ratio"],
      input_sensitivity: specs["Input Sensitivity"],
      resistance: specs["Resistance"] || specs["Impedance"],
      rgb_lighting: /RGB|LED|LIGHTING|LIGHT/i.test(
        `${JSON.stringify(specs)}\n${desc}`
      )
        ? "Yes"
        : undefined,
      wireless: /WIRELESS|BLUETOOTH|BT/i.test(
        `${JSON.stringify(specs)}\n${desc}`
      )
        ? "Yes"
        : undefined,
      karaoke: /KARAOKE|MICROPHONE|MIC/i.test(
        `${JSON.stringify(specs)}\n${desc}`
      )
        ? "Yes"
        : undefined,
      remote_control: /REMOTE|CONTROL/i.test(
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
    `Updated ${updated.length} speaker and home theater items with 'filter' objects.`
  );
};

main();
