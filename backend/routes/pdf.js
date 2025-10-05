import express from 'express';
import { generatePDF } from '../services/pdfService.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { asyncHandler } from '../middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Generate PDF from dashboard
router.post('/generate', asyncHandler(async (req, res) => {
    const {
        dashboard,
        options = {}
    } = req.body;

    if (!dashboard) {
        return res.status(400).json({
            success: false,
            error: 'Dashboard data required',
            message: 'Please provide dashboard data to generate PDF'
        });
    }

    // Generate PDF
    const pdfResult = await generatePDF(dashboard, options);

    res.json({
        success: true,
        message: 'PDF generated successfully',
        data: {
            pdfUrl: pdfResult.url,
            filename: pdfResult.filename,
            size: pdfResult.size,
            timestamp: new Date().toISOString()
        }
    });
}));

// Download PDF
router.get('/download/:filename', asyncHandler(async (req, res) => {
    const { filename } = req.params;
    const pdfPath = path.join(__dirname, '../pdfs', filename);

    // Check if file exists
    const fs = await import('fs/promises');
    try {
        await fs.access(pdfPath);
    } catch (error) {
        return res.status(404).json({
            success: false,
            error: 'PDF not found',
            message: 'The requested PDF file does not exist'
        });
    }

    // Set headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    // Stream the PDF file
    const stream = await import('fs');
    const fileStream = stream.createReadStream(pdfPath);
    fileStream.pipe(res);
}));

// Get PDF templates
router.get('/templates', asyncHandler(async (req, res) => {
    const { userPlan = 'free' } = req.query;

    // Mock templates for now
    const templates = [
        {
            id: 'default',
            name: 'Default Template',
            description: 'Standard dashboard PDF template',
            userPlan: 'free'
        },
        {
            id: 'premium',
            name: 'Premium Template',
            description: 'Enhanced dashboard PDF template',
            userPlan: 'pro'
        }
    ];

    res.json({
        success: true,
        message: 'PDF templates retrieved successfully',
        data: templates
    });
}));

export default router;