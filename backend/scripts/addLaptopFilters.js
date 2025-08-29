const fs = require("fs");
const path = require("path");

const FILE = path.resolve(
  __dirname,
  "..",
  "constants",
  "products",
  "laptops.json"
);

const read = () => JSON.parse(fs.readFileSync(FILE, "utf8"));
const write = (data) =>
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2) + "\n", "utf8");

const normYesNo = (v) => {
  if (!v) return undefined;
  const s = String(v).trim().toLowerCase();
  if (["yes", "y", "true", "1"].includes(s)) return "Yes";
  if (["no", "n", "false", "0"].includes(s)) return "No";
  return undefined;
};

const extractNumber = (s) => {
  if (!s) return undefined;
  const m = String(s)
    .replace(/,/g, "")
    .match(/(\d+(\.\d+)?)/);
  return m ? parseFloat(m[1]) : undefined;
};

const gbFromString = (s) => {
  if (!s) return undefined;
  const txt = String(s).toLowerCase();
  const tb = txt.match(/(\d+(\.\d+)?)\s*tb/);
  if (tb) return `${parseFloat(tb[1]) * 1024} GB`;
  const gb = txt.match(/(\d+(\.\d+)?)\s*gb/);
  if (gb) return `${parseFloat(gb[1])} GB`;
  const onlyNum = extractNumber(txt);
  return Number.isFinite(onlyNum) ? `${onlyNum} GB` : undefined;
};

