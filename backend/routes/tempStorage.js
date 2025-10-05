import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// Create temp directory if it doesn't exist
const TEMP_DIR = path.join(process.cwd(), 'backend', 'temp');
const ensureTempDir = async () => {
    try {
        await fs.access(TEMP_DIR);
    } catch {
        await fs.mkdir(TEMP_DIR, { recursive: true });
    }
};

// Save dashboard data to temp file
router.post('/save', asyncHandler(async (req, res) => {
    await ensureTempDir();

    const { fileId, dashboardData } = req.body;

    if (!fileId || !dashboardData) {
        return res.status(400).json({
            success: false,
            error: 'Missing required data',
            message: 'File ID and dashboard data are required'
        });
    }

    const filePath = path.join(TEMP_DIR, `dashboard_${fileId}.json`);
    await fs.writeFile(filePath, JSON.stringify(dashboardData, null, 2));

    console.log(`💾 Dashboard saved to temp file: ${filePath}`);

    res.json({
        success: true,
        message: 'Dashboard saved to temp storage',
        data: {
            fileId,
            filePath: filePath
        }
    });
}));

// Get dashboard data from temp file
router.get('/get/:fileId', asyncHandler(async (req, res) => {
    const { fileId } = req.params;
    const filePath = path.join(TEMP_DIR, `dashboard_${fileId}.json`);

    try {
        // Check if file exists
        await fs.access(filePath);
        
        const data = await fs.readFile(filePath, 'utf8');
        const dashboardData = JSON.parse(data);

        console.log(`📥 Dashboard loaded from temp file: ${filePath}`);

        res.json({
            success: true,
            message: 'Dashboard loaded from temp storage',
            data: dashboardData
        });
    } catch (error) {
        if (error.code === 'ENOENT') {
            console.log(`⚠️ Temp file not found: ${filePath}`);
            res.status(404).json({
                success: false,
                message: 'Dashboard data not found in temp storage',
                error: 'File not found'
            });
        } else {
            throw error;
        }
    }
}));

// List all temp dashboard files
router.get('/list', asyncHandler(async (req, res) => {
    await ensureTempDir();

    const files = await fs.readdir(TEMP_DIR);
    const dashboardFiles = files
        .filter(file => file.startsWith('dashboard_') && file.endsWith('.json'))
        .map(file => {
            const fileId = file.replace('dashboard_', '').replace('.json', '');
            return {
                fileId,
                fileName: file,
                filePath: path.join(TEMP_DIR, file)
            };
        });

    res.json({
        success: true,
        message: 'Temp dashboard files listed',
        data: {
            files: dashboardFiles,
            count: dashboardFiles.length
        }
    });
}));

// Delete temp dashboard file
router.delete('/delete/:fileId', asyncHandler(async (req, res) => {
    const { fileId } = req.params;
    const filePath = path.join(TEMP_DIR, `dashboard_${fileId}.json`);

    await fs.unlink(filePath);

    console.log(`🗑️ Dashboard deleted from temp file: ${filePath}`);

    res.json({
        success: true,
        message: 'Dashboard deleted from temp storage',
        data: { fileId }
    });
}));

// Clean up old temp files (older than 24 hours)
router.post('/cleanup', asyncHandler(async (req, res) => {
    await ensureTempDir();

    const files = await fs.readdir(TEMP_DIR);
    const now = Date.now();
    const oneDayAgo = now - (24 * 60 * 60 * 1000);

    let deletedCount = 0;

    for (const file of files) {
        if (file.startsWith('dashboard_') && file.endsWith('.json')) {
            const filePath = path.join(TEMP_DIR, file);
            const stats = await fs.stat(filePath);

            if (stats.mtime.getTime() < oneDayAgo) {
                await fs.unlink(filePath);
                deletedCount++;
                console.log(`🧹 Cleaned up old temp file: ${file}`);
            }
        }
    }

    res.json({
        success: true,
        message: `Cleaned up ${deletedCount} old temp files`,
        data: { deletedCount }
    });
}));

export default router;