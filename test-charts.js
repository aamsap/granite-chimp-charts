// Test script untuk memverifikasi chart functionality
const testChartData = [
  { Date: '2024-01-01', Revenue: 1000, Quantity: 10, Product: 'A', Category: 'Electronics' },
  { Date: '2024-01-02', Revenue: 1500, Quantity: 15, Product: 'B', Category: 'Clothing' },
  { Date: '2024-01-03', Revenue: 2000, Quantity: 20, Product: 'A', Category: 'Electronics' },
  { Date: '2024-01-04', Revenue: 1200, Quantity: 12, Product: 'C', Category: 'Books' },
  { Date: '2024-01-05', Revenue: 1800, Quantity: 18, Product: 'B', Category: 'Clothing' },
  { Date: '2024-01-06', Revenue: 2200, Quantity: 22, Product: 'A', Category: 'Electronics' },
  { Date: '2024-01-07', Revenue: 1600, Quantity: 16, Product: 'B', Category: 'Clothing' },
  { Date: '2024-01-08', Revenue: 1900, Quantity: 19, Product: 'C', Category: 'Books' },
  { Date: '2024-01-09', Revenue: 2100, Quantity: 21, Product: 'A', Category: 'Electronics' },
  { Date: '2024-01-10', Revenue: 1400, Quantity: 14, Product: 'B', Category: 'Clothing' }
];

// Test upload dengan data yang lebih lengkap
async function testFullUpload() {
  try {
    console.log('🧪 Testing Full Upload with Chart Data...');
    
    const response = await fetch('/api/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        parsedData: testChartData,
        filename: 'chart-test.csv',
        fileType: '.csv'
      })
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Upload Success:', data);
      
      // Test analysis dengan data lengkap
      const analysisResponse = await fetch('/api/analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileId: data.fileId,
          userPlan: 'free',
          uploadedData: testChartData
        })
      });
      
      if (analysisResponse.ok) {
        const analysisData = await analysisResponse.json();
        console.log('✅ Analysis Success:', analysisData);
        
        // Check visualizations
        const visualizations = analysisData.analysis?.visualizations || [];
        console.log('📊 Visualizations:', visualizations);
        
        visualizations.forEach((viz, index) => {
          console.log(`📈 Chart ${index + 1}:`, {
            type: viz.type,
            title: viz.title,
            recommended: viz.recommended,
            dataLength: viz.data?.length || 0,
            xAxis: viz.xAxis,
            yAxis: viz.yAxis,
            dataKey: viz.dataKey
          });
        });
        
        return { fileId: data.fileId, analysis: analysisData.analysis };
      } else {
        console.error('❌ Analysis Failed:', await analysisResponse.text());
      }
    } else {
      console.error('❌ Upload Failed:', await response.text());
    }
  } catch (error) {
    console.error('❌ Test Error:', error);
  }
}

// Test chart data preparation
function testChartDataPreparation() {
  console.log('🧪 Testing Chart Data Preparation...');
  
  const mockVisualizations = [
    {
      type: 'bar',
      title: 'Distribution by Product',
      xAxis: 'Product',
      yAxis: 'count',
      data: testChartData,
      recommended: true
    },
    {
      type: 'pie',
      title: 'Distribution by Category',
      dataKey: 'Category',
      data: testChartData,
      recommended: true
    },
    {
      type: 'line',
      title: 'Revenue Trend',
      xAxis: 'index',
      yAxis: 'Revenue',
      data: testChartData,
      recommended: true
    }
  ];
  
  mockVisualizations.forEach((viz, index) => {
    console.log(`📊 Mock Chart ${index + 1}:`, {
      type: viz.type,
      title: viz.title,
      dataLength: viz.data.length,
      recommended: viz.recommended
    });
  });
}

// Export functions untuk browser console
window.testFullUpload = testFullUpload;
window.testChartDataPreparation = testChartDataPreparation;

console.log('🎯 Chart Test Functions Loaded!');
console.log('Run: testFullUpload() - Test complete upload and analysis flow');
console.log('Run: testChartDataPreparation() - Test chart data preparation');
