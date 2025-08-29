const fs = require("fs");
const path = require("path");

const FILE = path.resolve(
  __dirname,
  "..",
  "constants",
  "products",
  "mobile-phone-charger-adapter.json"
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

const wattsFromText = (s) => {
  if (!s) return undefined;
  const t = String(s).toUpperCase();
  const m = t.match(/(\d+(?:\.\d+)?)\s*(W|WATT|WATTS)/);
  if (m) return `${parseFloat(m[1])} W`;
  // Sometimes noted as 65W, 20W inside text
  const m2 = t.match(/(\d{1,3})\s*W/);
  if (m2) return `${parseFloat(m2[1])} W`;
  return undefined;
};

const brandFromName = (name) => {
  if (!name) return undefined;
  const first = String(name).trim().split(/\s+/)[0];
  return first.charAt(0).toUpperCase() + first.slice(1);
};

const formatKey = (snake) => {
  const acronyms = new Set(["pd", "qc", "pps", "usb", "gan"]);
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

const chargerTypeFromText = (name, desc) => {
  const t = `${name}\n${desc}`.toUpperCase();
  if (/CAR\s+CHARGER/.test(t)) return "Car";
  if (/WIRELESS\s+CHARG(ER|ING)/.test(t)) return "Wireless";
  if (/DESKTOP|DOCK|STATION/.test(t)) return "Desktop";
  if (/TRAVEL|UNIVERSAL\s+TRAVEL/.test(t)) return "Travel";
  return "Wall";
};

const portsFromText = (specs, desc) => {
  const t = `${JSON.stringify(specs)}\n${desc}`.toUpperCase();
  const hasC = /TYPE[-\s]?C|USB[-\s]?C/.test(t);
  const hasA = /USB(?!-?C)\b|USB\s*A\b/.test(t);
  if (hasC && hasA) return "USB-A + Type-C";
  if (hasC) return "Type-C";
  if (hasA) return "USB-A";
  return undefined;
};

const protocolsFromText = (specs, desc) => {
  const t = `${JSON.stringify(specs)}\n${desc}`.toUpperCase();
  const flags = [];
  if (/\bPD\b|POWER\s*DELIVERY/.test(t)) flags.push("PD");
  if (/\bQC\s*3|QUICK\s*CHARGE\s*3/.test(t)) flags.push("QC3.0");
  if (/\bQC\s*4/.test(t)) flags.push("QC4.0");
  if (/\bPPS\b/.test(t)) flags.push("PPS");
  if (/\bSCP\b/.test(t)) flags.push("SCP");
  if (/\bFCP\b/.test(t)) flags.push("FCP");
  if (/\bAFC\b/.test(t)) flags.push("AFC");
  if (/\bVOOC\b|SUPER\s*VOOC/.test(t)) flags.push("VOOC");
  return flags.length ? flags.join(", ") : undefined;
};

const plugTypeFromText = (specs, desc) => {
  const t = `${JSON.stringify(specs)}\n${desc}`.toUpperCase();
  if (/\bEU\b|EU\s*PLUG/.test(t)) return "EU";
  if (/\bUS\b|US\s*PLUG/.test(t)) return "US";
  if (/\bUK\b|UK\s*PLUG/.test(t)) return "UK";
  if (/\bAU\b|AU\s*PLUG/.test(t)) return "AU";
  return undefined;
};

const wirelessSupport = (name, desc) => {
  const t = `${name}\n${desc}`.toUpperCase();
  return /WIRELESS\s+CHARG(ER|ING)/.test(t) ? "Yes" : undefined;
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
  const chargerType = chargerTypeFromText(name, desc);
  const ports = portsFromText(specs, desc);
  const protocols = protocolsFromText(specs, desc);
  const plug = plugTypeFromText(specs, desc);
  const wireless = wirelessSupport(name, desc);
  const color = colorFromSpecs(specs);

  // Try to detect max output power from specs first, else description
  const power =
    wattsFromText(
      specs["Power"] || specs["Power Supply"] || specs["Transmission Rate"]
    ) ||
    wattsFromText(desc) ||
    wattsFromText(name);

  const raw = {};
  if (brand) raw.brand = brand;
  if (chargerType) raw.charger_type = chargerType;
  if (ports) raw.ports = ports;
  if (protocols) raw.fast_charge_protocols = protocols;
  if (plug) raw.plug_type = plug;
  if (wireless) raw.wireless_charging = wireless;
  if (power) raw.max_output_power = power;
  if (color) raw.color = color;

  return raw;
};

const main = () => {
  const data = read();
  if (!Array.isArray(data)) {
    console.error("mobile-phone-charger-adapter.json is not an array");
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
    `Updated ${updated.length} charger adapter items with 'filter' objects.`
  );
};

main();
