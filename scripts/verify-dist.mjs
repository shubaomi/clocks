import { access, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { clocks } from "../src/lib/catalog.js";

const distRoot = resolve("dist");
const expectedFiles = [
  resolve(distRoot, "index.html"),
  ...clocks.map(({ slug }) => resolve(distRoot, slug, "index.html")),
];

await Promise.all(expectedFiles.map((file) => access(file)));

const index = await readFile(expectedFiles[0], "utf8");
if (!index.startsWith("<!doctype html>")) {
  throw new Error("dist/index.html is not a complete HTML document");
}

if (!index.includes("/assets/")) {
  throw new Error("dist/index.html does not reference the built asset bundle");
}

console.log(`Verified homepage and ${clocks.length} physical detail routes.`);
