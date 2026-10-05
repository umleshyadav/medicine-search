const BASE = "https://api.fda.gov/drug/label.json";

const searchCache = new Map();
const detailCache = new Map(); 

async function request(search, signal) {
  const res = await fetch(`${BASE}?search=${search}&limit=20`, { signal });
  if (res.status === 404) return [];
  if (res.status === 429)
    throw new Error("Too many requests. Please wait a moment and try again.");
  if (!res.ok)
    throw new Error(`The FDA service returned an error (${res.status}).`);
  return (await res.json()).results ?? [];
}

const remember = (results) => results.forEach((r) => detailCache.set(r.id, r));

export async function searchMedicines(query, signal) {
  const key = query.toLowerCase();
  if (searchCache.has(key)) return searchCache.get(key);
  const safe = encodeURIComponent(
    `openfda.brand_name:"${query.replace(/["\\]/g, "")}"`,
  );
  const results = await request(safe, signal);
  searchCache.set(key, results);
  remember(results);
  return results;
}

export async function getMedicine(id, signal) {
  if (detailCache.has(id)) return detailCache.get(id);
  const [result] = await request(encodeURIComponent(`id:"${id}"`), signal);
  if (result) remember([result]);
  return result ?? null;
}
