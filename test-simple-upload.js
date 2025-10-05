// Simple upload test without external dependencies
import fs from 'fs';
import http from 'http';

function testUpload() {
    console.log('🧪 Testing Upload Functionality...');

    // Create test CSV content
    const csvContent = `Date,Product,Revenue,Quantity
2024-01-01,Product A,1500,10
2024-01-02,Product B,800,5
2024-01-03,Product C,1200,8`;

    // Write test file
    fs.writeFileSync('test-simple.csv', csvContent);

    // Read file
    const fileContent = fs.readFileSync('test-simple.csv');

    // Create multipart form data manually
    const boundary = '----formdata-boundary-' + Math.random().toString(36);
    const formData = [
        `--${boundary}`,
        'Content-Disposition: form-data; name="file"; filename="test-simple.csv"',
        'Content-Type: text/csv',
        '',
        fileContent.toString(),
        `--${boundary}--`
    ].join('\r\n');

    const options = {
        hostname: 'localhost',
        port: 3001,
        path: '/api/upload',
        method: 'POST',
        headers: {
            'Content-Type': `multipart/form-data; boundary=${boundary}`,
            'Content-Length': Buffer.byteLength(formData)
        }
    };

    const req = http.request(options, (res) => {
        console.log(`📡 Status: ${res.statusCode}`);
        console.log(`📡 Headers:`, res.headers);

        let data = '';
        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', () => {
            console.log('📤 Response:', data);

            // Clean up
            fs.unlinkSync('test-simple.csv');

            if (res.statusCode === 200) {
                console.log('✅ Upload test successful!');
            } else {
                console.log('❌ Upload test failed!');
            }
        });
    });

    req.on('error', (error) => {
        console.error('❌ Request error:', error.message);
        // Clean up
        try {
            fs.unlinkSync('test-simple.csv');
        } catch (e) { }
    });

    req.write(formData);
    req.end();
}

testUpload();
