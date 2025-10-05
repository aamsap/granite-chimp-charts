import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const REPLICATE_API_URL = process.env.REPLICATE_API_URL || 'https://api.replicate.com/v1';
const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;
const GRANITE_MODEL = process.env.GRANITE_MODEL || 'ibm-granite/granite-3.3-8b-instruct';

/**
 * Analyze data with Granite AI
 * @param {Object} fileData - Parsed file data
 * @param {string} userPlan - User plan (free/pro)
 * @returns {Object} Analysis result
 */
export async function analyzeDataWithGranite(fileData, userPlan = 'free') {
    try {
        // Prepare data for analysis
        const limitedRows = fileData.rows.slice(0, userPlan === 'free' ? 1000 : -1);
        const sampleData = limitedRows.slice(0, 10); // First 10 rows for analysis

        // Create prompt for Granite model
        const prompt = createAnalysisPrompt(fileData.headers, sampleData, userPlan);

        // Get model version first
        console.log('🔍 Getting model info...');
        console.log('Model:', GRANITE_MODEL);
        console.log('Token:', REPLICATE_API_TOKEN ? `${REPLICATE_API_TOKEN.substring(0, 10)}...` : 'NOT SET');

        const modelResponse = await axios.get(`${REPLICATE_API_URL}/models/${GRANITE_MODEL}`, {
            headers: {
                'Authorization': `Token ${REPLICATE_API_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });

        const versionId = modelResponse.data.latest_version.id;

        // Replicate API payload
        const payload = {
            version: versionId,
            input: {
                prompt: prompt,
                max_new_tokens: 2000,
                temperature: 0.3,
                top_p: 0.9,
                repetition_penalty: 1.1
            }
        };

        // Start prediction
        const prediction = await axios.post(`${REPLICATE_API_URL}/predictions`, payload, {
            headers: {
                'Authorization': `Token ${REPLICATE_API_TOKEN}`,
                'Content-Type': 'application/json'
            },
            timeout: 30000
        });

        const predictionId = prediction.data.id;

        // Poll for completion
        let result = await pollPrediction(predictionId);

        // Parse the result
        return parseAnalysisResult(result, fileData, userPlan);

    } catch (error) {
        console.error('Replicate API Error:', error.response?.data || error.message);

        // Fallback to mock analysis if API is not available
        return generateMockAnalysis(fileData, userPlan);
    }
}

/**
 * Create analysis prompt for Granite model
 * @param {Array} headers - Column headers
 * @param {Array} sampleData - Sample data rows
 * @param {string} userPlan - User plan
 * @returns {string} Formatted prompt
 */
function createAnalysisPrompt(headers, sampleData, userPlan) {
    return `You are a data analyst AI specialized in creating business dashboards. Analyze the following data and provide structured recommendations.

DATA STRUCTURE:
Headers: ${headers.join(', ')}
Sample Data (first 10 rows):
${JSON.stringify(sampleData, null, 2)}

TASK: Create a comprehensive data analysis for dashboard generation.

VISUALIZATION SELECTION GUIDELINES:
- BAR CHART: Use for comparing categories, discrete data, or showing rankings
- LINE CHART: Use for trends over time, continuous data, or showing progression
- PIE CHART: Use for showing parts of a whole, percentages, or categorical distribution
- AREA CHART: Use for showing cumulative values over time or stacked data
- SCATTER CHART: Use for showing correlations between two numerical variables

REQUIREMENTS:
1. Identify the data type (financial, customer, operational, sales, etc.)
2. Suggest 3-6 relevant KPIs with descriptions (not all data needs many KPIs)
3. Recommend ONLY 2-4 MOST APPROPRIATE visualizations based on data characteristics
4. Generate a professional dashboard title and description
5. Provide confidence score (0-1)

IMPORTANT: Only recommend visualizations that make sense for the data. Don't force visualizations if the data doesn't support them.

OUTPUT FORMAT: Return a valid JSON object with this structure:
{
  "dataType": "string",
  "insights": [
    {
      "type": "string",
      "title": "string", 
      "description": "string",
      "confidence": 0.95
    }
  ],
  "kpis": [
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "type": "sum|average|count|max|min",
      "column": "string",
      "category": "financial|statistical|categorical"
    }
  ],
  "visualizations": [
    {
      "id": "string",
      "type": "bar|line|pie|scatter|area",
      "title": "string",
      "description": "string",
      "xAxis": "string",
      "yAxis": "string",
      "dataKey": "string (for pie charts)",
      "recommended": true
    }
  ],
  "dashboard": {
    "title": "string",
    "description": "string"
  },
  "confidence": 0.95
}

Focus on creating actionable insights and practical visualizations for business users. Only include visualizations that provide real value for the data.`;
}

/**
 * Poll Replicate prediction until completion
 * @param {string} predictionId - Prediction ID
 * @returns {string} Prediction result
 */
async function pollPrediction(predictionId) {
    const maxAttempts = 30; // 30 attempts
    const delay = 2000; // 2 seconds between attempts

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        try {
            const response = await axios.get(`${REPLICATE_API_URL}/predictions/${predictionId}`, {
                headers: {
                    'Authorization': `Token ${REPLICATE_API_TOKEN}`
                }
            });

            const status = response.data.status;

            if (status === 'succeeded') {
                return response.data.output;
            } else if (status === 'failed') {
                throw new Error(`Prediction failed: ${response.data.error}`);
            } else if (status === 'processing' || status === 'starting') {
                // Wait before next attempt
                await new Promise(resolve => setTimeout(resolve, delay));
                continue;
            }
        } catch (error) {
            if (attempt === maxAttempts - 1) {
                throw error;
            }
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }

    throw new Error('Prediction timeout');
}

/**
 * Parse analysis result from Granite model
 * @param {string} result - Raw result from model
 * @param {Object} fileData - Original file data
 * @param {string} userPlan - User plan
 * @returns {Object} Parsed analysis result
 */
function parseAnalysisResult(result, fileData, userPlan) {
    try {
        // Handle array result from Replicate
        let resultText = result;
        if (Array.isArray(result)) {
            resultText = result.join('\n');
        }

        // Try to parse JSON from the result first
        try {
            const cleanResult = resultText.replace(/```json\n?|\n?```/g, '').trim();
            const parsed = JSON.parse(cleanResult);

            return {
                dataType: parsed.dataType || detectDataType(fileData.headers, fileData.rows),
                insights: parsed.insights || generateMockInsights(fileData.headers, fileData.rows),
                kpis: filterKPIsByPlan(parsed.kpis || generateMockKPIs(fileData), userPlan),
                visualizations: filterVisualizationsByPlan(parsed.visualizations || generateMockVisualizations(fileData, []), userPlan),
                dashboard: parsed.dashboard || {
                    title: `Dashboard - ${parsed.dataType || 'Data Analysis'}`,
                    description: `Comprehensive analysis of your ${parsed.dataType || 'data'} with key insights and visualizations.`
                },
                confidence: parsed.confidence || 0.85,
                processingTime: Math.random() * 2000 + 1000,
                timestamp: new Date().toISOString()
            };
        } catch (jsonError) {
            // If JSON parsing fails, create analysis from text result
            console.log('Parsing text result from Granite AI...');

            const dataType = detectDataType(fileData.headers, fileData.rows);
            const insights = [{
                type: 'granite_analysis',
                title: 'AI Analysis Results',
                description: resultText,
                confidence: 0.9
            }];

            return {
                dataType: dataType,
                insights: insights,
                kpis: filterKPIsByPlan(generateMockKPIs(fileData), userPlan),
                visualizations: filterVisualizationsByPlan(generateMockVisualizations(fileData, []), userPlan),
                dashboard: {
                    title: `Dashboard - ${dataType} Analysis`,
                    description: `AI-powered analysis of your ${dataType} data with insights from Granite AI.`
                },
                confidence: 0.9,
                processingTime: Math.random() * 2000 + 1000,
                timestamp: new Date().toISOString(),
                rawResult: resultText
            };
        }
    } catch (error) {
        console.error('Failed to parse Granite result:', error);
        // Fallback to mock analysis
        return generateMockAnalysis(fileData, userPlan);
    }
}

/**
 * Filter KPIs based on user plan
 * @param {Array} kpis - Array of KPIs
 * @param {string} userPlan - User plan (free/pro)
 * @returns {Array} Filtered KPIs
 */
function filterKPIsByPlan(kpis, userPlan) {
    if (userPlan === 'free') {
        return kpis.slice(0, 5); // Free plan: max 5 KPIs
    }
    return kpis; // Pro plan: unlimited KPIs
}

/**
 * Filter visualizations based on user plan
 * @param {Array} visualizations - Array of visualizations
 * @param {string} userPlan - User plan (free/pro)
 * @returns {Array} Filtered visualizations
 */
function filterVisualizationsByPlan(visualizations, userPlan) {
    if (userPlan === 'free') {
        return visualizations.slice(0, 3); // Free plan: max 3 visualizations
    }
    return visualizations; // Pro plan: unlimited visualizations
}

/**
 * Get KPI suggestions from Granite AI
 * @param {Object} fileData - Parsed file data
 * @param {string} userPlan - User plan
 * @returns {Array} KPI suggestions
 */
export async function getKPISuggestions(fileData, userPlan = 'free') {
    try {
        // Use the main analysis function which includes KPI suggestions
        const analysis = await analyzeDataWithGranite(fileData, userPlan);
        return analysis.kpis;

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
        // Use the main analysis function which includes visualization recommendations
        const analysis = await analyzeDataWithGranite(fileData, userPlan);
        return analysis.visualizations;

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
