/* eslint-disable @typescript-eslint/no-explicit-any */
import * as XLSX from 'xlsx';

export interface ParsedData {
    headers: string[];
    data: any[];
}

export const parseFile = async (file: File): Promise<ParsedData> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const data = e.target?.result;
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];

                // Parse data to JSON
                const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

                if (!jsonData || jsonData.length === 0) {
                    resolve({ headers: [], data: [] });
                    return;
                }

                const headers = jsonData[0] as string[];
                const rows = jsonData.slice(1);

                // Create array of objects based on headers
                const structuredData = rows.map((row: any) => {
                    const obj: any = {};
                    headers.forEach((header, index) => {
                        obj[header] = row[index];
                    });
                    return obj;
                });

                resolve({ headers, data: structuredData });
            } catch (error) {
                reject(error);
            }
        };

        reader.onerror = (error) => reject(error);
        reader.readAsArrayBuffer(file);
    });
};
