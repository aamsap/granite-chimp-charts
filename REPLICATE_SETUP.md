# Setup Replicate untuk Granite-3.2-8B-Instruct

Panduan lengkap untuk mengintegrasikan Granite-3.2-8B-Instruct melalui Replicate API.

## 🚀 **LANGKAH-LANGKAH SETUP**

### **Step 1: Daftar di Replicate**

1. **Kunjungi**: https://replicate.com
2. **Sign Up** dengan email atau GitHub
3. **Verify** email address
4. **Complete** profile setup

### **Step 2: Dapatkan API Token**

1. **Login** ke Replicate dashboard
2. **Go to**: Account Settings → API Tokens
3. **Create** new token
4. **Copy** token (format: `r8_...`)

### **Step 3: Konfigurasi Backend**

1. **Edit** file `backend/.env`:
```env
# Granite AI via Replicate Configuration
REPLICATE_API_TOKEN=r8_your_actual_token_here
GRANITE_MODEL=ibm/granite-3.2-8b-instruct
REPLICATE_API_URL=https://api.replicate.com/v1
```

2. **Restart** backend server:
```bash
cd backend
npm run dev
```

## 🔧 **KONFIGURASI MODEL**

### **Model Information**
- **Model**: `ibm/granite-3.2-8b-instruct`
- **Provider**: IBM via Replicate
- **Size**: 8 billion parameters
- **Type**: Instruction-tuned language model
- **Specialization**: Data analysis, dashboard generation

### **API Parameters**
```javascript
{
  "version": "latest",
  "input": {
    "prompt": "Your analysis prompt here",
    "max_new_tokens": 2000,
    "temperature": 0.3,
    "top_p": 0.9,
    "repetition_penalty": 1.1
  }
}
```

## 📊 **WORKFLOW INTEGRATION**

### **1. File Upload & Validation**
```javascript
// File sudah diupload dan divalidasi
const fileData = await parseFileData(filePath);
```

### **2. Granite Analysis**
```javascript
// Analisis dengan Granite via Replicate
const analysis = await analyzeDataWithGranite(fileData, userPlan);
```

### **3. Result Processing**
```javascript
// Parse hasil dari Granite
const result = {
  dataType: analysis.dataType,
  kpis: analysis.kpis,
  visualizations: analysis.visualizations,
  dashboard: analysis.dashboard
};
```

## 🧪 **TESTING**

### **Test dengan Sample Data**

1. **Upload** file `sample-data.csv`
2. **Click** "Analyze & Generate Dashboard"
3. **Monitor** console untuk logs
4. **Check** hasil analysis

### **Expected Response Time**
- **Cold Start**: 10-15 seconds (first request)
- **Warm Start**: 3-5 seconds (subsequent requests)
- **Timeout**: 60 seconds maximum

### **Sample Response**
```json
{
  "dataType": "financial",
  "insights": [
    {
      "type": "trend",
      "title": "Revenue Growth",
      "description": "Revenue shows positive growth trend",
      "confidence": 0.92
    }
  ],
  "kpis": [
    {
      "id": "total_revenue",
      "name": "Total Revenue",
      "description": "Sum of all revenue values",
      "type": "sum",
      "column": "revenue",
      "category": "financial"
    }
  ],
  "visualizations": [
    {
      "id": "revenue_by_product",
      "type": "bar",
      "title": "Revenue by Product",
      "description": "Shows revenue distribution across products",
      "xAxis": "product",
      "yAxis": "revenue",
      "recommended": true
    }
  ],
  "dashboard": {
    "title": "Financial Performance Dashboard",
    "description": "Comprehensive analysis of revenue and product performance"
  },
  "confidence": 0.89
}
```

## 💰 **COST ESTIMATION**

### **Pricing (per 1M tokens)**
- **Input**: ~$0.50 per 1M tokens
- **Output**: ~$1.50 per 1M tokens

### **Typical Usage**
- **Input**: ~500-1000 tokens per analysis
- **Output**: ~800-1500 tokens per response
- **Cost per dashboard**: ~$0.01-0.05

### **Monthly Estimates**
- **100 dashboards/month**: ~$1-5
- **1000 dashboards/month**: ~$10-50
- **10000 dashboards/month**: ~$100-500

## 🔍 **MONITORING & DEBUGGING**

### **Console Logs**
```javascript
// Success logs
console.log('Replicate prediction started:', predictionId);
console.log('Analysis completed:', result);

// Error logs
console.error('Replicate API Error:', error);
console.error('Failed to parse result:', parseError);
```

### **Health Check**
```bash
curl -H "Authorization: Token YOUR_TOKEN" \
     https://api.replicate.com/v1/account
```

### **Prediction Status**
```bash
curl -H "Authorization: Token YOUR_TOKEN" \
     https://api.replicate.com/v1/predictions/PREDICTION_ID
```

## 🛠️ **TROUBLESHOOTING**

### **Common Issues**

1. **Invalid Token**
   ```
   Error: 401 Unauthorized
   Solution: Check API token format (r8_...)
   ```

2. **Model Not Found**
   ```
   Error: 404 Model not found
   Solution: Verify model name: ibm/granite-3.2-8b-instruct
   ```

3. **Timeout**
   ```
   Error: Prediction timeout
   Solution: Increase timeout or check model availability
   ```

4. **Parse Error**
   ```
   Error: Failed to parse result
   Solution: Check JSON format in response
   ```

### **Fallback Strategy**
Jika Replicate API gagal, sistem akan otomatis menggunakan mock data:
```javascript
// Automatic fallback
return generateMockAnalysis(fileData, userPlan);
```

## 📈 **OPTIMIZATION TIPS**

### **1. Prompt Engineering**
- **Be specific** tentang output format
- **Provide context** tentang data structure
- **Use examples** untuk better results

### **2. Caching**
```javascript
// Cache results untuk data yang sama
const cacheKey = generateDataHash(fileData);
const cached = getCachedAnalysis(cacheKey);
if (cached) return cached;
```

### **3. Batch Processing**
```javascript
// Process multiple files dalam batch
const analyses = await Promise.all(
  files.map(file => analyzeDataWithGranite(file, userPlan))
);
```

## 🔒 **SECURITY**

### **API Token Security**
- **Never commit** token ke Git
- **Use environment variables**
- **Rotate** tokens regularly
- **Monitor** usage patterns

### **Data Privacy**
- **No data stored** permanently di Replicate
- **Processing** in memory only
- **Secure** API communication
- **User data** isolation

## 📚 **RESOURCES**

- **Replicate Docs**: https://replicate.com/docs
- **Granite Model**: https://replicate.com/ibm/granite-3.2-8b-instruct
- **API Reference**: https://replicate.com/docs/reference/http
- **Community**: https://replicate.com/community

## 🎯 **NEXT STEPS**

1. **Setup** Replicate account
2. **Configure** API token
3. **Test** dengan sample data
4. **Monitor** performance
5. **Optimize** prompts
6. **Scale** untuk production

---

**Chimp Chart Team** - *Powered by Granite AI via Replicate* 🚀
