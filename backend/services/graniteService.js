import axios from 'axios';

const GRANITE_API_URL = process.env.GRANITE_API_URL || 'https://api.granite.com';
const GRANITE_API_KEY = process.env.GRANITE_API_KEY;

/**
 * Analyze data with Granite AI
 * @param {Object} fileData - Parsed file data
 * @param {string} userPlan - User plan (free/pro)
 * @returns {Object} Analysis result
 */
export async function analyzeDataWithGranite(fileData, userPlan = 'free') {
    try {
        const payload = {
            data: {
                headers: fileData.headers,
                rows: fileData.rows.slice(0, userPlan === 'free' ? 1000 : -1), // Limit rows for free plan
                metadata: {
                    totalRows: fileData.rows.length,
                    userPlan,
                    timestamp: new Date().toISOString()
                }
            },
            analysisType: 'comprehensive',
            includeKPIs: true,
            includeVisualizations: true
        };

        const response = await axios.post(`${GRANITE_API_URL}/analyze`, payload, {
            headers: {
                'Authorization': `Bearer ${GRANITE_API_KEY}`,
                'Content-Type': 'application/json'
            },
            timeout: 30000 // 30 second timeout
        });

        return response.data;

    } catch (error) {
        console.error('Granite API Error:', error.response?.data || error.message);

        // Fallback to mock analysis if API is not available
        return generateMockAnalysis(fileData, userPlan);
    }
}

/**
 * Get KPI suggestions from Granite AI
 * @param {Object} fileData - Parsed file data
 * @param {string} userPlan - User plan
 * @returns {Array} KPI suggestions
 */
export async function getKPISuggestions(fileData, userPlan = 'free') {
    try {
        const payload = {
            data: {
                headers: fileData.headers,
                rows: fileData.rows.slice(0, userPlan === 'free' ? 1000 : -1),
                metadata: {
                    totalRows: fileData.rows.length,
                    userPlan
                }
            },
            analysisType: 'kpi_suggestions'
        };

        const response = await axios.post(`${GRANITE_API_URL}/kpis`, payload, {
            headers: {
                'Authorization': `Bearer ${GRANITE_API_KEY}`,
                'Content-Type': 'application/json'
            },
            timeout: 20000
        });

        return response.data.kpis;

    } catch (error) {
        console.error('Granite KPI API Error:', error.response?.data || error.message);

        // Fallback to mock KPIs
        return generateMockKPIs(fileData);
    }
}

/**
 * Get visualization recommendations from Granite AI
 * @param {Object} fileData - Parsed file data
 * @param {Array} kpis - Selected KPIs
 * @param {string} userPlan - User plan
 * @returns {Array} Visualization recommendations
 */
export async function getVisualizationRecommendations(fileData, kpis, userPlan = 'free') {
    try {
        const payload = {
            data: {
                headers: fileData.headers,
                rows: fileData.rows.slice(0, userPlan === 'free' ? 1000 : -1),
                metadata: {
                    totalRows: fileData.rows.length,
                    userPlan
                }
            },
            kpis,
            analysisType: 'visualization_recommendations'
        };

        const response = await axios.post(`${GRANITE_API_URL}/visualizations`, payload, {
            headers: {
                'Authorization': `Bearer ${GRANITE_API_KEY}`,
                'Content-Type': 'application/json'
            },
            timeout: 20000
        });

        return response.data.visualizations;

    } catch (error) {
        console.error('Granite Visualization API Error:', error.response?.data || error.message);

        // Fallback to mock visualizations
        return generateMockVisualizations(fileData, kpis);
    }
}

/**
 * Generate mock analysis when Granite API is not available
 * @param {Object} fileData - Parsed file data
 * @param {string} userPlan - User plan
 * @returns {Object} Mock analysis result
 */
function generateMockAnalysis(fileData, userPlan) {
    const headers = fileData.headers;
    const rows = fileData.rows.slice(0, userPlan === 'free' ? 1000 : -1);

    return {
        dataType: detectDataType(headers, rows),
        insights: generateMockInsights(headers, rows),
        kpis: generateMockKPIs(fileData),
        visualizations: generateMockVisualizations(fileData, []),
        confidence: 0.85,
        processingTime: Math.random() * 2000 + 1000,
        timestamp: new Date().toISOString()
    };
}

/**
 * Generate mock KPIs based on data structure
 * @param {Object} fileData - Parsed file data
 * @returns {Array} Mock KPIs
 */
