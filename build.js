const { join } = require('path');
const { readFileSync, writeFileSync } = require('fs');

const readFile = (...parts) => readFileSync(join(__dirname, ...parts));
const writeFile = (data, ...parts) =>
    writeFileSync(join(__dirname, ...parts), data);

// package.json
const packageJson = JSON.parse(readFile('package.json'));
packageJson._moduleAliases = Object.keys(packageJson._moduleAliases).reduce(
    (prev, current) => {
        prev[current] = packageJson._moduleAliases[current].replace(
            '.ts',
            '.js'
        );
        return prev;
    },
    {}
);

writeFile(JSON.stringify(packageJson, undefined, 2), 'package.json');
