
/* eslint-disable @typescript-eslint/no-explicit-any */
// Mocking the code from validators.ts
const transformations = {
    trim: (value: any) => (typeof value === 'string' ? value.trim() : value),
    lowercase: (value: any) => (typeof value === 'string' ? value.toLowerCase() : value),
    boolean: (value: any) => {
        if (typeof value === 'boolean') return value;
        const s = String(value).toLowerCase();
        return s === 'true' || s === '1' || s === 'yes' || s === 'y';
    }
};

const processRow = (row: any, configs: any[]) => {
    const newRow = { ...row };
    configs.forEach(config => {
        let value = newRow[config.column];

        // Apply transformations
        if (config.transformations && config.transformations.length > 0) {
            config.transformations.forEach((t: string) => {
                value = transformations[t as keyof typeof transformations](value);
            });
        }
        newRow[config.column] = value;
    });
    return newRow;
};

// Test Case
const inputData = [
    { id: 1, indicator: "N" },
    { id: 2, indicator: "Y" },
    { id: 3, indicator: "true" },
    { id: 4, indicator: "False" }
];

const config = [
    { column: "indicator", transformations: ["boolean"] }
];

console.log("Original:", JSON.stringify(inputData, null, 2));

const processed = inputData.map(row => processRow(row, config));

console.log("Processed:", JSON.stringify(processed, null, 2));

export { };
