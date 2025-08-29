const fs = require("fs");
const path = require("path");

const FILE = path.resolve(
  __dirname,
  "..",
  "constants",
  "products",
  "gaming-chair.json"
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

const kgFromString = (s) => {
  if (!s) return undefined;
  const m = String(s)
    .toLowerCase()
    .match(/(\d+(?:\.\d+)?)\s*kg/);
  if (m) return `${parseFloat(m[1])} kg`;
  const n = extractNumber(s);
  return Number.isFinite(n) ? `${n} kg` : undefined;
};

const mmFromString = (s) => {
  if (!s) return undefined;
  const m = String(s)
    .toLowerCase()
    .match(/(\d+(?:\.\d+)?)\s*mm/);
  if (m) return `${parseFloat(m[1])} mm`;
  const n = extractNumber(s);
  return Number.isFinite(n) ? `${n} mm` : undefined;
};

const degreeFromString = (s) => {
  if (!s) return undefined;
  const m = String(s)
    .toLowerCase()
    .match(/(\d+(?:\.\d+)?)\s*°/);
  if (m) return `${parseFloat(m[1])} °`;
  const n = extractNumber(s);
  return Number.isFinite(n) ? `${n} °` : undefined;
};

const brandFromName = (name) => {
  if (!name) return undefined;
  const first = String(name).trim().split(/\s+/)[0];
  const map = {
    XTRIKE: "Xtrike",
    XTRIKEME: "Xtrike",
    GAMEMAX: "GameMax",
    MEETION: "MeeTion",
    COUGAR: "Cougar",
    MARVO: "Marvo",
  };
  const up = first.toUpperCase();
  if (map[up]) return map[up];
  return first.charAt(0).toUpperCase() + first.slice(1);
};

const formatKey = (snake) => {
  const parts = String(snake).split("_");
  if (parts.length === 0) return snake;
  const pretty = parts.map((p) => {
    const lower = p.toLowerCase();
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  });
  return pretty.join(" ");
};

const toPresentationKeys = (obj) => {
  const out = {};
  for (const [k, v] of Object.entries(obj)) out[formatKey(k)] = v;
  return out;
};

const parseArmrestType = (specs) => {
  const v = specs["Adjustable Armrests"] || specs["Armrests"];
  if (!v) return undefined;
  const s = String(v).toUpperCase();
  if (/5D/.test(s)) return "5D";
  if (/4D/.test(s)) return "4D";
  if (/3D/.test(s)) return "3D";
  if (/2D/.test(s)) return "2D";
  if (/FIXED|NONE/.test(s)) return "Fixed";
  return undefined;
};

const buildRawFilter = (item) => {
  const specs = item.Specifications || {};
  const desc = item.description || "";

  const brand = brandFromName(item.name);
  const chairType = specs["Chair Type"] || undefined;
  const armrest = parseArmrestType(specs);
  const maxLoad = kgFromString(specs["Max Load"]);
  const weight = kgFromString(specs["Chair Weight"]);

  const seatDepth = mmFromString(
    specs["Seat Depth"] || specs["Seat Depth Adjustability"]
  );
  const seatingArea = mmFromString(specs["Seating Area"]);
  const heightAdj = mmFromString(specs["Height Adjustability"]);
  const floorToSeat = mmFromString(specs["Floor to Seat Top"]);
  const baseDiameter = mmFromString(specs["Diameter of Base"]);

  const colors = specs["Colors"] || undefined;

  const raw = {};
  if (brand) raw.brand = brand;
  if (chairType) raw.chair_type = chairType;
  if (armrest) raw.armrest = armrest;
  if (maxLoad) raw.max_load = maxLoad;
  if (weight) raw.chair_weight = weight;
  if (seatingArea) raw.seating_area = seatingArea;
  if (seatDepth) raw.seat_depth = seatDepth;
  if (heightAdj) raw.height_adjustability = heightAdj;
  if (floorToSeat) raw.floor_to_seat_top = floorToSeat;
  if (baseDiameter) raw.base_diameter = baseDiameter;
  if (colors) raw.color = String(colors).split(/\r?\n|,\s*/)[0];

  return raw;
};

const main = () => {
  const data = read();
  if (!Array.isArray(data)) {
    console.error("gaming-chair.json is not an array");
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
    `Updated ${updated.length} gaming chair items with 'filter' objects.`
  );
};

main();
