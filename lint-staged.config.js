// lint-staged.config.js
module.exports = {
    '**/*.ts?(x)': () => 'tsc -p tsconfig.json --noEmit --incremental false',
    "src/**/*.{ts,tsx}": [
        "npm run lint -- --fix",
        "npm test -- --ci --bail --findRelatedTests",
        "npm run prettier"
    ]
}