const normalizeInch = (v) => {
  if (!v) return undefined;
  const txt = String(v)
    .toLowerCase()
    .replace(/("|”|inch(es)?|in\.?)/g, " inch");
  const num = extractNumber(txt);
  if (!Number.isFinite(num)) return undefined;
  const val = Number.isInteger(num) ? `${num}` : `${num}`;
  return `${val} Inch`;
};

const normalizeResolution = (v) => {
  if (!v) return undefined;
  let s = String(v)
    .replace(/[×xXX*]/g, "x")
    .replace(/\s+/g, " ")
    .toUpperCase();
  const m = s.match(/(\d{3,4})\s*x\s*(\d{3,4})/);
  return m ? `${m[1]} x ${m[2]}` : undefined;
};

const normalizeGeneration = (gen, model) => {
  const pick = (txt) => {
    if (!txt) return undefined;
    const s = String(txt);
    const m = s.match(/(\d{1,2})(?:st|nd|rd|th)?\s*Gen/i);
    if (m) return `${parseInt(m[1], 10)}th Gen`;
    const m2 = s.match(/(M\d)\b/i);
    if (m2) return m2[1].toUpperCase();
    return undefined;
  };
  return pick(gen) || pick(model);
};

const processorSeries = (model) => {
  if (!model) return undefined;
  const s = String(model).toLowerCase();
  if (s.includes("core i3")) return "Core i3";
  if (s.includes("core i5")) return "Core i5";
  if (s.includes("core i7")) return "Core i7";
  if (s.includes("core i9")) return "Core i9";
  if (s.includes("ryzen 3")) return "Ryzen 3";
  if (s.includes("ryzen 5")) return "Ryzen 5";
  if (s.includes("ryzen 7")) return "Ryzen 7";
  if (s.includes("ryzen 9")) return "Ryzen 9";
  if (/m[1-9]\b/.test(s)) {
    const m = s.match(/(m[1-9])\b/);
    return m ? m[1].toUpperCase() : undefined;
  }
  return undefined;
};

const cleanColor = (v) => {
  if (!v) return undefined;
  const first = String(v)
    .split(/\r?\n|\/|,|;/)[0]
    .trim();
  return first || undefined;
};

const brandFromName = (name) => {
  if (!name) return undefined;
  const firstWord = String(name).trim().split(/\s+/)[0];
  const map = {
    MSI: "MSI",
    HP: "HP",
    ASUS: "ASUS",
    ACER: "Acer",
    DELL: "Dell",
    LENOVO: "Lenovo",
    APPLE: "Apple",
    HUAWEI: "Huawei",
    CHUWI: "Chuwi",
    MICROSOFT: "Microsoft",
  };
  const upper = firstWord.toUpperCase();
  if (map[upper]) return map[upper];
  return firstWord.charAt(0).toUpperCase() + firstWord.slice(1);
};

const brandFromDescription = (desc) => {
  if (!desc) return undefined;
  const candidates = [
    "Dell",
    "Apple",
    "Lenovo",
    "MSI",
    "HP",
    "ASUS",
    "Acer",
    "Chuwi",
    "Huawei",
    "Microsoft",
  ];
  const found = candidates.find((b) =>
    new RegExp(`\\b${b}\\b`, "i").test(desc)
  );
  return found;
};

const normalizeGraphics = (v) => {
  if (!v) return undefined;
  let s = String(v).trim();
  s = s.replace(/\s+/g, " ");
  return s;
};

const normalizeOS = (v) => {
  if (!v) return undefined;
  let s = String(v).trim();
  s = s.replace(/windows\s*11.*/i, "Windows 11");
  s = s.replace(/windows\s*10.*/i, "Windows 10");
  s = s.replace(/mac\s*os|macos/i, "macOS");
  s = s.replace(/free\s*dos|freedos/i, "FreeDOS");
  return s;
};

const parseRam = (specs, description) => {
  let r = specs?.RAM || description?.match(/RAM:\s*([^\r\n]+)/i)?.[1];
  if (!r) return undefined;
  return gbFromString(
    r.replace(/x\s*\d+|onboard|lpddr\d+x?|ddr\d/gi, "").trim()
  );
};

const parseStorage = (specs, description) => {
  let type = specs?.["Storage Type"] || "";
  let cap = specs?.["Storage Capacity"] || "";
  if ((!type || !cap) && description) {
    const m = description.match(/Storage:\s*([^\r\n]+)/i);
    if (m) {
      cap = m[1];
      if (/ssd/i.test(m[1])) type = "SSD";
      if (/hdd/i.test(m[1])) type = "HDD";
    }
  }
  const ssd = /ssd|nvme/i.test(type) ? gbFromString(cap) : undefined;
  const hdd = /hdd/i.test(type) ? gbFromString(cap) : undefined;

  const capTxt = String(cap);
  const ssdFromCap = /ssd|nvme/i.test(capTxt)
    ? gbFromString(capTxt)
    : undefined;
  const hddFromCap = /hdd/i.test(capTxt) ? gbFromString(capTxt) : undefined;

  return {
    ssd: ssd || ssdFromCap,
    hdd: hdd || hddFromCap,
  };
};

const parseProcessor = (specs, description) => {
  const pBrand = specs?.["Processor Brand"] || undefined;
  const pModel =
    specs?.["Processor Model"] ||
    description?.match(/Processor:\s*([^\r\n]+)/i)?.[1];
  const brand = pBrand
    ? /intel/i.test(pBrand)
      ? "Intel"
      : /amd/i.test(pBrand)
      ? "AMD"
      : /apple/i.test(pBrand)
      ? "Apple"
      : pBrand
    : pModel &&
      (/intel/i.test(pModel)
        ? "Intel"
        : /ryzen|amd/i.test(pModel)
        ? "AMD"
        : /apple|m[1-9]/i.test(pModel)
        ? "Apple"
        : undefined);
  const series = processorSeries(pModel);
  const generation = normalizeGeneration(specs?.Generation, pModel);
  return { brand, model: pModel, series, generation };
};

const buildFilter = (item) => {
  const specs = item.Specifications || {};
  const description = item.description || "";

  const brand = brandFromName(item.name) || brandFromDescription(description);

  const {
    brand: processor_brand,
    model: processor_model,
    series: processor_series,
    generation: processor_generation,
  } = parseProcessor(specs, description);

  const ram = parseRam(specs, description);

  const { ssd: storage_ssd, hdd: storage_hdd } = parseStorage(
    specs,
    description
  );

  const display_size = normalizeInch(
    specs["Display Size"] || description?.match(/Display:\s*([^\r\n]+)/i)?.[1]
  );
  const display_resolution = normalizeResolution(specs["Display Resolution"]);

  const graphics = normalizeGraphics(specs["Graphics Model"]);
  const os = normalizeOS(specs["Operating System"]);

  const touchscreen = normYesNo(specs["Touch Screen"]);
  const fingerprint = normYesNo(specs["Fingerprint Sensor"]);

  const color = cleanColor(specs["Color"]);

  const filter = {};
  if (brand) filter.brand = brand;
  if (processor_brand) filter.processor_brand = processor_brand;
  if (processor_series) filter.processor_series = processor_series;
  if (processor_model) filter.processor_model = processor_model;
  if (processor_generation) filter.processor_generation = processor_generation;
  if (ram) filter.ram = ram;
  if (storage_ssd) filter.storage_ssd = storage_ssd;
  if (storage_hdd) filter.storage_hdd = storage_hdd;
  if (display_size) filter.display_size = display_size;
  if (display_resolution) filter.display_resolution = display_resolution;
  if (graphics) filter.graphics = graphics;
  if (os) filter.os = os;
  if (touchscreen) filter.touchscreen = touchscreen;
  if (fingerprint) filter.fingerprint = fingerprint;
  if (color) filter.color = color;

  return filter;
};

const main = () => {
  const data = read();
  if (!Array.isArray(data)) {
    console.error("laptops.json is not an array");
    process.exit(1);
  }

  const updated = data.map((item) => {
    const filter = buildFilter(item);
    return { ...item, filter };
  });

  write(updated);
  console.log(`Updated ${updated.length} laptop items with 'filter' objects.`);
};

main();
