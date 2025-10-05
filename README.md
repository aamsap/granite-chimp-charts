# 🐵 Chimp Chart

**AI-Powered Dashboard Generator** - Transform your CSV and Excel data into beautiful, professional dashboards in seconds. No coding required.

![Chimp Chart](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![License](https://img.shields.io/badge/License-MIT-blue)
![Node.js](https://img.shields.io/badge/Node.js-18.18.0+-green)
![React](https://img.shields.io/badge/React-18.3.1+-blue)

## 🚀 Features

### ✨ Core Features

- **📊 AI-Powered Analysis**: Uses Granite AI to analyze your data and suggest relevant KPIs
- **📈 Automatic Visualization**: AI recommends the best chart types for your data
- **📄 PDF Export**: Download professional PDF reports
- **🎨 Beautiful UI**: Modern, responsive design with dark/light mode support
- **📱 Mobile Friendly**: Works perfectly on all devices

### 🆓 Free Plan

- Upload CSV/Excel files (up to 1000 rows)
- AI-powered KPI suggestions
- Automatic visualizations (3 recommended charts)
- Standard PDF export
- 1 dashboard page

### 💎 Pro Plan

- **Unlimited rows** of data
- **Custom titles & descriptions**
- **Multiple dashboard pages**
- **Choose visualization types**
- **Custom themes & templates**
- **Priority support**

## 🏗️ Architecture

### Frontend

- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Shadcn/ui** components
- **React Router** for navigation
- **Recharts** for data visualization
- **TanStack Query** for state management

### Backend

- **Node.js** with Express.js
- **Granite AI** via Replicate API
- **Puppeteer** for PDF generation
- **Multer** for file uploads
- **Joi** for validation
- **Security** with Helmet, CORS, rate limiting

## 🛠️ Quick Start

### Prerequisites

- Node.js 18.18.0 or higher
- npm 9.0.0 or higher

### Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd granite-chimp-charts
```

2. **Setup Backend**

```bash
cd backend
npm install
cp env.example .env
# Edit .env with your configuration
npm run dev
```

3. **Setup Frontend**

```bash
# From root directory
npm install
cp env.example .env
# Edit .env (set VITE_API_URL=http://localhost:3001/api)
npm run dev
```

4. **Access the application**

- Frontend: http://localhost:8080
- Backend API: http://localhost:3001

## 📋 How It Works

### 1. Upload Your Data

- Drag & drop your CSV or Excel file
- System validates format and structure
- Supports files up to 10MB

### 2. AI Analysis

- Granite AI analyzes your data structure
- Identifies data types and patterns
- Suggests relevant KPIs automatically

### 3. Visualization

- AI recommends optimal chart types
- Generates beautiful visualizations
- Customizable for Pro users

### 4. Dashboard Generation

- Creates professional dashboard layout
- Includes title, description, and insights
- Ready for presentation or sharing

### 5. Export & Share

- Download as high-quality PDF
- Share online with your team
- Perfect for reports and presentations

## 🔧 Configuration

### Environment Variables

**Frontend (.env)**

```env
VITE_API_URL=http://localhost:3001/api
VITE_APP_NAME=Chimp Chart
VITE_APP_VERSION=1.0.0
```

**Backend (.env)**

```env
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:8080
REPLICATE_API_TOKEN=your_replicate_token_here
GRANITE_MODEL=ibm/granite-3.2-8b-instruct
REPLICATE_API_URL=https://api.replicate.com/v1
```

## 📚 API Documentation

### Endpoints

| Method | Endpoint                       | Description                       |
| ------ | ------------------------------ | --------------------------------- |
| `POST` | `/api/upload`                  | Upload CSV/Excel file             |
| `POST` | `/api/analysis/analyze`        | Analyze uploaded data             |
| `POST` | `/api/analysis/kpis`           | Get KPI suggestions               |
| `POST` | `/api/analysis/visualizations` | Get visualization recommendations |
| `POST` | `/api/dashboard/generate`      | Generate dashboard                |
| `POST` | `/api/pdf/generate`            | Generate PDF                      |
| `GET`  | `/api/health`                  | Health check                      |

### Request Headers

- `X-User-Plan`: `free` | `pro`
- `Content-Type`: `application/json`

## 🧪 Testing

### Run Tests

```bash
# Frontend tests
npm test

# Backend tests
cd backend
npm test
```

### Manual Testing

1. Upload a sample CSV file
2. Verify file validation works
3. Test analysis and dashboard generation
4. Check PDF export functionality

## 🚀 Deployment

### Frontend (Vercel/Netlify)

```bash
npm run build
# Deploy dist/ folder
```

### Backend (Railway/Heroku)

```bash
cd backend
npm start
# Configure environment variables
```

### Docker

```bash
# Build and run with Docker Compose
docker-compose up -d
```

## 📁 Project Structure

```
granite-chimp-charts/
├── backend/                 # Backend API
│   ├── routes/             # API endpoints
│   ├── services/           # Business logic
│   ├── middleware/         # Express middleware
│   └── server.js          # Main server
├── src/                   # Frontend React app
│   ├── components/        # React components
│   ├── pages/            # Page components
│   ├── hooks/            # Custom hooks
│   ├── services/         # API services
│   └── lib/              # Utilities
├── public/               # Static assets
└── docs/                # Documentation
```

## 🔒 Security

- **Rate Limiting**: 100 requests per 15 minutes
- **File Validation**: Strict type and size checking
- **CORS Protection**: Configurable origins
- **Input Validation**: Joi schema validation
- **Security Headers**: Helmet.js protection

## 📈 Performance

- **File Size Limit**: 10MB
- **Free Plan**: 1000 rows max
- **Pro Plan**: Unlimited rows
- **PDF Generation**: 2-5 seconds
- **Analysis Time**: 1-3 seconds

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check the [SETUP.md](SETUP.md) for detailed setup instructions
- **Issues**: Report bugs via GitHub Issues
- **Email**:aam@excellentchimp.com
- **Discord**: [Join our community](https://discord.gg/chimpchart)

## 🙏 Acknowledgments

- **Granite AI** for powerful data analysis capabilities
- **Shadcn/ui** for beautiful UI components
- **React** and **Node.js** communities for excellent tooling
- **Contributors** who help improve this project

---

**Made with ❤️ by Aamverse**

_Transform your data into insights. No coding required._
