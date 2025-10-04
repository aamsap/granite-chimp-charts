import express from 'express';
import { generatePDF } from '../services/pdfService.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Generate PDF from dashboard
router.post('/generate', async (req, res) => {
    try {
        const {
            dashboard,
            options = {}
        } = req.body;

        if (!dashboard) {
            return res.status(400).json({
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

    } catch (error) {
        console.error('PDF generation error:', error);
        res.status(500).json({
            error: 'PDF generation failed',
            message: error.message
        });
    }
});

// Download PDF
router.get('/download/:filename', async (req, res) => {
    try {
        const { filename } = req.params;
        const pdfPath = path.join(__dirname, '../pdfs', filename);

        // Check if file exists
        const fs = await import('fs/promises');
        try {
            await fs.access(pdfPath);
        } catch (error) {
            return res.status(404).json({
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

    } catch (error) {
        console.error('PDF download error:', error);
        res.status(500).json({
            error: 'PDF download failed',
            message: error.message
        });
    }
});

// Get PDF templates
router.get('/templates', async (req, res) => {
    try {
        const { userPlan = 'free' } = req.query;

        const templates = await getPDFTemplates(userPlan);

        res.json({
            success: true,
            data: templates
        });

    } catch (error) {
        console.error('PDF templates error:', error);
        res.status(500).json({
            error: 'Failed to get PDF templates',
            message: error.message
        });
    }
});

export default router;
