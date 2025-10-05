// Test script for serverless functions
const testData = [
  { Date: '2024-01-01', Revenue: 1000, Quantity: 10, Product: 'A' },
  { Date: '2024-01-02', Revenue: 1500, Quantity: 15, Product: 'B' },
  { Date: '2024-01-03', Revenue: 2000, Quantity: 20, Product: 'A' }
];

// Test upload API
async function testUpload() {
  try {
    const response = await fetch('/api/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        parsedData: testData,
        filename: 'test.csv',
        fileType: '.csv'
      })
    });
    
    console.log('Upload Response Status:', response.status);
    console.log('Upload Response Headers:', response.headers);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Upload Success:', data);
      return data.fileId;
    } else {
      const errorText = await response.text();
      console.error('Upload Error:', errorText);
    }
  } catch (error) {
    console.error('Upload Exception:', error);
  }
}

// Test analysis API
async function testAnalysis(fileId) {
  try {
    const response = await fetch('/api/analysis', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fileId: fileId,
        userPlan: 'free',
        uploadedData: testData
      })
    });
    
    console.log('Analysis Response Status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Analysis Success:', data);
    } else {
      const errorText = await response.text();
      console.error('Analysis Error:', errorText);
    }
  } catch (error) {
    console.error('Analysis Exception:', error);
  }
}

// Run tests
async function runTests() {
  console.log('🧪 Testing Serverless Functions...');
  
  const fileId = await testUpload();
  if (fileId) {
    await testAnalysis(fileId);
  }
}

// Export for browser console
window.testServerless = runTests;
