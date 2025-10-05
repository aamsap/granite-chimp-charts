// Dashboard endpoint for Vercel serverless function
module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { fileId, analysis, kpis, visualizations, userPlan, customTitle, customDescription, theme } = req.body;

    if (!fileId || !analysis) {
      return res.status(400).json({ 
        error: 'Required data missing',
        message: 'Please provide fileId and analysis data to generate dashboard' 
      });
    }

    // Generate dashboard ID
    const dashboardId = `dashboard_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Mock dashboard generation
    const dashboard = {
      id: dashboardId,
      title: customTitle || 'Dashboard - Data Analysis',
      description: customDescription || 'AI-powered analysis of your data',
      createdAt: new Date().toISOString(),
      fileId: fileId,
      analysis: analysis,
      kpis: kpis || [],
      visualizations: visualizations || [],
      userPlan: userPlan || 'free',
      theme: theme || 'default',
      status: 'completed',
      rawData: [
        { Date: '2024-01-01', Revenue: 1000, Quantity: 10, Product: 'A' },
        { Date: '2024-01-02', Revenue: 1500, Quantity: 15, Product: 'B' },
        { Date: '2024-01-03', Revenue: 2000, Quantity: 20, Product: 'A' },
        { Date: '2024-01-04', Revenue: 1200, Quantity: 12, Product: 'C' },
        { Date: '2024-01-05', Revenue: 1800, Quantity: 18, Product: 'B' },
        { Date: '2024-01-06', Revenue: 2200, Quantity: 22, Product: 'A' },
        { Date: '2024-01-07', Revenue: 1600, Quantity: 16, Product: 'B' },
        { Date: '2024-01-08', Revenue: 1900, Quantity: 19, Product: 'C' },
        { Date: '2024-01-09', Revenue: 2100, Quantity: 21, Product: 'A' },
        { Date: '2024-01-10', Revenue: 1400, Quantity: 14, Product: 'B' },
        { Date: '2024-01-11', Revenue: 2300, Quantity: 23, Product: 'A' },
        { Date: '2024-01-12', Revenue: 1700, Quantity: 17, Product: 'C' },
        { Date: '2024-01-13', Revenue: 2000, Quantity: 20, Product: 'A' },
        { Date: '2024-01-14', Revenue: 1500, Quantity: 15, Product: 'B' },
        { Date: '2024-01-15', Revenue: 1800, Quantity: 18, Product: 'A' }
      ]
    };

    res.status(200).json({
      success: true,
      data: {
        dashboard: dashboard
      },
      dashboard: dashboard,
      message: 'Dashboard generated successfully'
    });

  } catch (error) {
    console.error('Dashboard generation error:', error);
    res.status(500).json({ 
      error: 'Dashboard generation failed',
      message: error.message 
    });
  }
};
