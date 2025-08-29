const fs = require("fs");
const path = require("path");

const FILE = path.resolve(
  __dirname,
  "..",
  "constants",
  "products",
  "server.json"
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
    "ram",
    "hdd",
    "ssd",
    "raid",
    "pcie",
    "usb",
    "vga",
    "dvi",
    "hdmi",
    "sata",
    "sas",
    "nvme",
    "ddr",
    "udimm",
    "rdimm",
    "idrac",
    "ilo",
    "ocp",
    "gpu",
    "fpga",
    "tpm",
    "uefi",
    "fips",
    "pci",
    "lan",
    "nic",
    "lom",
    "gt",
    "mt",
    "mb",
    "gb",
    "tb",
    "watt",
    "u",
    "rack",
    "tower",
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

const processorFromText = (specs, desc) => {
  const t = `${JSON.stringify(specs)}\n${desc}`.toUpperCase();
  const m = t.match(/INTEL\s+(?:XEON|CORE)\s+([A-Z0-9\-]+)/);
  if (m) return `Intel ${m[1]}`;
  return undefined;
};

const processorCoresFromText = (specs, desc) => {
  const t = `${JSON.stringify(specs)}\n${desc}`.toUpperCase();
  const m = t.match(/(\d+)C/);
  if (m) return `${parseInt(m[1])} Cores`;
  return undefined;
};

const processorThreadsFromText = (specs, desc) => {
  const t = `${JSON.stringify(specs)}\n${desc}`.toUpperCase();
  const m = t.match(/(\d+)T/);
  if (m) return `${parseInt(m[1])} Threads`;
  return undefined;
};

const memoryFromText = (specs, desc) => {
  const t = `${JSON.stringify(specs)}\n${desc}`.toUpperCase();
  const m = t.match(/(\d+)\s*GB/);
  if (m) return `${parseInt(m[1])} GB`;
  return undefined;
};

const memoryTypeFromText = (specs, desc) => {
  const t = `${JSON.stringify(specs)}\n${desc}`.toUpperCase();
  if (/DDR4/.test(t)) return "DDR4";
  if (/DDR5/.test(t)) return "DDR5";
  if (/DDR3/.test(t)) return "DDR3";
  return undefined;
};

const storageFromText = (specs, desc) => {
  const t = `${JSON.stringify(specs)}\n${desc}`.toUpperCase();
  const m = t.match(/(\d+(?:\.\d+)?)\s*(?:TB|GB)/);
  if (m) {
    const size = parseFloat(m[1]);
    if (size >= 1) return `${size} TB`;
    return `${(size * 1000).toFixed(0)} GB`;
  }
  return undefined;
};

const storageTypeFromText = (specs, desc) => {
  const t = `${JSON.stringify(specs)}\n${desc}`.toUpperCase();
  if (/\bSSD\b/.test(t)) return "SSD";
  if (/\bHDD\b/.test(t)) return "HDD";
  if (/\bSAS\b/.test(t)) return "SAS";
  if (/\bSATA\b/.test(t)) return "SATA";
  if (/\bNVME\b/.test(t)) return "NVMe";
  return undefined;
};

const formFactorFromText = (specs, desc) => {
  const t = `${JSON.stringify(specs)}\n${desc}`.toUpperCase();
  if (/1U|2U|3U|4U/.test(t)) return "Rack Mount";
  if (/TOWER/.test(t)) return "Tower";
  if (/MICRO/.test(t)) return "Micro";
  return undefined;
};

const networkFromText = (specs, desc) => {
  const t = `${JSON.stringify(specs)}\n${desc}`.toUpperCase();
  if (/10GBE|10\s*GB/.test(t)) return "10GbE";
  if (/1GBE|1\s*GB/.test(t)) return "1GbE";
  if (/25GBE|25\s*GB/.test(t)) return "25GbE";
  return undefined;
};

const powerSupplyFromText = (specs, desc) => {
  const t = `${JSON.stringify(specs)}\n${desc}`.toUpperCase();
  const m = t.match(/(\d+)\s*W/);
  if (m) return `${parseInt(m[1])} W`;
  return undefined;
};

const driveBaysFromText = (specs, desc) => {
  const t = `${JSON.stringify(specs)}\n${desc}`.toUpperCase();
  const m = t.match(/(\d+)\s*(?:BAY|DRIVE)/);
  if (m) return `${parseInt(m[1])} Bays`;
  return undefined;
};

const raidFromText = (specs, desc) => {
  const t = `${JSON.stringify(specs)}\n${desc}`.toUpperCase();
  if (
    /RAID\s*0|RAID\s*1|RAID\s*5|RAID\s*6|RAID\s*10|RAID\s*50|RAID\s*60/.test(t)
  )
    return "Yes";
  return undefined;
};

const operatingSystemFromText = (specs, desc) => {
  const t = `${JSON.stringify(specs)}\n${desc}`.toUpperCase();
  if (/WINDOWS\s+SERVER/.test(t)) return "Windows Server";
  if (/LINUX/.test(t)) return "Linux";
  if (/VMWARE/.test(t)) return "VMware";
  if (/NO\s+OPERATING\s+SYSTEM/.test(t)) return "No OS";
  return undefined;
};

const warrantyFromText = (specs, desc) => {
  const t = `${JSON.stringify(specs)}\n${desc}`.toUpperCase();
  const m = t.match(/(\d+)\s*(?:YEAR|Y)/);
  if (m) return `${parseInt(m[1])} Years`;
  return undefined;
};

const buildRawFilter = (item) => {
  const specs = item.Specifications || {};
  const desc = item.description || "";
  const name = item.name || "";

  const brand = brandFromName(name);
  const processor = processorFromText(specs, desc);
  const processorCores = processorCoresFromText(specs, desc);
  const processorThreads = processorThreadsFromText(specs, desc);
  const memory = memoryFromText(specs, desc);
  const memoryType = memoryTypeFromText(specs, desc);
  const storage = storageFromText(specs, desc);
  const storageType = storageTypeFromText(specs, desc);
  const formFactor = formFactorFromText(specs, desc);
  const network = networkFromText(specs, desc);
  const powerSupply = powerSupplyFromText(specs, desc);
  const driveBays = driveBaysFromText(specs, desc);
  const raid = raidFromText(specs, desc);
  const operatingSystem = operatingSystemFromText(specs, desc);
  const warranty = warrantyFromText(specs, desc);

  const raw = {};
  if (brand) raw.brand = brand;
  if (processor) raw.processor = processor;
  if (processorCores) raw.processor_cores = processorCores;
  if (processorThreads) raw.processor_threads = processorThreads;
  if (memory) raw.memory = memory;
  if (memoryType) raw.memory_type = memoryType;
  if (storage) raw.storage = storage;
  if (storageType) raw.storage_type = storageType;
  if (formFactor) raw.form_factor = formFactor;
  if (network) raw.network = network;
  if (powerSupply) raw.power_supply = powerSupply;
  if (driveBays) raw.drive_bays = driveBays;
  if (raid) raw.raid = raid;
  if (operatingSystem) raw.operating_system = operatingSystem;
  if (warranty) raw.warranty = warranty;

  return raw;
};

const main = () => {
  const data = read();
  if (!Array.isArray(data)) {
    console.error("server.json is not an array");
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
  console.log(`Updated ${updated.length} server items with 'filter' objects.`);
};

main();
