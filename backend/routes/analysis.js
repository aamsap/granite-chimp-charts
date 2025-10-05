import express from 'express';
import { analyzeDataWithGranite, getKPISuggestions, getVisualizationRecommendations } from '../services/graniteService.js';
import { parseFileData } from '../services/fileService.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { asyncHandler } from '../middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Analyze uploaded data with Granite AI
router.post('/analyze', asyncHandler(async (req, res) => {
    const { fileId, userPlan = 'free' } = req.body;

    if (!fileId) {
        return res.status(400).json({
            success: false,
            error: 'File ID required',
            message: 'Please provide a valid file ID'
        });
    }

    // Get file path
    const filePath = path.join(__dirname, '../uploads', fileId);

    // Parse file data
    const fileData = await parseFileData(filePath);

    // Analyze with Granite AI
    const analysisResult = await analyzeDataWithGranite(fileData, userPlan);

    res.json({
        success: true,
        message: 'Data analysis completed successfully',
        data: {
            fileId,
            analysis: analysisResult,
            timestamp: new Date().toISOString()
        }
    });
}));

// Get suggested KPIs for the data
router.post('/kpis', asyncHandler(async (req, res) => {
    const { fileId, userPlan = 'free' } = req.body;

    if (!fileId) {
        return res.status(400).json({
            success: false,
            error: 'File ID required',
            message: 'Please provide a valid file ID'
        });
    }

    const filePath = path.join(__dirname, '../uploads', fileId);
    const fileData = await parseFileData(filePath);

    // Get KPI suggestions from Granite AI
    const kpiSuggestions = await getKPISuggestions(fileData, userPlan);

    res.json({
        success: true,
        message: 'KPI suggestions generated successfully',
        data: {
            fileId,
            kpis: kpiSuggestions,
            timestamp: new Date().toISOString()
        }
    });
}));

// Get visualization recommendations
router.post('/visualizations', asyncHandler(async (req, res) => {
    const { fileId, kpis, userPlan = 'free' } = req.body;

    if (!fileId || !kpis) {
        return res.status(400).json({
            success: false,
            error: 'File ID and KPIs required',
            message: 'Please provide a valid file ID and KPI data'
        });
    }

    const filePath = path.join(__dirname, '../uploads', fileId);
    const fileData = await parseFileData(filePath);

    // Get visualization recommendations from Granite AI
    const visualizationRecommendations = await getVisualizationRecommendations(
        fileData,
        kpis,
        userPlan
    );

    res.json({
        success: true,
        message: 'Visualization recommendations generated successfully',
        data: {
            fileId,
            visualizations: visualizationRecommendations,
            timestamp: new Date().toISOString()
        }
    });
}));

export default router;