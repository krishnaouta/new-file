
// Inline simplified logic from validators.ts to bypass import issues

const transformations: Record<string, (val: unknown) => unknown> = {
    trim: (value: unknown) => (typeof value === 'string' ? value.trim() : value),
    lowercase: (value: unknown) => (typeof value === 'string' ? value.toLowerCase() : value),
    uppercase: (value: unknown) => (typeof value === 'string' ? value.toUpperCase() : value),
    number: (value: unknown) => {
        if (typeof value === 'number') return value;
        const num = Number(value);
        return isNaN(num) ? value : num;
    },
    boolean: (value: unknown) => {
        const s = String(value).trim().toLowerCase();
        const res = (() => {
            if (typeof value === 'boolean') return value;
            if (s === 'true' || s === '1' || s === 'yes' || s === 'y' || s === 't') return true;
            if (s === 'false' || s === '0' || s === 'no' || s === 'n' || s === 'f') return false;
            return false;
        })();
        console.log(`[Boolean Debug] Input: "${String(value)}" (${typeof value}), Processed: "${s}", Result: ${res}`);
        return res;
    }
};

interface TransformConfig {
    column: string;
    transformations?: string[];
}

const processRow = (row: Record<string, unknown>, configs: TransformConfig[]) => {
    const newRow = { ...row };
    const errors: Record<string, string> = {};

    configs.forEach(config => {
        let value = newRow[config.column];

        // Apply transformations
        if (config.transformations && config.transformations.length > 0) {
            config.transformations.forEach((t: string) => {
                if (transformations[t]) {
                    value = transformations[t](value);
                } else {
                    console.warn(`Transformation '${t}' not found`);
                }
            });
        }
        newRow[config.column] = value;
    });

    return { row: newRow, errors };
};

const testValue = "BorrowerBankruptcyIndicator5_dummy";
const transformName = "boolean";

console.log(`Testing '${transformName}' transformation on value: "${testValue}"`);

if (transformations[transformName]) {
    const result = transformations[transformName](testValue);
    console.log(`Result type: ${typeof result}`);
    console.log(`Result value: ${result}`);

    if (result === false) {
        console.log("SUCCESS: Value transformed to false as expected.");
    } else {
        console.log("FAILURE: Value did not transform to false.");
    }
} else {
    console.log(`FAILURE: Transformation '${transformName}' not found.`);
}

// Test processRow integration
const row = { "BorrowerBankruptcyIndicator": testValue };
// Simulate header matching logic
const configs = [{ column: "BorrowerBankruptcyIndicator", transformations: ["boolean"] }];

console.log("\nTesting processRow integration:");
const { row: processedRow } = processRow(row, configs);
console.log(`Processed Row Value: ${processedRow["BorrowerBankruptcyIndicator"]}`);

if (processedRow["BorrowerBankruptcyIndicator"] === false) {
    console.log("SUCCESS: processRow correctly applied boolean transform.");
} else {
    console.log("FAILURE: processRow failed to apply boolean transform.");
}

export { };
