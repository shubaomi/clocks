import { copyFile, mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import { clocks } from "../src/lib/catalog.js";

const distRoot = resolve("dist");
const sourceIndex = resolve(distRoot, "index.html");

await Promise.all(
  clocks.map(async ({ slug }) => {
    const routeDirectory = resolve(distRoot, slug);
    await mkdir(routeDirectory, { recursive: true });
    await copyFile(sourceIndex, resolve(routeDirectory, "index.html"));
  }),
);

console.log(`Generated ${clocks.length} physical clock routes.`);
