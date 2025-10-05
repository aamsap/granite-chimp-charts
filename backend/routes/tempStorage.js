import express from 'express';
import fs from 'fs/promises';
import path from 'path';

const router = express.Router();

// Create temp directory if it doesn't exist
const TEMP_DIR = path.join(process.cwd(), 'temp');
const ensureTempDir = async () => {
    try {
        await fs.access(TEMP_DIR);
    } catch {
        await fs.mkdir(TEMP_DIR, { recursive: true });
    }
};

// Save dashboard data to temp file
router.post('/save', async (req, res) => {
    try {
        await ensureTempDir();

        const { fileId, dashboardData } = req.body;

        if (!fileId || !dashboardData) {
            return res.status(400).json({
                success: false,
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
    } catch (error) {
        console.error('❌ Error saving to temp storage:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to save dashboard to temp storage',
            error: error.message
        });
    }
});

// Get dashboard data from temp file
router.get('/get/:fileId', async (req, res) => {
    try {
        const { fileId } = req.params;
        const filePath = path.join(TEMP_DIR, `dashboard_${fileId}.json`);

        const data = await fs.readFile(filePath, 'utf8');
        const dashboardData = JSON.parse(data);

        console.log(`📥 Dashboard loaded from temp file: ${filePath}`);

        res.json({
            success: true,
            message: 'Dashboard loaded from temp storage',
            data: dashboardData
        });
    } catch (error) {
        console.error('❌ Error loading from temp storage:', error);
        res.status(404).json({
            success: false,
            message: 'Dashboard not found in temp storage',
            error: error.message
        });
    }
});

// List all temp dashboard files
router.get('/list', async (req, res) => {
    try {
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
    } catch (error) {
        console.error('❌ Error listing temp files:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to list temp files',
            error: error.message
        });
    }
});

// Delete temp dashboard file
router.delete('/delete/:fileId', async (req, res) => {
    try {
        const { fileId } = req.params;
        const filePath = path.join(TEMP_DIR, `dashboard_${fileId}.json`);

        await fs.unlink(filePath);

        console.log(`🗑️ Dashboard deleted from temp file: ${filePath}`);

        res.json({
            success: true,
            message: 'Dashboard deleted from temp storage',
            data: { fileId }
        });
    } catch (error) {
        console.error('❌ Error deleting temp file:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete dashboard from temp storage',
            error: error.message
        });
    }
});

// Clean up old temp files (older than 24 hours)
router.post('/cleanup', async (req, res) => {
    try {
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
    } catch (error) {
        console.error('❌ Error cleaning up temp files:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to clean up temp files',
            error: error.message
        });
    }
});

export default router;