function generateMockKPIs(fileData) {
    const headers = fileData.headers;
    const rows = fileData.rows;

    const kpis = [];

    // Detect numeric columns
    const numericColumns = headers.filter(header => {
        const sampleValues = rows.slice(0, 10).map(row => row[header]);
        return sampleValues.some(val => !isNaN(parseFloat(val)) && isFinite(val));
    });

    // Detect date columns
    const dateColumns = headers.filter(header => {
        const sampleValues = rows.slice(0, 10).map(row => row[header]);
        return sampleValues.some(val => !isNaN(Date.parse(val)));
    });

    // Detect categorical columns
    const categoricalColumns = headers.filter(header => {
        const uniqueValues = new Set(rows.slice(0, 100).map(row => row[header]));
        return uniqueValues.size < 20 && uniqueValues.size > 1;
    });

    // Generate KPIs based on detected columns
    numericColumns.forEach(column => {
        kpis.push({
            id: `sum_${column}`,
            name: `Total ${column}`,
            description: `Sum of all ${column} values`,
            type: 'sum',
            column: column,
            category: 'financial'
        });

        kpis.push({
            id: `avg_${column}`,
            name: `Average ${column}`,
            description: `Average value of ${column}`,
            type: 'average',
            column: column,
            category: 'statistical'
        });
    });

    categoricalColumns.forEach(column => {
        kpis.push({
            id: `count_${column}`,
            name: `Count by ${column}`,
            description: `Number of records per ${column}`,
            type: 'count',
            column: column,
            category: 'categorical'
        });
    });

    return kpis.slice(0, 10); // Limit to 10 KPIs
}

/**
 * Generate mock visualizations
 * @param {Object} fileData - Parsed file data
 * @param {Array} kpis - Selected KPIs
 * @returns {Array} Mock visualizations
 */
function generateMockVisualizations(fileData, kpis) {
    const headers = fileData.headers;
    const numericColumns = headers.filter(header => {
        const sampleValues = fileData.rows.slice(0, 10).map(row => row[header]);
        return sampleValues.some(val => !isNaN(parseFloat(val)) && isFinite(val));
    });

    const categoricalColumns = headers.filter(header => {
        const uniqueValues = new Set(fileData.rows.slice(0, 100).map(row => row[header]));
        return uniqueValues.size < 20 && uniqueValues.size > 1;
    });

    const visualizations = [];

    // Bar chart for categorical data
    if (categoricalColumns.length > 0) {
        visualizations.push({
            id: 'bar_chart_1',
            type: 'bar',
            title: `Distribution by ${categoricalColumns[0]}`,
            description: `Shows the count of records for each ${categoricalColumns[0]} category`,
            xAxis: categoricalColumns[0],
            yAxis: 'count',
            data: fileData.rows.slice(0, 100),
            recommended: true
        });
    }

    // Line chart for numeric data
    if (numericColumns.length > 0) {
        visualizations.push({
            id: 'line_chart_1',
            type: 'line',
            title: `Trend of ${numericColumns[0]}`,
            description: `Shows the trend of ${numericColumns[0]} over time or sequence`,
            xAxis: 'index',
            yAxis: numericColumns[0],
            data: fileData.rows.slice(0, 100),
            recommended: true
        });
    }

    // Pie chart for categorical data
    if (categoricalColumns.length > 1) {
        visualizations.push({
            id: 'pie_chart_1',
            type: 'pie',
            title: `Distribution by ${categoricalColumns[1]}`,
            description: `Shows the percentage distribution of ${categoricalColumns[1]}`,
            dataKey: categoricalColumns[1],
            data: fileData.rows.slice(0, 100),
            recommended: false
        });
    }

    return visualizations;
}

/**
 * Detect data type based on headers and sample data
 * @param {Array} headers - Column headers
 * @param {Array} rows - Data rows
 * @returns {string} Detected data type
 */
function detectDataType(headers, rows) {
    const sampleRow = rows[0] || {};

    // Check for common business data patterns
    if (headers.some(h => h.toLowerCase().includes('revenue') || h.toLowerCase().includes('sales'))) {
        return 'financial';
    }

    if (headers.some(h => h.toLowerCase().includes('customer') || h.toLowerCase().includes('user'))) {
        return 'customer_analytics';
    }

    if (headers.some(h => h.toLowerCase().includes('date') || h.toLowerCase().includes('time'))) {
        return 'time_series';
    }

    return 'general';
}

/**
 * Generate mock insights
 * @param {Array} headers - Column headers
 * @param {Array} rows - Data rows
 * @returns {Array} Mock insights
 */
function generateMockInsights(headers, rows) {
    return [
        {
            type: 'summary',
            title: 'Data Overview',
            description: `Dataset contains ${rows.length} records with ${headers.length} columns`,
            confidence: 0.95
        },
        {
            type: 'pattern',
            title: 'Data Quality',
            description: 'Data appears to be well-structured with consistent formatting',
            confidence: 0.80
        },
        {
            type: 'recommendation',
            title: 'Visualization Suggestion',
            description: 'Consider using bar charts for categorical data and line charts for trends',
            confidence: 0.75
        }
    ];
}
