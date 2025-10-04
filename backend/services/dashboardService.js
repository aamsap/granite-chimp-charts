import fs from 'fs/promises';
import path from 'path';

/**
 * Generate dashboard from analyzed data
 * @param {Object} params - Dashboard generation parameters
 * @returns {Object} Generated dashboard
 */
export async function generateDashboard({
    fileData,
    analysis,
    kpis = [],
    visualizations = [],
    userPlan = 'free',
    customTitle,
    customDescription,
    theme = 'default'
}) {
    try {
        const dashboardId = generateDashboardId();

        // Generate dashboard title and description
        const title = customTitle || generateDashboardTitle(fileData, analysis);
        const description = customDescription || generateDashboardDescription(fileData, analysis);

        // Filter KPIs and visualizations based on user plan
        const filteredKPIs = filterKPIsByPlan(kpis, userPlan);
        const filteredVisualizations = filterVisualizationsByPlan(visualizations, userPlan);

        // Generate dashboard layout
        const layout = generateDashboardLayout(filteredKPIs, filteredVisualizations, userPlan);

        // Create dashboard object
        const dashboard = {
            id: dashboardId,
            title,
            description,
            theme,
            userPlan,
            metadata: {
                generatedAt: new Date().toISOString(),
                dataSource: {
                    rowCount: fileData.rows.length,
                    columnCount: fileData.headers.length,
                    headers: fileData.headers
                },
                analysis: {
                    dataType: analysis.dataType,
                    confidence: analysis.confidence,
                    insights: analysis.insights || []
                }
            },
            layout,
            kpis: filteredKPIs,
            visualizations: filteredVisualizations,
            configuration: {
                allowCustomization: userPlan === 'pro',
                allowMultiplePages: userPlan === 'pro',
                allowThemeSelection: userPlan === 'pro',
                allowVisualizationSelection: userPlan === 'pro'
            }
        };

        return dashboard;

    } catch (error) {
        throw new Error(`Dashboard generation failed: ${error.message}`);
    }
}

/**
 * Generate unique dashboard ID
 * @returns {string} Dashboard ID
 */
function generateDashboardId() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `dashboard_${timestamp}_${random}`;
}

/**
 * Generate dashboard title based on data analysis
 * @param {Object} fileData - File data
 * @param {Object} analysis - Analysis result
 * @returns {string} Generated title
 */
function generateDashboardTitle(fileData, analysis) {
    const dataType = analysis.dataType || 'general';
    const rowCount = fileData.rows.length;

    const titles = {
        financial: `Financial Analytics Dashboard (${rowCount} records)`,
        customer_analytics: `Customer Analytics Dashboard (${rowCount} records)`,
        time_series: `Time Series Analytics Dashboard (${rowCount} records)`,
        general: `Data Analytics Dashboard (${rowCount} records)`
    };

    return titles[dataType] || titles.general;
}

/**
 * Generate dashboard description based on data analysis
 * @param {Object} fileData - File data
 * @param {Object} analysis - Analysis result
 * @returns {string} Generated description
 */
function generateDashboardDescription(fileData, analysis) {
    const dataType = analysis.dataType || 'general';
    const insights = analysis.insights || [];

    const descriptions = {
        financial: `Comprehensive financial analysis dashboard showing key metrics and trends from your financial data.`,
        customer_analytics: `Customer behavior and analytics dashboard providing insights into customer patterns and preferences.`,
        time_series: `Time-based analytics dashboard tracking trends and patterns over time.`,
        general: `Data analytics dashboard providing insights and visualizations from your dataset.`
    };

    let description = descriptions[dataType] || descriptions.general;

    if (insights.length > 0) {
        description += ` Key insights include: ${insights.slice(0, 2).map(i => i.title).join(', ')}.`;
    }

    return description;
}

/**
 * Filter KPIs based on user plan
 * @param {Array} kpis - All KPIs
 * @param {string} userPlan - User plan
 * @returns {Array} Filtered KPIs
 */
function filterKPIsByPlan(kpis, userPlan) {
    if (userPlan === 'pro') {
        return kpis; // Pro users get all KPIs
    }

    // Free users get limited KPIs
    return kpis.slice(0, 5);
}

/**
 * Filter visualizations based on user plan
 * @param {Array} visualizations - All visualizations
 * @param {string} userPlan - User plan
 * @returns {Array} Filtered visualizations
 */
function filterVisualizationsByPlan(visualizations, userPlan) {
    if (userPlan === 'pro') {
        return visualizations; // Pro users get all visualizations
    }

    // Free users get only recommended visualizations
    return visualizations.filter(viz => viz.recommended).slice(0, 3);
}

