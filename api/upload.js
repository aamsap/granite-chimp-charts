// Upload endpoint for Vercel serverless function - Accepts parsed data
module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { parsedData, filename, fileType } = req.body;

    if (!parsedData || !Array.isArray(parsedData)) {
      return res.status(400).json({ 
        error: 'Parsed data required',
        message: 'Please provide parsed CSV data' 
      });
    }

    // Validate data
    if (parsedData.length === 0) {
      return res.status(400).json({ 
        error: 'Empty data',
        message: 'No data found in the file' 
      });
    }

    // Extract headers from first row
    const headers = Object.keys(parsedData[0] || {});
    
    if (headers.length === 0) {
      return res.status(400).json({ 
        error: 'Invalid data format',
        message: 'No headers found in the data' 
      });
    }

    // Generate unique fileId
    const fileId = `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const response = {
      success: true,
      message: 'Data processed successfully',
      fileId: fileId,
      filename: filename || 'uploaded_data.csv',
      size: JSON.stringify(parsedData).length,
      type: fileType || '.csv',
      data: {
        id: fileId,
        filename: filename || 'uploaded_data.csv',
        size: JSON.stringify(parsedData).length,
        type: fileType || '.csv',
        uploadedAt: new Date().toISOString(),
        headers: headers,
        rowCount: parsedData.length,
        columnCount: headers.length,
        preview: parsedData.slice(0, 5), // First 5 rows as preview
        fullData: parsedData // Full data for processing
      }
    };

    res.status(200).json(response);

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      error: 'Data processing failed',
      message: error.message 
    });
  }
};