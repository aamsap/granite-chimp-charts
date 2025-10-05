// Dashboard endpoint for Vercel serverless function
module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { fileId, analysis, kpis, visualizations, userPlan, customTitle, customDescription, theme, uploadedData } = req.body;

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
      rawData: uploadedData || [] // Use real uploaded data
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
