// Upload endpoint for Vercel serverless function
const formidable = require('formidable');
const fs = require('fs');
const path = require('path');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const form = formidable({
      uploadDir: '/tmp',
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB limit
    });

    const [fields, files] = await form.parse(req);
    const file = files.file?.[0];

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Validate file type
    const allowedTypes = ['.csv', '.xlsx', '.xls'];
    const fileExt = path.extname(file.originalFilename).toLowerCase();
    
    if (!allowedTypes.includes(fileExt)) {
      return res.status(400).json({ 
        error: 'Invalid file type. Please upload CSV or Excel files.' 
      });
    }

    // Read file content
    const fileContent = fs.readFileSync(file.filepath, 'utf8');
    
    // Clean up temp file
    fs.unlinkSync(file.filepath);

    // Generate unique filename
    const filename = `upload_${Date.now()}_${Math.random().toString(36).substr(2, 9)}${fileExt}`;
    
    res.status(200).json({
      success: true,
      message: 'File uploaded successfully',
      filename: filename,
      size: file.size,
      type: fileExt
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      error: 'File upload failed',
      message: error.message 
    });
  }
};
