import puppeteer from 'puppeteer';
import fs from 'fs/promises';
import path from 'path';

/**
 * Generate PDF from dashboard data
 * @param {Object} dashboard - Dashboard data
 * @param {Object} options - PDF generation options
 * @returns {Object} PDF generation result
 */
export async function generatePDF(dashboard, options = {}) {
    try {
        const {
            format = 'A4',
            orientation = 'portrait',
            margin = { top: '20mm', right: '20mm', bottom: '20mm', left: '20mm' },
            displayHeaderFooter = true,
            headerTemplate = '',
            footerTemplate = '',
            printBackground = true
        } = options;

        // Create PDFs directory if it doesn't exist
        const pdfDir = path.join(process.cwd(), 'pdfs');
        await fs.mkdir(pdfDir, { recursive: true });

        // Generate HTML content for the dashboard
        const htmlContent = generateDashboardHTML(dashboard);

        // Generate filename
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `dashboard_${dashboard.id}_${timestamp}.pdf`;
        const filepath = path.join(pdfDir, filename);

        // Launch Puppeteer
        const browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();

        // Set content
        await page.setContent(htmlContent, {
            waitUntil: 'networkidle0',
            timeout: 30000
        });

        // Generate PDF
        const pdfBuffer = await page.pdf({
            path: filepath,
            format,
            orientation,
            margin,
            displayHeaderFooter,
            headerTemplate: headerTemplate || generateHeaderTemplate(dashboard),
            footerTemplate: footerTemplate || generateFooterTemplate(dashboard),
            printBackground
        });

        await browser.close();

        // Get file stats
        const stats = await fs.stat(filepath);
        const fileSize = stats.size;

        return {
            success: true,
            filename,
            filepath,
            url: `/api/pdf/download/${filename}`,
            size: fileSize,
            sizeFormatted: formatFileSize(fileSize)
        };

    } catch (error) {
        throw new Error(`PDF generation failed: ${error.message}`);
    }
}

/**
 * Generate HTML content for dashboard
 * @param {Object} dashboard - Dashboard data
 * @returns {string} HTML content
 */