/**
 * Generate dashboard layout
 * @param {Array} kpis - KPIs to display
 * @param {Array} visualizations - Visualizations to display
 * @param {string} userPlan - User plan
 * @returns {Object} Dashboard layout
 */
function generateDashboardLayout(kpis, visualizations, userPlan) {
    const layout = {
        type: 'grid',
        columns: userPlan === 'pro' ? 12 : 6,
        rows: [],
        spacing: 16
    };

    // Add KPI cards row
    if (kpis.length > 0) {
        const kpiRow = {
            id: 'kpi_row',
            type: 'kpi_cards',
            columns: Math.min(kpis.length, userPlan === 'pro' ? 4 : 3),
            items: kpis.map((kpi, index) => ({
                id: `kpi_${index}`,
                type: 'kpi_card',
                kpi: kpi,
                size: 'medium'
            }))
        };
        layout.rows.push(kpiRow);
    }

    // Add visualization rows
    visualizations.forEach((viz, index) => {
        const vizRow = {
            id: `viz_row_${index}`,
            type: 'visualization',
            columns: userPlan === 'pro' ? 6 : 12,
            items: [{
                id: `viz_${index}`,
                type: 'chart',
                visualization: viz,
                size: 'large'
            }]
        };
        layout.rows.push(vizRow);
    });

    return layout;
}

/**
 * Get dashboard template
 * @param {string} templateId - Template ID
 * @param {string} userPlan - User plan
 * @returns {Object} Dashboard template
 */
export async function getDashboardTemplate(templateId, userPlan = 'free') {
    const templates = {
        financial: {
            id: 'financial',
            name: 'Financial Dashboard',
            description: 'Template for financial data analysis',
            layout: {
                type: 'grid',
                columns: userPlan === 'pro' ? 12 : 6,
                rows: [
                    {
                        id: 'kpi_row',
                        type: 'kpi_cards',
                        columns: 4,
                        items: [
                            { id: 'revenue', type: 'kpi_card', size: 'medium' },
                            { id: 'profit', type: 'kpi_card', size: 'medium' },
                            { id: 'growth', type: 'kpi_card', size: 'medium' },
                            { id: 'margin', type: 'kpi_card', size: 'medium' }
                        ]
                    },
                    {
                        id: 'charts_row',
                        type: 'visualization',
                        columns: 12,
                        items: [
                            { id: 'revenue_chart', type: 'chart', size: 'large' },
                            { id: 'profit_chart', type: 'chart', size: 'large' }
                        ]
                    }
                ]
            },
            availableFor: ['free', 'pro']
        },
        customer: {
            id: 'customer',
            name: 'Customer Analytics',
            description: 'Template for customer data analysis',
            layout: {
                type: 'grid',
                columns: userPlan === 'pro' ? 12 : 6,
                rows: [
                    {
                        id: 'kpi_row',
                        type: 'kpi_cards',
                        columns: 3,
                        items: [
                            { id: 'total_customers', type: 'kpi_card', size: 'medium' },
                            { id: 'new_customers', type: 'kpi_card', size: 'medium' },
                            { id: 'retention_rate', type: 'kpi_card', size: 'medium' }
                        ]
                    },
                    {
                        id: 'charts_row',
                        type: 'visualization',
                        columns: 12,
                        items: [
                            { id: 'customer_segments', type: 'chart', size: 'large' }
                        ]
                    }
                ]
            },
            availableFor: ['pro'] // Only for pro users
        }
    };

    const template = templates[templateId];

    if (!template) {
        throw new Error(`Template ${templateId} not found`);
    }

    if (!template.availableFor.includes(userPlan)) {
        throw new Error(`Template ${templateId} not available for ${userPlan} plan`);
    }

    return template;
}

/**
 * Save dashboard configuration
 * @param {string} dashboardId - Dashboard ID
 * @param {Object} configuration - Dashboard configuration
 * @param {string} userPlan - User plan
 * @returns {Object} Saved configuration
 */
export async function saveDashboardConfiguration(dashboardId, configuration, userPlan) {
    try {
        // In a real application, this would save to a database
        // For now, we'll save to a JSON file
        const configDir = path.join(process.cwd(), 'configs');
        await fs.mkdir(configDir, { recursive: true });

        const configPath = path.join(configDir, `${dashboardId}.json`);
        const configData = {
            dashboardId,
            configuration,
            userPlan,
            savedAt: new Date().toISOString(),
            version: '1.0.0'
        };

        await fs.writeFile(configPath, JSON.stringify(configData, null, 2));

        return configData;

    } catch (error) {
        throw new Error(`Failed to save dashboard configuration: ${error.message}`);
    }
}
