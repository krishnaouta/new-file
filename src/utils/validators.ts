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

    // Bug 1 fix: empty/null values stay empty instead of silently becoming false
    boolean: (value: any) => {
        if (value === null || value === undefined || value === '') return value;
        if (typeof value === 'boolean') return value;
        const s = String(value).trim().toLowerCase();
        if (s === 'true' || s === '1' || s === 'yes' || s === 'y' || s === 't') return true;
        if (s === 'false' || s === '0' || s === 'no' || s === 'n' || s === 'f') return false;
        // Unrecognised value: return as-is so the validation schema can flag it
        return value;
    },

    // Bug 3 fix: handle Excel serial date numbers (days since 1899-12-30)
    date: (value: any) => {
        if (value === null || value === undefined || value === '') return value;
        if (value instanceof Date) return value.toISOString().split('T')[0];

        // Excel serial date: a plain integer like 45000
        if (typeof value === 'number' || /^\d{5}$/.test(String(value))) {
            const serial = Number(value);
            if (!isNaN(serial) && serial > 1000 && serial < 100000) {
                // Excel epoch: days since December 30, 1899
                const excelEpoch = new Date(1899, 11, 30);
                const d = new Date(excelEpoch.getTime() + serial * 86400000);
                if (!isNaN(d.getTime())) return d.toISOString().split('T')[0];
            }
        }

        const d = new Date(value);
        return isNaN(d.getTime()) ? value : d.toISOString().split('T')[0];
    },

    // Bug 8 fix: 'capitalize' now does proper Title Case (each word)
    // Kept as 'capitalize' for backwards compat with saved templates
    capitalize: (value: any) => {
        if (typeof value !== 'string' || !value) return value;
        return value
            .split(' ')
            .map(word => word.length > 0 ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() : word)
            .join(' ');
    },

    time: (value: any) => {
        const d = new Date(value);
        if (isNaN(d.getTime())) return value;
        return d.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    },

    // Bug 5 fix: correct regex character class — escape the dash to avoid range ambiguity
    cleanNumber: (value: any) => {
        if (typeof value === 'number') return value;
        if (!value) return value;
        const s = String(value);
        // Remove everything that is not a digit, a minus sign, or a decimal point
        const cleaned = s.replace(/[^\d.\-]/g, '');
        const num = parseFloat(cleaned);
        return isNaN(num) ? value : num;
    },

    cleanPercentage: (value: any) => {
        if (typeof value === 'number') return value;
        if (!value) return value;
        const s = String(value);
        const cleaned = s.replace(/[%,]/g, '');
        const num = parseFloat(cleaned);
        return isNaN(num) ? value : num;
    },

    cleanPhone: (value: any) => {
        if (!value) return value;
        const s = String(value);
        return s.replace(/[^\d+\-()\s]/g, '').trim();
    },

    cleanList: (value: any) => {
        if (Array.isArray(value)) return value;
        if (!value) return [];
        // Split on comma, semicolon, pipe, or tab
        return String(value).split(/[,;|\t]/).map(s => s.trim()).filter(Boolean);
    },

    // Remove HTML tags from a string value
    stripHtml: (value: any) => {
        if (typeof value !== 'string' || !value) return value;
        return value.replace(/<[^>]*>/g, '').trim();
    },

    // Convert blank, 'N/A', 'n/a', '-', 'null', 'none', 'undefined' to null
    nullifyEmpty: (value: any) => {
        if (value === null || value === undefined) return null;
        const s = String(value).trim().toLowerCase();
        if (s === '' || s === 'n/a' || s === 'na' || s === '-' || s === 'null' || s === 'none' || s === 'undefined') return null;
        return value;
    },

    // Remove commas from numbers like "1,234,567" → "1234567" (useful before number conversion)
    removeCommas: (value: any) => {
        if (typeof value === 'number') return value;
        if (!value) return value;
        return String(value).replace(/,/g, '');
    },

    // Collapse multiple whitespace characters (spaces, tabs, newlines) into a single space
    collapseWhitespace: (value: any) => {
        if (typeof value !== 'string') return value;
        return value.replace(/\s+/g, ' ').trim();
    }
};

