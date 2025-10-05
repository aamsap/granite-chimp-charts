import FormData from 'form-data';
import fs from 'fs';
import axios from 'axios';

async function testUpload() {
    console.log('🧪 Testing Upload Functionality...');

    try {
        // Test backend health first
        console.log('📡 Testing backend health...');
        const healthResponse = await axios.get('http://localhost:3001/api/health');
        console.log('✅ Backend health:', healthResponse.data);

        // Test upload with sample data
        console.log('📤 Testing file upload...');
        const formData = new FormData();

        // Create a simple CSV content
        const csvContent = `Date,Product,Revenue,Quantity
2024-01-01,Product A,1500,10
2024-01-02,Product B,800,5
2024-01-03,Product C,1200,8`;

        // Write to temp file
        fs.writeFileSync('test-upload.csv', csvContent);

        formData.append('file', fs.createReadStream('test-upload.csv'));

        const uploadResponse = await axios.post('http://localhost:3001/api/upload', formData, {
            headers: {
                ...formData.getHeaders(),
            },
        });

        console.log('✅ Upload successful:', {
            fileId: uploadResponse.data.data.fileId,
            fileName: uploadResponse.data.data.fileName,
            rowCount: uploadResponse.data.data.rowCount,
            columnCount: uploadResponse.data.data.columnCount
        });

        // Clean up
        fs.unlinkSync('test-upload.csv');

        console.log('🎉 Upload test completed successfully!');

    } catch (error) {
        console.error('❌ Upload test failed:', error.response?.data || error.message);
    }
}

testUpload();
