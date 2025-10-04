import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { validateFile, parseFileData } from '../services/fileService.js';
import { validateRequest } from '../middleware/validation.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads'));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = [
            'text/csv',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ];

        if (allowedTypes.includes(file.mimetype) ||
            file.originalname.endsWith('.csv') ||
            file.originalname.endsWith('.xls') ||
            file.originalname.endsWith('.xlsx')) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only CSV and Excel files are allowed.'), false);
        }
    }
});

// Upload and validate file
router.post('/', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                error: 'No file uploaded',
                message: 'Please upload a CSV or Excel file'
            });
        }

        const filePath = req.file.path;
        const fileName = req.file.originalname;

        // Validate file format and structure
        const validationResult = await validateFile(filePath);

        if (!validationResult.isValid) {
            return res.status(400).json({
                error: 'Invalid file format',
                message: validationResult.message,
                details: validationResult.details
            });
        }

        // Parse file data
        const fileData = await parseFileData(filePath);

        res.json({
            success: true,
            message: 'File uploaded and validated successfully',
            data: {
                fileName,
                filePath,
                headers: fileData.headers,
                rowCount: fileData.rows.length,
                columnCount: fileData.headers.length,
                preview: fileData.rows.slice(0, 5), // First 5 rows for preview
                fileId: req.file.filename
            }
        });

    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({
            error: 'File processing failed',
            message: error.message
        });
    }
});

// Get file preview
router.get('/preview/:fileId', async (req, res) => {
    try {
        const { fileId } = req.params;
        const filePath = path.join(__dirname, '../uploads', fileId);

        const fileData = await parseFileData(filePath);

        res.json({
            success: true,
            data: {
                headers: fileData.headers,
                preview: fileData.rows.slice(0, 10), // First 10 rows
                totalRows: fileData.rows.length
            }
        });

    } catch (error) {
        console.error('Preview error:', error);
        res.status(500).json({
            error: 'Failed to preview file',
            message: error.message
        });
    }
});

export default router;
