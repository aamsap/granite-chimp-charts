// Dashboard endpoint for Vercel serverless function
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { dashboardData } = req.body;

    if (!dashboardData) {
      return res.status(400).json({ 
        error: 'Dashboard data required',
        message: 'Please provide dashboard data to generate dashboard' 
      });
    }

    // Generate dashboard ID
    const dashboardId = `dashboard_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Mock dashboard generation
    const dashboard = {
      id: dashboardId,
      title: dashboardData.title || 'Dashboard - Data Analysis',
      description: dashboardData.description || 'AI-powered analysis of your data',
      createdAt: new Date().toISOString(),
      data: dashboardData,
      status: 'completed'
    };

    res.status(200).json({
      success: true,
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
}
