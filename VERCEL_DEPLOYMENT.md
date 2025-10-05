# Vercel Deployment Guide

## 🚀 Deploy to Vercel (Serverless)

This project has been configured to run as a serverless application on Vercel.

### 📁 Project Structure

```
├── api/                    # Vercel serverless functions
│   ├── health.js          # Health check endpoint
│   ├── upload.js          # File upload endpoint
│   ├── analysis.js        # Data analysis endpoint
│   └── dashboard.js       # Dashboard generation endpoint
├── src/                   # React frontend
├── vercel.json           # Vercel configuration
└── package.json          # Dependencies
```

### 🔧 Setup Steps

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Environment Variables**
   Create `.env.local` file:

   ```env
   VITE_API_URL=http://localhost:3000
   REPLICATE_API_TOKEN=your_token_here
   ```

3. **Deploy to Vercel**

   ```bash
   # Install Vercel CLI
   npm i -g vercel

   # Deploy
   vercel
   ```

### 🌐 API Endpoints

- `GET /api/health` - Health check
- `POST /api/upload` - File upload
- `POST /api/analysis` - Data analysis
- `POST /api/dashboard` - Dashboard generation

### ⚙️ Vercel Configuration

The `vercel.json` file configures:

- Build settings for React app
- API routes for serverless functions
- Environment variables
- Function timeouts

### 🔄 Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### 📊 Features

- ✅ Serverless functions for backend
- ✅ File upload handling
- ✅ Data analysis (mock implementation)
- ✅ Dashboard generation
- ✅ Responsive React frontend
- ✅ Print functionality (no PDF)

### 🚨 Limitations

- File uploads limited to 10MB
- Function timeout: 30 seconds
- No persistent storage (stateless)
- Mock AI analysis (can be replaced with real AI)

### 🔧 Customization

To add real AI analysis:

1. Update `api/analysis.js` with actual AI API calls
2. Add environment variables for AI services
3. Implement proper error handling

### 📝 Notes

- All backend functionality moved to serverless functions
- Frontend uses `/api/` prefix for all API calls
- No database required (stateless design)
- Perfect for Vercel's free tier