// Validation schemas
export const schemas = {
    email: z.string().email("Invalid email address"),
    phone: z.string().min(7, "Phone number too short").max(20, "Phone number too long"),

    // Bug 6 note: z.coerce.date() accepts ISO strings produced by the date transformation
    date: z.coerce.date().refine(d => !isNaN(d.getTime()), { message: "Invalid date" }),

    // Bug 9 fix: number schema now accepts negative number strings
    number: z.number().or(z.string().regex(/^-?\d+(\.\d+)?$/, "Must be a number")),

    required: z.string().min(1, "Required field"),

    currency: z.number().or(z.string().regex(/^-?\d+(\.\d+)?$/, "Must be a valid amount")),
    percentage: z.number().or(z.string().regex(/^-?\d+(\.\d+)?$/, "Must be a valid percentage")),
    int: z.number().int().or(z.string().regex(/^-?\d+$/, "Must be an integer")),
    float: z.number().or(z.string().regex(/^-?\d+(\.\d+)?$/, "Must be a valid number")),

    // Bug 2 fix: boolean schema now uses z.preprocess instead of .transform inside .or()
    // so the coercion actually applies before type checking
    boolean: z.preprocess(
        (val) => {
            if (typeof val === 'boolean') return val;
            if (val === null || val === undefined || val === '') return val;
            const s = String(val).trim().toLowerCase();
            if (s === 'true' || s === '1' || s === 'yes' || s === 'y' || s === 't') return true;
            if (s === 'false' || s === '0' || s === 'no' || s === 'n' || s === 'f') return false;
            return val;
        },
        z.boolean({ message: "Must be a boolean (true/false, yes/no, 1/0)" })
    ),

    string: z.string(),
    list: z.array(z.string()).or(z.string())
};

export type ValidationRule = keyof typeof schemas;
export type TransformationType = keyof typeof transformations;

// Human-readable labels for each transformation key — used by the UI dropdown and applied chips
export const TRANSFORMATION_LABELS: Record<TransformationType, string> = {
    trim:               'Trim Whitespace',
    lowercase:          'Lowercase',
    uppercase:          'Uppercase',
    capitalize:         'Title Case',
    number:             'To Number',
    boolean:            'To Boolean',
    date:               'To Date',
    time:               'To Time',
    cleanNumber:        'Clean Number ($, commas)',
    cleanPercentage:    'Clean Percentage (%)',
    cleanPhone:         'Clean Phone Number',
    cleanList:          'Clean List (split to array)',
    stripHtml:          'Strip HTML Tags',
    nullifyEmpty:       'Nullify Empty / N/A',
    removeCommas:       'Remove Commas',
    collapseWhitespace: 'Collapse Whitespace',
};

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

        // Apply transformations first
        if (config.transformations && config.transformations.length > 0) {
            config.transformations.forEach(t => {
                value = transformations[t](value);
            });
        }
        newRow[config.column] = value;

        // Then validate the transformed value
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
                newRow[header] = newRow[header].trim().replace(/\s+/g, ' ');
            }
        });
        return newRow;
    });
};

export const inferColumnTypes = (data: any[], headers: string[]): Record<string, InferredType> => {
    const types: Record<string, InferredType> = {};
    const sampleSize = Math.min(data.length, 50);
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

            // Check Boolean — only pure boolean-like strings, NOT plain digits
            // Bug 7 fix: exclude values that are already identified as numbers
            if (isBoolean) {
                const s = String(value).toLowerCase();
                // Digits-only strings ("0"/"1") can be numbers — require word-form for boolean
                const isBoolWord = ['true', 'false', 'yes', 'no', 'y', 'n'].includes(s);
                const isBoolDigit = (s === '0' || s === '1') && !isNumber; // only if not already a number
                if (!isBoolWord && !isBoolDigit) isBoolean = false;
            }

            // Check Date
            if (isDate) {
                const d = new Date(value);
                if (isNaN(d.getTime()) || typeof value === 'number') isDate = false;
                if (/^\d+$/.test(String(value))) isDate = false;
            }

            // Check Email
            if (isEmail) {
                const s = String(value);
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)) isEmail = false;
            }
        }

        if (!hasValue) {
            types[header] = 'string';
        } else if (isNumber) {
            // Bug 7 fix: number takes priority over boolean (0/1 columns are numbers)
            types[header] = 'number';
        } else if (isBoolean) {
            types[header] = 'boolean';
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
            return { validation: 'date', transformation: 'date' };
        case 'number':
            return { validation: 'number', transformation: 'cleanNumber' };
        case 'boolean':
            return { validation: 'boolean', transformation: 'boolean' };
        default:
            return {};
    }
};

export const rulesFromInternalType = (type: string): { validation?: ValidationRule, transformation?: TransformationType, displayName?: string } => {
    const t = type.toLowerCase();

    if (t.includes('string') || t === 'text') return { validation: 'string', displayName: 'String' };

    // Bug 10 fix: email type was completely missing
    if (t.includes('email')) return { validation: 'email', transformation: 'lowercase', displayName: 'Email' };

    if (t.includes('currency')) {
        return { validation: 'currency', transformation: 'cleanNumber', displayName: 'Currency' };
    }
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
    if (t.includes('date') || t.includes('time')) return { validation: 'date', transformation: 'date', displayName: 'Date' };
    if (t.includes('list') || t.includes('array')) return { validation: 'list', transformation: 'cleanList', displayName: 'List' };

    // Default fallback
    return { displayName: type };
};
