import memoryCache from "memory-cache";

type CacheParams = {
  name: string;
  time?: string;
};

function cache({ name, time }: CacheParams, data: JSON | string) {
  const cached = memoryCache.get(name);
  if (cached) return JSON.parse(cached);
  console.log(`${name} value is not cached!`);
  memoryCache.put(name, JSON.stringify(data));
  return data;
}

export { cache };
