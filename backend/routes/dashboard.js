import express from 'express';
import { generateDashboard } from '../services/dashboardService.js';
import { parseFileData } from '../services/fileService.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { asyncHandler } from '../middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Generate dashboard from analyzed data
router.post('/generate', asyncHandler(async (req, res) => {
    const {
        fileId,
        analysis,
        kpis,
        visualizations,
        userPlan = 'free',
        customTitle,
        customDescription,
        theme = 'default'
    } = req.body;

    if (!fileId || !analysis) {
        return res.status(400).json({
            success: false,
            error: 'Missing required data',
            message: 'File ID and analysis data are required'
        });
    }

    // Get file data
    const filePath = path.join(__dirname, '../uploads', fileId);
    const fileData = await parseFileData(filePath);

    // Generate dashboard
    const dashboard = await generateDashboard({
        fileData,
        analysis,
        kpis: kpis || [],
        visualizations: visualizations || [],
        userPlan,
        customTitle,
        customDescription,
        theme
    });

    res.json({
        success: true,
        message: 'Dashboard generated successfully',
        data: {
            dashboard,
            fileId,
            timestamp: new Date().toISOString()
        }
    });
}));

// Get dashboard template
router.get('/template/:templateId', asyncHandler(async (req, res) => {
    const { templateId } = req.params;
    const { userPlan = 'free' } = req.query;

    // Mock template for now
    const template = {
        id: templateId,
        name: 'Default Template',
        description: 'Default dashboard template',
        layout: {},
        userPlan
    };

    res.json({
        success: true,
        message: 'Template retrieved successfully',
        data: template
    });
}));

// Save dashboard configuration
router.post('/save', asyncHandler(async (req, res) => {
    const {
        dashboardId,
        configuration,
        userPlan = 'free'
    } = req.body;

    if (!dashboardId || !configuration) {
        return res.status(400).json({
            success: false,
            error: 'Missing required data',
            message: 'Dashboard ID and configuration are required'
        });
    }

    // Mock save for now
    const savedConfig = {
        id: dashboardId,
        configuration,
        userPlan,
        savedAt: new Date().toISOString()
    };

    res.json({
        success: true,
        message: 'Dashboard configuration saved successfully',
        data: savedConfig
    });
}));

export default router;