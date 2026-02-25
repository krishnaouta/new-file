/* eslint-disable @typescript-eslint/no-explicit-any */
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
        const s = String(value).trim().toLowerCase();
        const res = (() => {
            if (typeof value === 'boolean') return value;
            if (s === 'true' || s === '1' || s === 'yes' || s === 'y' || s === 't') return true;
            if (s === 'false' || s === '0' || s === 'no' || s === 'n' || s === 'f') return false;
            return false;
        })();
        console.log(`[Boolean Debug] Input: "${value}" (${typeof value}), Processed: "${s}", Result: ${res}`);
        return res;
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
    },
    cleanNumber: (value: any) => {
        if (typeof value === 'number') return value;
        if (!value) return value;
        const s = String(value);
        // Remove everything that is not a digit, a minus sign, or a dot
        const cleaned = s.replace(/[^\d.-]/g, '');
        // Parse float to see if it's valid
        const num = parseFloat(cleaned);
        return isNaN(num) ? value : num;
    },
    cleanPercentage: (value: any) => {
        if (typeof value === 'number') return value;
        if (!value) return value;
        const s = String(value);
        // Remove % and comma
        const cleaned = s.replace(/[%]/g, '').replace(/,/g, '');
        const num = parseFloat(cleaned);
        // If it was "50%", do we want 50 or 0.5? Excel usually treats 50% as 0.5.
        // But human input "50" might mean 50%.
        // For now, let's just parse the number. If it was "50%", it becomes 50.
        return isNaN(num) ? value : num;
    },
    cleanPhone: (value: any) => {
        if (!value) return value;
        // Keep digits, +, -, (, ), and space
        const s = String(value);
        return s.replace(/[^\d+\-()\s]/g, '').trim();
    },
    cleanList: (value: any) => {
        if (Array.isArray(value)) return value;
        if (!value) return [];
        // Split by comma
        return String(value).split(',').map(s => s.trim()).filter(Boolean);
    }
};

// Validation schemas
export const schemas = {
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Phone number too short").max(15, "Phone number too long"),
    date: z.coerce.date(),
    number: z.number().or(z.string().regex(/^\d+$/, "Must be a number")),
    required: z.string().min(1, "Required field"),

    // Aliases for better UI matching
    currency: z.number().or(z.string().regex(/^-?\d+(\.\d+)?$/, "Must be a valid amount")),
    percentage: z.number().or(z.string().regex(/^-?\d+(\.\d+)?$/, "Must be a valid percentage")),
    int: z.number().int().or(z.string().regex(/^-?\d+$/, "Must be an integer")),
    float: z.number().or(z.string().regex(/^-?\d+(\.\d+)?$/, "Must be a valid number")),
    boolean: z.boolean().or(z.string().transform(val => val === 'true' || val === '1')),
    string: z.string(),
    list: z.array(z.string()).or(z.string()) // Allow array or string (which will be cleaned)
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

export const rulesFromInternalType = (type: string): { validation?: ValidationRule, transformation?: TransformationType, displayName?: string } => {
    const t = type.toLowerCase();

    if (t.includes('string') || t === 'text') return { validation: 'string', displayName: 'String' };
    if (t.includes('currency')) {
        return { validation: 'currency', transformation: 'cleanNumber', displayName: 'Currency' };
    }
    // "Number" handling: check for "numeric", "float", "decimal", "double", or just "number"
    if (t.includes('numeric') || t.includes('float') || t.includes('decimal') || t.includes('double') || t === 'number') {
        return { validation: 'float', transformation: 'cleanNumber', displayName: 'Number' };
    }
    if (t.includes('int')) {
        return { validation: 'int', transformation: 'cleanNumber', displayName: 'Integer' };
    }
    if (t.includes('percentage') || t.includes('%')) {
        return { validation: 'percentage', transformation: 'cleanPercentage', displayName: 'Percentage' };
    }
    if (t.includes('phone') || t.includes('mobile') || t.includes('fax')) {
        return { validation: 'phone', transformation: 'cleanPhone', displayName: 'Phone' };
    }
    if (t.includes('boolean') || t.includes('bool')) return { validation: 'boolean', transformation: 'boolean', displayName: 'Boolean' };
    if (t.includes('date') || t.includes('time')) return { validation: 'date', displayName: 'Date' };
    if (t.includes('list') || t.includes('array')) return { validation: 'list', transformation: 'cleanList', displayName: 'List' };

    // Default fallback
    return { displayName: type };
};
