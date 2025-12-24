import { z } from 'zod';

// Basic transformations
export const transformations = {
    trim: (value: any) => (typeof value === 'string' ? value.trim() : value),
    lowercase: (value: any) => (typeof value === 'string' ? value.toLowerCase() : value),
    uppercase: (value: any) => (typeof value === 'string' ? value.toUpperCase() : value),
    number: (value: any) => {
        if (typeof value === 'number') return value;
        const num = Number(value);
        return isNaN(num) ? value : num;
    },
    boolean: (value: any) => {
        if (typeof value === 'boolean') return value;
        const s = String(value).toLowerCase();
        return s === 'true' || s === '1' || s === 'yes' || s === 'y';
    },
    date: (value: any) => {
        if (value instanceof Date) return value;
        const d = new Date(value);
        return isNaN(d.getTime()) ? value : d.toISOString().split('T')[0];
    },
    capitalize: (value: any) => {
        if (typeof value !== 'string' || !value) return value;
        return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
    },
    time: (value: any) => {
        const d = new Date(value);
        if (isNaN(d.getTime())) return value;
        return d.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }
};

// Validation schemas
export const schemas = {
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Phone number too short").max(15, "Phone number too long"), // Simplified
    date: z.coerce.date(),
    number: z.number().or(z.string().regex(/^\d+$/, "Must be a number")),
    required: z.string().min(1, "Required field")
};

export type ValidationRule = keyof typeof schemas;
export type TransformationType = keyof typeof transformations;

export interface ColumnConfig {
    column: string;
    validation?: ValidationRule;
    transformations?: TransformationType[];
}

export const processRow = (row: any, configs: ColumnConfig[]) => {
    const newRow = { ...row };
    const errors: Record<string, string> = {};

    configs.forEach(config => {
        let value = newRow[config.column];

        // Apply transformations
        if (config.transformations && config.transformations.length > 0) {
            config.transformations.forEach(t => {
                value = transformations[t](value);
            });
        }
        newRow[config.column] = value;

        // Apply validation
        if (config.validation) {
            const schema = schemas[config.validation];
            const result = schema.safeParse(value);
            if (!result.success) {
                // Cast to any to avoid TypeScript strictness issues with different ZodError generics
                errors[config.column] = (result.error as any).errors[0].message;
            }
        }
    });

    return { row: newRow, errors };
};
export type InferredType = 'string' | 'number' | 'boolean' | 'date' | 'email';

export const smartClean = (data: any[], headers: string[]) => {
    return data.map(row => {
        const newRow = { ...row };
        headers.forEach(header => {
            if (typeof newRow[header] === 'string') {
                // Trim whitespace and collapse multiple spaces to one
                newRow[header] = newRow[header].trim().replace(/\s+/g, ' ');
            }
        });
        return newRow;
    });
};

export const inferColumnTypes = (data: any[], headers: string[]): Record<string, InferredType> => {
    const types: Record<string, InferredType> = {};
    const sampleSize = Math.min(data.length, 50); // Check first 50 rows
    const sample = data.slice(0, sampleSize);

    headers.forEach(header => {
        let isNumber = true;
        let isBoolean = true;
        let isDate = true;
        let isEmail = true;
        let hasValue = false;

        for (const row of sample) {
            const value = row[header];
            if (value === null || value === undefined || value === '') continue;
            hasValue = true;

            // Check Number
            if (isNumber) {
                const num = Number(value);
                if (isNaN(num) || typeof value === 'boolean') isNumber = false;
            }

            // Check Boolean
            if (isBoolean) {
                const s = String(value).toLowerCase();
                if (!['true', 'false', '1', '0', 'yes', 'no', 'y', 'n'].includes(s)) isBoolean = false;
            }

            // Check Date
            if (isDate) {
                const d = new Date(value);
                if (isNaN(d.getTime()) || typeof value === 'number') isDate = false;
                // numbers can be valid dates (timestamps), but usually we want explicit dates. 
                // strict check: if it looks like a number, treat as number unless explicitly date format.
                if (/^\d+$/.test(String(value))) isDate = false;
            }

            // Check Email
            if (isEmail) {
                const s = String(value);
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)) isEmail = false;
            }
        }

        if (!hasValue) {
            types[header] = 'string'; // Default to string if empty
        } else if (isBoolean) {
            types[header] = 'boolean';
        } else if (isNumber) {
            types[header] = 'number';
        } else if (isDate) {
            types[header] = 'date';
        } else if (isEmail) {
            types[header] = 'email';
        } else {
            types[header] = 'string';
        }
    });

    return types;
};

export const suggestRules = (type: InferredType): { validation?: ValidationRule, transformation?: TransformationType } => {
    switch (type) {
        case 'email':
            return { validation: 'email', transformation: 'lowercase' };
        case 'date':
            return { validation: 'date' };
        case 'number':
            return { validation: 'number' };
        case 'boolean':
            return { transformation: 'boolean' };
        default:
            return {};
    }
};
