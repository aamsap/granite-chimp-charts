# 🚀 Chimp Chart - Setup Guide

Panduan lengkap untuk menjalankan proyek Chimp Chart dengan backend dan frontend.

## 📋 Overview

Chimp Chart adalah aplikasi AI-powered dashboard generator yang menggunakan Granite AI untuk menganalisis data CSV/Excel dan menghasilkan dashboard yang indah.

### 🏗️ Arsitektur
- **Frontend**: React + TypeScript + Tailwind CSS + Shadcn/ui
- **Backend**: Node.js + Express.js + Granite AI API
- **Features**: File upload, AI analysis, Dashboard generation, PDF export

## 🛠️ Prerequisites

- **Node.js**: 18.18.0 atau lebih baru
- **npm**: 9.0.0 atau lebih baru
- **Git**: Untuk clone repository

## 📦 Installation

### 1. Clone Repository
```bash
git clone <repository-url>
cd granite-chimp-charts
```

### 2. Setup Backend

```bash
# Masuk ke folder backend
cd backend

# Install dependencies
npm install

# Setup environment variables
cp env.example .env

# Edit file .env dengan konfigurasi yang sesuai
# Minimal yang perlu diisi:
# - GRANITE_API_KEY (jika ada)
# - PORT (default: 3001)
```

### 3. Setup Frontend

```bash
# Kembali ke root directory
cd ..

# Install dependencies
npm install

# Setup environment variables
cp env.example .env

# Edit file .env dengan konfigurasi yang sesuai
# Minimal yang perlu diisi:
# - VITE_API_URL=http://localhost:3001/api
```

## 🚀 Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Backend akan berjalan di `http://localhost:3001`

**Terminal 2 - Frontend:**
```bash
npm run dev
```
Frontend akan berjalan di `http://localhost:8080`

### Production Mode

**Build Frontend:**
```bash
npm run build
```

**Start Backend:**
```bash
cd backend
npm start
```

## 🔧 Configuration

### Backend Configuration (.env)

```env
# Server Configuration
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:8080

# Granite AI API Configuration
GRANITE_API_URL=https://api.granite.com
GRANITE_API_KEY=your_granite_api_key_here

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_DIR=./uploads

# PDF Generation Configuration
PDF_OUTPUT_DIR=./pdfs
PDF_TEMPLATE_DIR=./templates
```

### Frontend Configuration (.env)

```env
# Backend API URL
VITE_API_URL=http://localhost:3001/api

# App Configuration
VITE_APP_NAME=Chimp Chart
VITE_APP_VERSION=1.0.0

# Feature Flags
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_DEBUG=true
```

## 📁 Project Structure

```
granite-chimp-charts/
├── backend/                 # Backend API
│   ├── routes/             # API endpoints
│   ├── services/           # Business logic
│   ├── middleware/         # Express middleware
│   ├── uploads/            # Uploaded files
│   ├── pdfs/              # Generated PDFs
│   └── server.js          # Main server file
├── src/                   # Frontend React app
│   ├── components/        # React components
│   ├── pages/            # Page components
│   ├── hooks/            # Custom hooks
│   ├── services/         # API services
│   └── lib/              # Utilities
├── public/               # Static assets
└── package.json         # Frontend dependencies
```

## 🎯 Features

### ✅ Implemented Features

1. **File Upload & Validation**
   - Drag & drop interface
   - CSV/Excel file support
   - File format validation
   - Size limit enforcement

2. **AI Analysis Integration**
   - Granite AI API integration
   - Mock data fallback
   - Data type detection
   - KPI suggestions

3. **Dashboard Generation**
   - Automatic layout generation
   - KPI cards
   - Visualization recommendations
   - Theme support

4. **PDF Export**
   - Professional PDF generation
   - Custom templates
   - Download functionality

5. **User Plans**
   - Free plan limitations
   - Pro plan features
   - Plan-based access control

### 🔄 Workflow

1. **Upload**: User uploads CSV/Excel file
2. **Validate**: System validates file format and structure
3. **Analyze**: Granite AI analyzes data and suggests KPIs
4. **Visualize**: System recommends visualizations
5. **Generate**: Dashboard is created with title and description
6. **Export**: User can download dashboard as PDF

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
npm test
```

### Manual Testing

1. **Upload Test File**:
   - Create a CSV file with headers and data
   - Upload via the interface
   - Verify validation works

2. **Analysis Test**:
   - Upload a file
   - Click "Analyze & Generate Dashboard"
   - Verify analysis completes

3. **PDF Export Test**:
   - Generate a dashboard
   - Click "Download PDF"
   - Verify PDF downloads

## 🚨 Troubleshooting

### Common Issues

1. **Backend won't start**:
   - Check if port 3001 is available
   - Verify Node.js version (18.18.0+)
   - Check .env file configuration

2. **Frontend can't connect to backend**:
   - Verify VITE_API_URL in .env
   - Check if backend is running
   - Verify CORS configuration

3. **File upload fails**:
   - Check file size (max 10MB)
   - Verify file format (CSV, XLS, XLSX)
   - Check backend uploads directory exists

4. **PDF generation fails**:
   - Check if Puppeteer is installed
   - Verify PDFs directory exists
   - Check system dependencies

### Debug Mode

Enable debug mode in frontend:
```env
VITE_ENABLE_DEBUG=true
```

Check backend logs for detailed error information.

## 📚 API Documentation

### Endpoints

- `POST /api/upload` - Upload file
- `POST /api/analysis/analyze` - Analyze data
- `POST /api/analysis/kpis` - Get KPI suggestions
- `POST /api/analysis/visualizations` - Get visualization recommendations
- `POST /api/dashboard/generate` - Generate dashboard
- `POST /api/pdf/generate` - Generate PDF
- `GET /api/health` - Health check

### Request Headers

- `X-User-Plan`: free | pro
- `Content-Type`: application/json (for JSON requests)

## 🔒 Security

- Rate limiting (100 requests per 15 minutes)
- File type validation
- Size limits
- CORS protection
- Input validation with Joi

## 📈 Performance

- File size limit: 10MB
- Free plan: 1000 rows max
- Pro plan: Unlimited rows
- PDF generation: ~2-5 seconds
- Analysis: ~1-3 seconds

## 🚀 Deployment

### Backend Deployment

1. Set production environment variables
2. Build and start the server
3. Configure reverse proxy (nginx)
4. Setup SSL certificates

### Frontend Deployment

1. Build the application: `npm run build`
2. Deploy to static hosting (Vercel, Netlify, etc.)
3. Configure environment variables
4. Update API URLs

## 📞 Support

Untuk pertanyaan atau masalah:
1. Check troubleshooting section
2. Review API documentation
3. Check GitHub issues
4. Contact development team

## 🔄 Updates

Untuk update aplikasi:
1. Pull latest changes: `git pull`
2. Update dependencies: `npm install`
3. Restart services
4. Check for breaking changes

---

**Happy Coding! 🎉**
