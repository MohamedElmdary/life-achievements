const { join } = require("path");
const { readFileSync, writeFileSync, copyFileSync } = require("fs");

const readFile = (...parts) => readFileSync(join(__dirname, ...parts));
const writeFile = (data, ...parts) =>
  writeFileSync(join(__dirname, ...parts), data);
const copyFile = (src, dest) =>
  copyFileSync(join(__dirname, ...src), join(__dirname, ...dest));

// package.json
const packageJson = JSON.parse(readFile("package.json"));
packageJson._moduleAliases = Object.keys(packageJson._moduleAliases).reduce(
  (prev, current) => {
    prev[current] = packageJson._moduleAliases[current].replace(".ts", ".js");
    return prev;
  },
  {}
);
writeFile(JSON.stringify(packageJson, undefined, 2), "dist", "package.json");

// prisma graphql schema
copyFile(
  ["generated", "schema.prisma.graphql"],
  ["dist", "generated", "schema.prisma.graphql"]
);