function generateDashboardHTML(dashboard) {
    const { title, description, kpis, visualizations, metadata } = dashboard;

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <style>
            ${getPDFStyles()}
        </style>
    </head>
    <body>
        <div class="dashboard">
            <header class="dashboard-header">
                <h1>${title}</h1>
                <p class="description">${description}</p>
                <div class="metadata">
                    <span>Generated: ${new Date(metadata.generatedAt).toLocaleDateString()}</span>
                    <span>Data: ${metadata.dataSource.rowCount} rows, ${metadata.dataSource.columnCount} columns</span>
                </div>
            </header>

            ${kpis.length > 0 ? generateKPIsSection(kpis) : ''}
            
            ${visualizations.length > 0 ? generateVisualizationsSection(visualizations) : ''}
            
            ${metadata.analysis.insights.length > 0 ? generateInsightsSection(metadata.analysis.insights) : ''}
        </div>
    </body>
    </html>
  `;
}

/**
 * Generate KPIs section HTML
 * @param {Array} kpis - KPIs data
 * @returns {string} HTML content
 */
function generateKPIsSection(kpis) {
    return `
    <section class="kpis-section">
        <h2>Key Performance Indicators</h2>
        <div class="kpis-grid">
            ${kpis.map(kpi => `
                <div class="kpi-card">
                    <h3>${kpi.name}</h3>
                    <p class="kpi-description">${kpi.description}</p>
                    <div class="kpi-meta">
                        <span class="kpi-type">${kpi.type}</span>
                        <span class="kpi-category">${kpi.category}</span>
                    </div>
                </div>
            `).join('')}
        </div>
    </section>
  `;
}

/**
 * Generate visualizations section HTML
 * @param {Array} visualizations - Visualizations data
 * @returns {string} HTML content
 */
function generateVisualizationsSection(visualizations) {
    return `
    <section class="visualizations-section">
        <h2>Data Visualizations</h2>
        <div class="visualizations-grid">
            ${visualizations.map(viz => `
                <div class="visualization-card">
                    <h3>${viz.title}</h3>
                    <p class="viz-description">${viz.description}</p>
                    <div class="viz-meta">
                        <span class="viz-type">${viz.type}</span>
                        <span class="viz-axes">${viz.xAxis} vs ${viz.yAxis}</span>
                    </div>
                    <div class="viz-placeholder">
                        [${viz.type.toUpperCase()} CHART]
                    </div>
                </div>
            `).join('')}
        </div>
    </section>
  `;
}

/**
 * Generate insights section HTML
 * @param {Array} insights - Insights data
 * @returns {string} HTML content
 */
function generateInsightsSection(insights) {
    return `
    <section class="insights-section">
        <h2>Key Insights</h2>
        <div class="insights-list">
            ${insights.map(insight => `
                <div class="insight-item">
                    <h3>${insight.title}</h3>
                    <p>${insight.description}</p>
                    <div class="insight-confidence">
                        Confidence: ${Math.round(insight.confidence * 100)}%
                    </div>
                </div>
            `).join('')}
        </div>
    </section>
  `;
}

/**
 * Get CSS styles for PDF
 * @returns {string} CSS styles
 */
function getPDFStyles() {
    return `
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        line-height: 1.6;
        color: #333;
        background: #fff;
    }

    .dashboard {
        max-width: 100%;
        margin: 0 auto;
        padding: 20px;
    }

    .dashboard-header {
        text-align: center;
        margin-bottom: 30px;
        border-bottom: 2px solid #e0e0e0;
        padding-bottom: 20px;
    }

    .dashboard-header h1 {
        font-size: 28px;
        color: #2c3e50;
        margin-bottom: 10px;
    }

    .description {
        font-size: 16px;
        color: #666;
        margin-bottom: 15px;
    }

    .metadata {
        font-size: 12px;
        color: #888;
    }

    .metadata span {
        margin-right: 20px;
    }

    section {
        margin-bottom: 30px;
        page-break-inside: avoid;
    }

    h2 {
        font-size: 22px;
        color: #34495e;
        margin-bottom: 15px;
        border-bottom: 1px solid #bdc3c7;
        padding-bottom: 5px;
    }

    .kpis-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 15px;
        margin-bottom: 20px;
    }

    .kpi-card {
        border: 1px solid #ddd;
        border-radius: 8px;
        padding: 15px;
        background: #f8f9fa;
    }

    .kpi-card h3 {
        font-size: 16px;
        color: #2c3e50;
        margin-bottom: 8px;
    }

    .kpi-description {
        font-size: 14px;
        color: #666;
        margin-bottom: 10px;
    }

    .kpi-meta {
        font-size: 12px;
        color: #888;
    }

    .kpi-meta span {
        margin-right: 10px;
        padding: 2px 6px;
        background: #e9ecef;
        border-radius: 4px;
    }

    .visualizations-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 20px;
    }

    .visualization-card {
        border: 1px solid #ddd;
        border-radius: 8px;
        padding: 20px;
        background: #fff;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .visualization-card h3 {
        font-size: 18px;
        color: #2c3e50;
        margin-bottom: 10px;
    }

    .viz-description {
        font-size: 14px;
        color: #666;
        margin-bottom: 15px;
    }

    .viz-meta {
        font-size: 12px;
        color: #888;
        margin-bottom: 15px;
    }

    .viz-meta span {
        margin-right: 10px;
        padding: 2px 6px;
        background: #e3f2fd;
        border-radius: 4px;
    }

    .viz-placeholder {
        height: 200px;
        border: 2px dashed #ccc;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        color: #666;
        background: #f5f5f5;
    }

    .insights-list {
        display: grid;
        gap: 15px;
    }

    .insight-item {
        border-left: 4px solid #3498db;
        padding: 15px;
        background: #f8f9fa;
        border-radius: 0 8px 8px 0;
    }

    .insight-item h3 {
        font-size: 16px;
        color: #2c3e50;
        margin-bottom: 8px;
    }

    .insight-item p {
        font-size: 14px;
        color: #666;
        margin-bottom: 10px;
    }

    .insight-confidence {
        font-size: 12px;
        color: #27ae60;
        font-weight: bold;
    }

    @media print {
        .dashboard {
            padding: 0;
        }
        
        section {
            page-break-inside: avoid;
        }
    }
  `;
}

/**
 * Generate header template for PDF
 * @param {Object} dashboard - Dashboard data
 * @returns {string} Header template
 */
function generateHeaderTemplate(dashboard) {
    return `
    <div style="font-size: 10px; text-align: center; width: 100%; color: #666;">
      ${dashboard.title} - Generated by Chimp Chart
    </div>
  `;
}

/**
 * Generate footer template for PDF
 * @param {Object} dashboard - Dashboard data
 * @returns {string} Footer template
 */
function generateFooterTemplate(dashboard) {
    return `
    <div style="font-size: 10px; text-align: center; width: 100%; color: #666;">
      Page <span class="pageNumber"></span> of <span class="totalPages"></span> | 
      Generated on ${new Date().toLocaleDateString()}
    </div>
  `;
}

/**
 * Get PDF templates
 * @param {string} userPlan - User plan
 * @returns {Array} PDF templates
 */
export async function getPDFTemplates(userPlan = 'free') {
    const templates = [
        {
            id: 'standard',
            name: 'Standard Report',
            description: 'Clean, professional layout with KPIs and charts',
            availableFor: ['free', 'pro']
        },
        {
            id: 'executive',
            name: 'Executive Summary',
            description: 'High-level overview with key insights and recommendations',
            availableFor: ['pro']
        },
        {
            id: 'detailed',
            name: 'Detailed Analysis',
            description: 'Comprehensive report with all data points and visualizations',
            availableFor: ['pro']
        }
    ];

    return templates.filter(template =>
        template.availableFor.includes(userPlan)
    );
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
