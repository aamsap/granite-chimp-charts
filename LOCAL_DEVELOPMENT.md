# 🚀 Local Development Guide

## Cara Menjalankan Aplikasi Serverless di Local

### 📋 Prerequisites

1. **Node.js** (v18 atau lebih baru)
2. **npm** atau **yarn**
3. **Vercel CLI** (opsional, untuk serverless functions)

### 🔧 Setup Awal

1. **Clone repository dan switch ke branch serverless:**

   ```bash
   git checkout feature/vercel-serverless
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Install Vercel CLI (untuk serverless functions):**
   ```bash
   npm install -g vercel
   ```

### 🌐 Menjalankan Aplikasi

#### Option 1: Frontend Only (Recommended untuk development)

```bash
# Terminal 1: Start frontend
npm run dev
```

Frontend akan berjalan di: `http://localhost:5173`

**Note:** API calls akan menggunakan mock data karena tidak ada backend yang berjalan.

#### Option 2: Full Stack dengan Serverless Functions

```bash
# Terminal 1: Start frontend
npm run dev

# Terminal 2: Start serverless functions
vercel dev
```

- Frontend: `http://localhost:5173`
- API: `http://localhost:3000`

#### Option 3: Menggunakan Script Otomatis

```bash
# Jalankan setup script
./start-local.sh
```

### 🔗 API Endpoints

Ketika menggunakan `vercel dev`, API endpoints tersedia di:

- `GET http://localhost:3000/api/health` - Health check
- `POST http://localhost:3000/api/upload` - File upload
- `POST http://localhost:3000/api/analysis` - Data analysis
- `POST http://localhost:3000/api/dashboard` - Dashboard generation

### ⚙️ Environment Variables

Buat file `.env.local` di root project:

```env
VITE_API_URL=http://localhost:3000
REPLICATE_API_TOKEN=your_token_here
NODE_ENV=development
```

### 🧪 Testing

1. **Test Frontend:**

   ```bash
   curl http://localhost:5173
   ```

2. **Test API Health:**

   ```bash
   curl http://localhost:3000/api/health
   ```

3. **Test File Upload:**
   ```bash
   curl -X POST -F "file=@test-data.csv" http://localhost:3000/api/upload
   ```

### 🐛 Troubleshooting

#### Port Already in Use

```bash
# Kill processes on ports
lsof -ti:5173 | xargs kill -9
lsof -ti:3000 | xargs kill -9
```

#### Vercel CLI Issues

```bash
# Reinstall Vercel CLI
npm uninstall -g vercel
npm install -g vercel

# Login to Vercel
vercel login
```

#### Dependencies Issues

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

### 📊 Development Features

- ✅ **Hot Reload** - Frontend auto-reload saat code berubah
- ✅ **Mock Data** - API menggunakan mock data untuk development
- ✅ **File Upload** - Test upload CSV/Excel files
- ✅ **Dashboard Generation** - Generate dashboard dengan mock data
- ✅ **Print Functionality** - Browser print untuk export

### 🚀 Production Build

```bash
# Build untuk production
npm run build

# Preview production build
npm run preview
```

### 📝 Notes

- **Serverless Functions** menggunakan mock data untuk development
- **File Upload** akan menggunakan temp storage (`/tmp`)
- **No Database** - Aplikasi stateless untuk development
- **CORS** sudah dikonfigurasi untuk local development

### 🎯 Next Steps

1. Test semua fitur di local
2. Deploy ke Vercel untuk production
3. Integrate dengan real AI API jika diperlukan
4. Add persistent storage untuk production

---

**Happy Coding! 🎉**
