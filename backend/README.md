# Chimp Chart Backend API

Backend API untuk aplikasi Chimp Chart - AI-powered dashboard generator yang menggunakan Granite AI.

## 🚀 Fitur Utama

- **File Upload & Validation**: Upload dan validasi file CSV/Excel
- **AI Analysis**: Integrasi dengan Granite AI untuk analisis data
- **Dashboard Generation**: Generate dashboard otomatis dari data
- **PDF Export**: Export dashboard ke PDF
- **Plan-based Features**: Fitur berbeda untuk Free dan Pro users

## 📋 Prerequisites

- Node.js 18.18.0 atau lebih baru
- npm atau yarn
- Granite AI API key (opsional, ada fallback mock data)

## 🛠️ Installation

1. **Clone repository dan masuk ke folder backend**
```bash
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment variables**
```bash
cp env.example .env
```

Edit file `.env` dan isi dengan konfigurasi yang sesuai:
```env
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:8080
GRANITE_API_URL=https://api.granite.com
GRANITE_API_KEY=your_granite_api_key_here
```

4. **Buat folder yang diperlukan**
```bash
mkdir uploads pdfs configs
```

## 🏃‍♂️ Running the Server

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

Server akan berjalan di `http://localhost:3001`

## 📚 API Endpoints

### Health Check
- `GET /api/health` - Status server

### File Upload
- `POST /api/upload` - Upload file CSV/Excel
- `GET /api/upload/preview/:fileId` - Preview file data

### Data Analysis
- `POST /api/analysis/analyze` - Analisis data dengan Granite AI
- `POST /api/analysis/kpis` - Generate KPI suggestions
- `POST /api/analysis/visualizations` - Generate visualization recommendations

### Dashboard
- `POST /api/dashboard/generate` - Generate dashboard
- `GET /api/dashboard/template/:templateId` - Get dashboard template
- `POST /api/dashboard/save` - Save dashboard configuration

### PDF Export
- `POST /api/pdf/generate` - Generate PDF dari dashboard
- `GET /api/pdf/download/:filename` - Download PDF
- `GET /api/pdf/templates` - Get PDF templates

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 3001 |
| `NODE_ENV` | Environment | development |
| `FRONTEND_URL` | Frontend URL for CORS | http://localhost:8080 |
| `GRANITE_API_URL` | Granite AI API URL | https://api.granite.com |
| `GRANITE_API_KEY` | Granite AI API key | - |

### File Upload Limits

- **Max file size**: 10MB
- **Supported formats**: CSV, XLS, XLSX
- **Free plan**: Max 1000 rows
- **Pro plan**: Unlimited rows

## 🎯 User Plans

### Free Plan
- Upload CSV/Excel files
- Up to 1000 rows
- Basic KPI suggestions
- 3 recommended visualizations
- Standard PDF export
- 1 dashboard page

### Pro Plan
- Everything in Free, plus:
- Unlimited rows
- Custom titles & descriptions
- Multiple dashboard pages
- Choose visualization types
- Custom themes & templates
- Priority support
- Advanced PDF templates

## 🔒 Security Features

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **File Validation**: Strict file type and size validation
- **CORS Protection**: Configurable CORS settings
- **Helmet**: Security headers
- **Input Validation**: Joi schema validation

## 📁 Project Structure

```
backend/
├── routes/           # API routes
│   ├── upload.js     # File upload endpoints
│   ├── analysis.js   # Data analysis endpoints
│   ├── dashboard.js  # Dashboard generation endpoints
│   └── pdf.js        # PDF export endpoints
├── services/         # Business logic
│   ├── fileService.js      # File processing
│   ├── graniteService.js   # Granite AI integration
│   ├── dashboardService.js # Dashboard generation
│   └── pdfService.js       # PDF generation
├── middleware/       # Express middleware
│   ├── auth.js       # Authentication & authorization
│   └── validation.js # Request validation
├── uploads/          # Uploaded files (created automatically)
├── pdfs/            # Generated PDFs (created automatically)
├── configs/         # Dashboard configurations (created automatically)
└── server.js        # Main server file
```

## 🧪 Testing

```bash
npm test
```

## 📝 API Usage Examples

### Upload File
```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);

fetch('/api/upload', {
  method: 'POST',
  body: formData
})
.then(response => response.json())
.then(data => console.log(data));
```

### Analyze Data
```javascript
fetch('/api/analysis/analyze', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-User-Plan': 'free'
  },
  body: JSON.stringify({
    fileId: 'uploaded-file-id',
    userPlan: 'free'
  })
})
.then(response => response.json())
.then(data => console.log(data));
```

### Generate Dashboard
```javascript
fetch('/api/dashboard/generate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-User-Plan': 'pro'
  },
  body: JSON.stringify({
    fileId: 'uploaded-file-id',
    analysis: analysisResult,
    kpis: selectedKPIs,
    visualizations: selectedVisualizations,
    userPlan: 'pro',
    customTitle: 'My Custom Dashboard',
    customDescription: 'Custom description here'
  })
})
.then(response => response.json())
.then(data => console.log(data));
```

## 🚨 Error Handling

API menggunakan standard HTTP status codes:

- `200` - Success
- `400` - Bad Request (validation errors)
- `403` - Forbidden (plan restrictions)
- `404` - Not Found
- `500` - Internal Server Error

Error response format:
```json
{
  "error": "Error type",
  "message": "Human readable message",
  "details": "Additional error details"
}
```

## 🔄 Integration dengan Frontend

Backend ini dirancang untuk bekerja dengan frontend React yang sudah ada. Pastikan:

1. Frontend mengirim header `X-User-Plan` untuk menentukan plan user
2. CORS sudah dikonfigurasi dengan benar
3. File upload menggunakan FormData
4. Error handling sesuai dengan format response backend

## 📞 Support

Untuk pertanyaan atau masalah, silakan buat issue di repository atau hubungi tim development.
