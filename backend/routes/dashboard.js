import express from 'express';
import { generateDashboard } from '../services/dashboardService.js';
import { parseFileData } from '../services/fileService.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Generate dashboard from analyzed data
router.post('/generate', async (req, res) => {
    try {
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

    } catch (error) {
        console.error('Dashboard generation error:', error);
        res.status(500).json({
            error: 'Dashboard generation failed',
            message: error.message
        });
    }
});

// Get dashboard template
router.get('/template/:templateId', async (req, res) => {
    try {
        const { templateId } = req.params;
        const { userPlan = 'free' } = req.query;

        const template = await getDashboardTemplate(templateId, userPlan);

        res.json({
            success: true,
            data: template
        });

    } catch (error) {
        console.error('Template error:', error);
        res.status(500).json({
            error: 'Failed to get template',
            message: error.message
        });
    }
});

// Save dashboard configuration
router.post('/save', async (req, res) => {
    try {
        const {
            dashboardId,
            configuration,
            userPlan = 'free'
        } = req.body;

        if (!dashboardId || !configuration) {
            return res.status(400).json({
                error: 'Missing required data',
                message: 'Dashboard ID and configuration are required'
            });
        }

        // Save dashboard configuration (in a real app, this would go to a database)
        const savedConfig = await saveDashboardConfiguration(dashboardId, configuration, userPlan);

        res.json({
            success: true,
            message: 'Dashboard configuration saved successfully',
            data: savedConfig
        });

    } catch (error) {
        console.error('Save dashboard error:', error);
        res.status(500).json({
            error: 'Failed to save dashboard',
            message: error.message
        });
    }
});

export default router;
