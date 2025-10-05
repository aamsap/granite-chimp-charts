import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileSpreadsheet, AlertCircle, BarChart3, Download, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useDashboard } from "@/hooks/useDashboard";

const ChimpChart = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [userPlan, setUserPlan] = useState<'free' | 'pro'>('free');

  const {
    fileId,
    analysis,
    kpis,
    visualizations,
    dashboard,
    isLoading,
    error,
    uploadFile,
    analyzeData,
    generateKPIs,
    generateVisualizations,
    generateDashboard,
    generatePDF,
    resetDashboard
  } = useDashboard();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      uploadFile(droppedFile, userPlan);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      uploadFile(selectedFile, userPlan);
    }
  };

  const handleAnalyze = async () => {
    if (!fileId) {
      return;
    }

    try {
      // Analysis is already done in uploadFile, but we can trigger it again if needed
      await analyzeData(userPlan);
    } catch (error) {
      console.error('Analysis failed:', error);
    }
  };

  const handleDownloadPDF = async () => {
    if (!dashboard) return;

    const pdfUrl = await generatePDF(userPlan);
    if (pdfUrl) {
      // Create download link
      const link = document.createElement('a');
      link.href = `http://localhost:3001${pdfUrl}`;
      link.download = `${dashboard.title || 'dashboard'}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <div className="flex-1 pt-24 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Create Your <span className="bg-gradient-primary bg-clip-text text-transparent">Dashboard</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Upload your data file and let AI do the rest
              </p>
            </div>

            <Card className="border-2 mb-6">
              <CardHeader>
                <CardTitle>Upload Your Data</CardTitle>
                <CardDescription>
                  Supported formats: CSV, XLS, XLSX
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-lg p-12 text-center transition-all duration-300 ${isDragging
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                    }`}
                >
                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    accept=".csv,.xls,.xlsx"
                    onChange={handleFileChange}
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <div className="flex flex-col items-center gap-4">
                      {fileId ? (
                        <>
                          <FileSpreadsheet className="h-16 w-16 text-primary" />
                          <div>
                            <p className="text-lg font-semibold">File uploaded successfully</p>
                            <p className="text-sm text-muted-foreground">
                              Ready for analysis
                            </p>
                          </div>
                          <Button variant="outline" type="button" onClick={resetDashboard}>
                            Choose Different File
                          </Button>
                        </>
                      ) : (
                        <>
                          <Upload className="h-16 w-16 text-muted-foreground" />
                          <div>
                            <p className="text-lg font-semibold mb-2">
                              Drop your file here or click to browse
                            </p>
                            <p className="text-sm text-muted-foreground">
                              CSV, XLS, or XLSX files accepted
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </label>
                </div>

                {error && (
                  <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-destructive" />
                      <p className="text-destructive font-medium">Error</p>
                    </div>
                    <p className="text-destructive/80 text-sm mt-1">{error}</p>
                  </div>
                )}

                {fileId && (
                  <div className="mt-6 space-y-4">
                    <div className="flex gap-2">
                      <Button
                        onClick={handleAnalyze}
                        disabled={isLoading}
                        className="flex-1 bg-gradient-primary hover:shadow-glow transition-all duration-300"
                        size="lg"
                      >
                        {isLoading ? (
                          <>
                            <Sparkles className="mr-2 h-5 w-5 animate-spin" />
                            {analysis ? 'Re-analyzing...' : 'Analyzing with Granite AI...'}
                          </>
                        ) : (
                          <>
                            <BarChart3 className="mr-2 h-5 w-5" />
                            {analysis ? 'Re-analyze Data' : 'Analyze & Generate Dashboard'}
                          </>
                        )}
                      </Button>
                    </div>

                    {analysis && (
                      <div className="space-y-4">
                        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                          <h3 className="font-semibold mb-2 text-green-800">✅ Analysis Complete!</h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="font-medium">Data Type:</span>
                              <p className="text-muted-foreground capitalize">{analysis.dataType}</p>
                            </div>
                            <div>
                              <span className="font-medium">Confidence:</span>
                              <p className="text-muted-foreground">{(analysis.confidence * 100).toFixed(1)}%</p>
                            </div>
                            <div>
                              <span className="font-medium">Processing Time:</span>
                              <p className="text-muted-foreground">{(analysis.processingTime / 1000).toFixed(1)}s</p>
                            </div>
                          </div>
                        </div>

                        {analysis.insights && analysis.insights.length > 0 && (
                          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <h4 className="font-semibold mb-3 text-blue-800">🧠 AI Insights</h4>
                            <div className="space-y-2">
                              {analysis.insights.slice(0, 3).map((insight, index) => (
                                <div key={index} className="text-sm">
                                  <span className="font-medium">{insight.title}:</span>
                                  <p className="text-muted-foreground">{insight.description}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {kpis && kpis.length > 0 && (
                          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                            <h4 className="font-semibold mb-3 text-purple-800">📊 Key Metrics</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                              {kpis.slice(0, 4).map((kpi, index) => (
                                <div key={index} className="flex justify-between">
                                  <span className="font-medium">{kpi.name}:</span>
                                  <span className="text-muted-foreground">{kpi.type}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {dashboard && (
                      <div className="space-y-4">
                        <div className="p-4 bg-muted/50 rounded-lg">
                          <h3 className="font-semibold mb-2">🎯 Dashboard Generated!</h3>
                          <p className="text-sm text-muted-foreground mb-3">
                            {dashboard.description}
                          </p>
                          <div className="flex gap-2">
                            <Button
                              onClick={handleDownloadPDF}
                              variant="outline"
                              size="sm"
                            >
                              <Download className="mr-2 h-4 w-4" />
                              Download PDF
                            </Button>
                            <Button
                              onClick={() => window.open(`/dashboard/${dashboard.id}`, '_blank')}
                              size="sm"
                            >
                              View Dashboard
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-2 bg-muted/30">
              <CardHeader>
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <CardTitle className="text-lg">Data Format Requirements</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• First row should contain column headers</li>
                  <li>• Remove any empty rows or columns</li>
                  <li>• Use consistent data formats (dates, numbers, text)</li>
                  <li>• Free tier supports up to 1000 rows</li>
                  <li>• Upgrade to Pro for unlimited rows and advanced features</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ChimpChart;
