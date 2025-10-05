// Analysis endpoint for Vercel serverless function
module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { data, filename } = req.body;

    if (!data || !Array.isArray(data) || data.length === 0) {
      return res.status(400).json({ 
        error: 'Invalid data provided',
        message: 'Please provide valid CSV data array' 
      });
    }

    // Mock analysis for now (can be replaced with actual AI analysis)
    const mockAnalysis = {
      dataType: 'financial',
      confidence: 90.0,
      processingTime: '2.2s',
      kpis: [
        {
          id: 'kpi-1',
          name: 'Total Revenue',
          description: 'Sum of all Revenue values',
          type: 'sum',
          column: 'Revenue',
          category: 'financial'
        },
        {
          id: 'kpi-2',
          name: 'Average Revenue',
          description: 'Average value of Revenue',
          type: 'average',
          column: 'Revenue',
          category: 'statistical'
        }
      ],
      visualizations: [
        {
          id: 'viz-1',
          title: 'Distribution by Date',
          type: 'bar',
          xAxis: 'Date',
          yAxis: 'count',
          recommended: true
        },
        {
          id: 'viz-2',
          title: 'Trend of Revenue',
          type: 'line',
          xAxis: 'index',
          yAxis: 'Revenue',
          recommended: true
        }
      ],
      insights: [
        'Revenue shows consistent growth over time',
        'Peak performance observed in Q4',
        'Recommend focusing on high-performing categories'
      ]
    };

    res.status(200).json({
      success: true,
      analysis: mockAnalysis,
      filename: filename || 'analysis',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ 
      error: 'Analysis failed',
      message: error.message 
    });
  }
};
