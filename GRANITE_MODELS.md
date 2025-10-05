# IBM Granite Models for Chimp Chart

Dokumentasi lengkap tentang model IBM Granite yang direkomendasikan untuk proyek Chimp Chart.

## 🎯 **REKOMENDASI UTAMA**

### **Granite-3.2-8B-Instruct** ⭐

**Model yang paling cocok untuk Chimp Chart**

#### **Spesifikasi:**
- **Size**: 8 billion parameters
- **Type**: Instruction-tuned language model
- **Optimized for**: Structured data analysis, code generation, content creation

#### **Kemampuan untuk Chimp Chart:**

1. **📊 Data Analysis**
   ```json
   {
     "task": "analyze_csv_data",
     "input": "CSV headers and sample rows",
     "output": {
       "data_type": "financial",
       "insights": ["revenue_trend", "product_performance"],
       "confidence": 0.95
     }
   }
   ```

2. **🎯 KPI Suggestions**
   ```json
   {
     "kpis": [
       {
         "name": "Total Revenue",
         "type": "sum",
         "column": "revenue",
         "description": "Sum of all revenue values"
       }
     ]
   }
   ```

3. **📈 Visualization Recommendations**
   ```json
   {
     "visualizations": [
       {
         "type": "bar_chart",
         "title": "Revenue by Product",
         "x_axis": "product",
         "y_axis": "revenue",
         "reasoning": "Best for comparing categorical data"
       }
     ]
   }
   ```

4. **📝 Content Generation**
   - Dashboard titles
   - Descriptions
   - Analysis summaries
   - PDF content

#### **Prompt Engineering untuk Chimp Chart:**

```javascript
const prompt = `
You are a data analyst AI specialized in creating business dashboards.

TASK: Analyze the following data and create dashboard recommendations.

DATA:
Headers: ${headers.join(', ')}
Sample rows: ${JSON.stringify(sampleRows)}

REQUIREMENTS:
1. Identify the data type (financial, customer, operational, etc.)
2. Suggest 5-10 relevant KPIs
3. Recommend 3-5 visualizations
4. Generate a dashboard title and description
5. Provide confidence score

OUTPUT FORMAT: JSON with structured data
`;
```

## 🔧 **IMPLEMENTASI**

### **Environment Configuration**

```env
# backend/.env
GRANITE_API_URL=https://api.granite.com
GRANITE_API_KEY=your_api_key_here
GRANITE_MODEL=granite-3.2-8b-instruct
```

### **API Integration**

```javascript
// backend/services/graniteService.js
const payload = {
  model: 'granite-3.2-8b-instruct',
  prompt: analysisPrompt,
  max_tokens: 2000,
  temperature: 0.3, // Lower for more consistent results
  top_p: 0.9,
  instructions: {
    task: 'dashboard_generation',
    output_format: 'structured_json'
  }
};
```

### **Error Handling**

```javascript
try {
  const response = await axios.post(`${GRANITE_API_URL}/v1/chat/completions`, payload);
  return response.data.choices[0].message.content;
} catch (error) {
  // Fallback to mock data
  return generateMockAnalysis(fileData, userPlan);
}
```

## 🚀 **ADVANCED FEATURES**

### **Multi-Model Approach**

Untuk fitur yang lebih advanced, kombinasi beberapa model:

```javascript
const models = {
  analysis: 'granite-3.2-8b-instruct',
  vision: 'granite-vision', // For chart analysis
  guardian: 'granite-guardian' // For safety checks
};
```

### **Model Selection Logic**

```javascript
function selectModel(task, dataType) {
  switch (task) {
    case 'data_analysis':
      return 'granite-3.2-8b-instruct';
    case 'chart_analysis':
      return 'granite-vision';
    case 'safety_check':
      return 'granite-guardian';
    default:
      return 'granite-3.2-8b-instruct';
  }
}
```

## 📊 **PERFORMANCE EXPECTATIONS**

### **Response Times**
- **Data Analysis**: 1-3 seconds
- **KPI Generation**: 2-4 seconds
- **Visualization Recommendations**: 1-2 seconds
- **Content Generation**: 1-2 seconds

### **Accuracy Metrics**
- **Data Type Detection**: 95%+ accuracy
- **KPI Relevance**: 90%+ relevance score
- **Visualization Appropriateness**: 85%+ appropriateness

### **Token Usage**
- **Input**: ~500-1000 tokens per analysis
- **Output**: ~800-1500 tokens per response
- **Cost**: ~$0.01-0.05 per dashboard generation

## 🛡️ **SECURITY & SAFETY**

### **Granite Guardian Integration**

```javascript
// Safety check before processing
const safetyCheck = await guardianModel.check({
  input: fileData,
  task: 'data_analysis',
  user_plan: userPlan
});

if (!safetyCheck.safe) {
  throw new Error('Input failed safety check');
}
```

### **Data Privacy**
- No data stored permanently
- Processing in memory only
- Secure API communication
- User data isolation

## 🔄 **FALLBACK STRATEGY**

Jika Granite API tidak tersedia:

```javascript
function generateMockAnalysis(fileData, userPlan) {
  return {
    dataType: detectDataType(fileData.headers, fileData.rows),
    insights: generateMockInsights(fileData),
    kpis: generateMockKPIs(fileData),
    visualizations: generateMockVisualizations(fileData),
    confidence: 0.85
  };
}
```

## 📈 **OPTIMIZATION TIPS**

### **Prompt Optimization**
1. **Be Specific**: Clearly define the task
2. **Provide Context**: Include data structure info
3. **Set Constraints**: Define output format
4. **Use Examples**: Provide sample outputs

### **Caching Strategy**
```javascript
const cache = new Map();

function getCachedAnalysis(dataHash) {
  return cache.get(dataHash);
}

function cacheAnalysis(dataHash, result) {
  cache.set(dataHash, result);
  // TTL: 1 hour
  setTimeout(() => cache.delete(dataHash), 3600000);
}
```

### **Rate Limiting**
```javascript
const rateLimiter = {
  free: { requests: 10, window: 3600000 }, // 10/hour
  pro: { requests: 100, window: 3600000 }  // 100/hour
};
```

## 🧪 **TESTING**

### **Unit Tests**
```javascript
describe('Granite Service', () => {
  test('should analyze financial data correctly', async () => {
    const result = await analyzeDataWithGranite(financialData);
    expect(result.dataType).toBe('financial');
    expect(result.kpis).toHaveLength(5);
  });
});
```

### **Integration Tests**
```javascript
test('end-to-end dashboard generation', async () => {
  const file = await uploadTestFile();
  const analysis = await analyzeData(file.id);
  const dashboard = await generateDashboard(analysis);
  expect(dashboard).toBeDefined();
});
```

## 📚 **RESOURCES**

- [IBM Granite Documentation](https://www.ibm.com/docs/en/watsonxdata)
- [Granite Model Cards](https://huggingface.co/ibm)
- [API Reference](https://api.granite.com/docs)
- [Best Practices Guide](https://docs.granite.com/best-practices)

---

**Chimp Chart Team** - *Powered by IBM Granite AI* 🚀
