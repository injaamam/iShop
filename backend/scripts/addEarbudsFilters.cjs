const fs = require("fs");
const path = require("path");

const FILE = path.resolve(
  __dirname,
  "..",
  "constants",
  "products",
  "earbuds.json"
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

const mahFromString = (s) => {
  if (!s) return undefined;
  const m = String(s)
    .toLowerCase()
    .match(/(\d+(?:\.\d+)?)\s*mah/);
  if (m) return `${parseFloat(m[1])} mAh`;
  const only = extractNumber(s);
  return Number.isFinite(only) ? `${only} mAh` : undefined;
};

const mmFromString = (s) => {
  if (!s) return undefined;
  const m = String(s)
    .toLowerCase()
    .match(/(\d+(?:\.\d+)?)\s*mm/);
  if (m) return `${parseFloat(m[1])} mm`;
  const only = extractNumber(s);
  return Number.isFinite(only) ? `${only} mm` : undefined;
};

const pickBluetoothVersion = (v) => {
  if (!v) return undefined;
  const s = String(v).toUpperCase();
  const m = s.match(/\bV?\s*5\.[0-4]|\bV?\s*4\.[0-9]|\bV\s*5\b|\b5\.[0-9]\b/);
  if (m) {
    const ver = m[0].replace(/[^0-9.]/g, "");
    return ver ? `Bluetooth ${ver}` : undefined;
  }
  if (/BLUETOOTH/i.test(s)) return "Bluetooth";
  if (/WIRELESS/i.test(s)) return "Wireless";
  return undefined;
};

const pickChargingInterface = (specs, desc) => {
  const candidates = [
    specs.Connector,
    specs["Connection Type"],
    specs["Charging Interface"],
    specs["Charging Port"],
    desc,
  ].filter(Boolean);
  const text = candidates.join(" \n ").toUpperCase();
  if (/TYPE[-\s]?C|USB[-\s]?C/.test(text)) return "Type-C";
  if (/LIGHTNING/.test(text)) return "Lightning";
  if (/MICRO\s*USB/.test(text)) return "Micro USB";
  if (/QI|WIRELESS CHARGING/.test(text)) return "Wireless";
  return undefined;
};

const hasANC = (specs, desc) => {
  const t = `${JSON.stringify(specs)}\n${desc}`.toUpperCase();
  return /(\bANC\b|ACTIVE\s+NOISE\s+CANCELL)/.test(t) ? "Yes" : undefined;
};

const hasENC = (specs, desc) => {
  const t = `${JSON.stringify(specs)}\n${desc}`.toUpperCase();
  return /(\bENC\b|ENVIRONMENTAL\s+NOISE\s+CANCELL)/.test(t)
    ? "Yes"
    : undefined;
};

const waterResistant = (specs, desc) => {
  const t = `${JSON.stringify(specs)}\n${desc}`.toUpperCase();
  if (/IPX\d|WATER\s*RESIST|WATERPROOF/i.test(t)) return "Yes";
  return undefined;
};

const playtimeHours = (specs, desc) => {
  const t = `${JSON.stringify(specs)}\n${desc}`;
  const m = t.match(/(\d{1,3})\s*(?:H|HRS|HOURS)\b/i);
  if (m) return `${parseInt(m[1], 10)} Hours`;
  return undefined;
};

const brandFromName = (name) => {
  if (!name) return undefined;
  const firstWord = String(name).trim().split(/\s+/)[0];
  const map = {
    HOCO: "Hoco",
    LENOVO: "Lenovo",
    AWEI: "Awei",
    YISON: "Yison",
    FONENG: "FONENG",
    XIAOMI: "Xiaomi",
    HAVIT: "Havit",
    ORAIMO: "Oraimo",
    ANKER: "Anker",
    EARFUN: "EarFun",
    BASEUS: "Baseus",
    REALME: "Realme",
    JBL: "JBL",
    SONY: "Sony",
    GOOGLE: "Google",
    JABRA: "Jabra",
    UGREEN: "Ugreen",
    EDIFIER: "Edifier",
    SOUNDPEATS: "SoundPEATS",
    ONEPLUS: "OnePlus",
    APPLE: "Apple",
    WIWU: "WiWU",
    XINJI: "XINJI",
    MIBRO: "Mibro",
    DEFY: "DEFY",
    TCL: "TCL",
  };
  const upper = firstWord.toUpperCase();
  if (map[upper]) return map[upper];
  return firstWord.charAt(0).toUpperCase() + firstWord.slice(1);
};

const formatKey = (snake) => {
  const acronyms = new Set(["anc", "enc", "ipx", "bt", "usb"]);
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
  const bluetooth = pickBluetoothVersion(
    specs["Connection Type"] || specs.Connector || description
  );
  const charging = pickChargingInterface(specs, description);

  const mic = normYesNo(
    specs.Microphone || description.includes("Microphone") ? "yes" : undefined
  );
  const anc = hasANC(specs, description);
  const enc = hasENC(specs, description);
  const water = waterResistant(specs, description);

  const driver = mmFromString(
    specs.Drivers || specs["Driver"] || specs["Driver Diameter"] || description
  );
  const batteryCase = mahFromString(specs.Battery || description);
  const duration = playtimeHours(specs, description);

  const raw = {};
  if (brand) raw.brand = brand;
  if (bluetooth) raw.bluetooth = bluetooth;
  if (charging) raw.charging_interface = charging;
  if (mic) raw.microphone = mic;
  if (anc) raw.anc = anc;
  if (enc) raw.enc = enc;
  if (water) raw.water_resistant = water;
  if (driver) raw.driver_size = driver;
  if (batteryCase) raw.battery_capacity = batteryCase;
  if (duration) raw.playtime = duration;

  return raw;
};

const main = () => {
  const data = read();
  if (!Array.isArray(data)) {
    console.error("earbuds.json is not an array");
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
  console.log(`Updated ${updated.length} earbud items with 'filter' objects.`);
};

main();
