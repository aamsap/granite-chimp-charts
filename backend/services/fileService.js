import fs from 'fs/promises';
import csv from 'csv-parser';
import XLSX from 'xlsx';
import path from 'path';

/**
 * Validate file format and structure
 * @param {string} filePath - Path to the uploaded file
 * @returns {Object} Validation result
 */
export async function validateFile(filePath) {
    try {
        const ext = path.extname(filePath).toLowerCase();

        if (!['.csv', '.xls', '.xlsx'].includes(ext)) {
            return {
                isValid: false,
                message: 'Invalid file extension. Only CSV, XLS, and XLSX files are allowed.',
                details: { allowedExtensions: ['.csv', '.xls', '.xlsx'] }
            };
        }

        // Check file size
        const stats = await fs.stat(filePath);
        const fileSizeInMB = stats.size / (1024 * 1024);

        if (fileSizeInMB > 10) {
            return {
                isValid: false,
                message: 'File size too large. Maximum size is 10MB.',
                details: { maxSize: '10MB', currentSize: `${fileSizeInMB.toFixed(2)}MB` }
            };
        }

        // Parse and validate structure
        const data = await parseFileData(filePath);

        if (!data.headers || data.headers.length === 0) {
            return {
                isValid: false,
                message: 'No headers found. Please ensure the first row contains column headers.',
                details: { issue: 'missing_headers' }
            };
        }

        if (data.rows.length === 0) {
            return {
                isValid: false,
                message: 'No data rows found. Please ensure the file contains data.',
                details: { issue: 'no_data' }
            };
        }

        // Check for empty headers
        const emptyHeaders = data.headers.filter(header => !header || header.trim() === '');
        if (emptyHeaders.length > 0) {
            return {
                isValid: false,
                message: 'Empty column headers found. Please ensure all columns have names.',
                details: { issue: 'empty_headers', emptyHeaderCount: emptyHeaders.length }
            };
        }

        // Check for duplicate headers
        const duplicateHeaders = data.headers.filter((header, index) =>
            data.headers.indexOf(header) !== index
        );
        if (duplicateHeaders.length > 0) {
            return {
                isValid: false,
                message: 'Duplicate column headers found. Please ensure all column names are unique.',
                details: { issue: 'duplicate_headers', duplicates: [...new Set(duplicateHeaders)] }
            };
        }

        return {
            isValid: true,
            message: 'File validation successful',
            details: {
                headers: data.headers.length,
                rows: data.rows.length,
                columns: data.headers
            }
        };

    } catch (error) {
        return {
            isValid: false,
            message: 'File validation failed',
            details: { error: error.message }
        };
    }
}

/**
 * Parse file data based on file type
 * @param {string} filePath - Path to the file
 * @returns {Object} Parsed data with headers and rows
 */
export async function parseFileData(filePath) {
    const ext = path.extname(filePath).toLowerCase();

    if (ext === '.csv') {
        return await parseCSV(filePath);
    } else if (['.xls', '.xlsx'].includes(ext)) {
        return await parseExcel(filePath);
    } else {
        throw new Error('Unsupported file format');
    }
}

/**
 * Parse CSV file
 * @param {string} filePath - Path to CSV file
 * @returns {Object} Parsed data
 */
async function parseCSV(filePath) {
    return new Promise((resolve, reject) => {
        const results = [];
        const headers = [];
        let isFirstRow = true;

        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (data) => {
                if (isFirstRow) {
                    headers.push(...Object.keys(data));
                    isFirstRow = false;
                }
                results.push(data);
            })
            .on('end', () => {
                resolve({
                    headers,
                    rows: results
                });
            })
            .on('error', (error) => {
                reject(error);
            });
    });
}

/**
 * Parse Excel file
 * @param {string} filePath - Path to Excel file
 * @returns {Object} Parsed data
 */
async function parseExcel(filePath) {
    try {
        const workbook = XLSX.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        if (jsonData.length === 0) {
            throw new Error('Empty Excel file');
        }

        const headers = jsonData[0];
        const rows = jsonData.slice(1).map(row => {
            const obj = {};
            headers.forEach((header, index) => {
                obj[header] = row[index] || '';
            });
            return obj;
        });

        return {
            headers,
            rows
        };
    } catch (error) {
        throw new Error(`Failed to parse Excel file: ${error.message}`);
    }
}

/**
 * Get file statistics
 * @param {string} filePath - Path to the file
 * @returns {Object} File statistics
 */
export async function getFileStats(filePath) {
    try {
        const data = await parseFileData(filePath);
        const stats = await fs.stat(filePath);

        return {
            fileName: path.basename(filePath),
            fileSize: stats.size,
            fileSizeFormatted: formatFileSize(stats.size),
            rowCount: data.rows.length,
            columnCount: data.headers.length,
            headers: data.headers,
            lastModified: stats.mtime
        };
    } catch (error) {
        throw new Error(`Failed to get file stats: ${error.message}`);
    }
}

/**
 * Format file size in human readable format
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size
 */
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
