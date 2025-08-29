const fs = require("fs");
const path = require("path");

const FILE = path.resolve(
  __dirname,
  "..",
  "constants",
  "products",
  "monitor.json"
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
    "hdmi",
    "vga",
    "dvi",
    "dp",
    "usb",
    "ips",
    "va",
    "tn",
    "oled",
    "qhd",
    "uhd",
    "fhd",
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

const screenSizeFromText = (specs, desc) => {
  const t = `${JSON.stringify(specs)}\n${desc}`.toUpperCase();
  const m = t.match(/(\d+(?:\.\d+)?)\s*(?:INCH|"|IN)/);
  if (m) return `${parseFloat(m[1])}"`;
  return undefined;
};

const resolutionFromText = (specs, desc) => {
  const t = `${JSON.stringify(specs)}\n${desc}`.toUpperCase();
  if (/(\d{3,4})\s*X\s*(\d{3,4})/.test(t)) {
    const m = t.match(/(\d{3,4})\s*X\s*(\d{3,4})/);
    return `${m[1]} x ${m[2]}`;
  }
  if (/(\d{3,4})\s*×\s*(\d{3,4})/.test(t)) {
    const m = t.match(/(\d{3,4})\s*×\s*(\d{3,4})/);
    return `${m[1]} x ${m[2]}`;
  }
  if (/FHD|1920\s*X?\s*1080/.test(t)) return "1920 x 1080";
  if (/QHD|2560\s*X?\s*1440/.test(t)) return "2560 x 1440";
  if (/UHD|4K|3840\s*X?\s*2160/.test(t)) return "3840 x 2160";
  return undefined;
};

const panelTypeFromText = (specs, desc) => {
  const t = `${JSON.stringify(specs)}\n${desc}`.toUpperCase();
  if (/\bIPS\b/.test(t)) return "IPS";
  if (/\bVA\b/.test(t)) return "VA";
  if (/\bTN\b/.test(t)) return "TN";
  if (/\bOLED\b/.test(t)) return "OLED";
  return undefined;
};

const refreshRateFromText = (specs, desc) => {
  const t = `${JSON.stringify(specs)}\n${desc}`.toUpperCase();
  const m = t.match(/(\d+)\s*HZ/);
  if (m) return `${parseInt(m[1])} Hz`;
  return undefined;
};

const responseTimeFromText = (specs, desc) => {
  const t = `${JSON.stringify(specs)}\n${desc}`.toUpperCase();
  const m = t.match(/(\d+(?:\.\d+)?)\s*MS/);
  if (m) return `${parseFloat(m[1])} ms`;
  return undefined;
};

const aspectRatioFromText = (specs, desc) => {
  const t = `${JSON.stringify(specs)}\n${desc}`.toUpperCase();
  if (/16\s*:\s*9|16:9/.test(t)) return "16:9";
  if (/21\s*:\s*9|21:9/.test(t)) return "21:9";
  if (/4\s*:\s*3|4:3/.test(t)) return "4:3";
  return undefined;
};

const connectivityFromText = (specs, desc) => {
  const t = `${JSON.stringify(specs)}\n${desc}`.toUpperCase();
  const ports = [];
  if (/\bHDMI\b/.test(t)) ports.push("HDMI");
  if (/\bVGA\b/.test(t)) ports.push("VGA");
  if (/\bDVI\b/.test(t)) ports.push("DVI");
  if (/\bDISPLAY\s*PORT|DP\b/.test(t)) ports.push("DisplayPort");
  if (/\bUSB\b/.test(t)) ports.push("USB");
  return ports.length ? ports.join(", ") : undefined;
};

const curvedFromText = (name, desc) => {
  const t = `${name}\n${desc}`.toUpperCase();
  return /CURVED/.test(t) ? "Yes" : undefined;
};

const builtInSpeakersFromText = (specs, desc) => {
  const t = `${JSON.stringify(specs)}\n${desc}`.toUpperCase();
  return /SPEAKER|AUDIO|SOUND/.test(t) ? "Yes" : undefined;
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
  const screenSize = screenSizeFromText(specs, desc);
  const resolution = resolutionFromText(specs, desc);
  const panelType = panelTypeFromText(specs, desc);
  const refreshRate = refreshRateFromText(specs, desc);
  const responseTime = responseTimeFromText(specs, desc);
  const aspectRatio = aspectRatioFromText(specs, desc);
  const connectivity = connectivityFromText(specs, desc);
  const curved = curvedFromText(name, desc);
  const builtInSpeakers = builtInSpeakersFromText(specs, desc);
  const color = colorFromSpecs(specs);

  const raw = {};
  if (brand) raw.brand = brand;
  if (screenSize) raw.screen_size = screenSize;
  if (resolution) raw.resolution = resolution;
  if (panelType) raw.panel_type = panelType;
  if (refreshRate) raw.refresh_rate = refreshRate;
  if (responseTime) raw.response_time = responseTime;
  if (aspectRatio) raw.aspect_ratio = aspectRatio;
  if (connectivity) raw.connectivity = connectivity;
  if (curved) raw.curved = curved;
  if (builtInSpeakers) raw.built_in_speakers = builtInSpeakers;
  if (color) raw.color = color;

  return raw;
};

const main = () => {
  const data = read();
  if (!Array.isArray(data)) {
    console.error("monitor.json is not an array");
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
  console.log(`Updated ${updated.length} monitor items with 'filter' objects.`);
};

main();
