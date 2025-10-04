import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileSpreadsheet, AlertCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";

const ChimpChart = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

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
    validateAndSetFile(droppedFile);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      validateAndSetFile(selectedFile);
    }
  };

  const validateAndSetFile = (file: File) => {
    const validTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    
    if (validTypes.includes(file.type) || file.name.endsWith('.csv') || file.name.endsWith('.xls') || file.name.endsWith('.xlsx')) {
      setFile(file);
      toast({
        title: "File uploaded successfully",
        description: `${file.name} is ready to be analyzed.`,
      });
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload a CSV or Excel file (.csv, .xls, .xlsx)",
        variant: "destructive",
      });
    }
  };

  const handleAnalyze = () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please upload a file first.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Coming soon!",
      description: "Dashboard generation will be available once the backend is connected.",
    });
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
                  className={`border-2 border-dashed rounded-lg p-12 text-center transition-all duration-300 ${
                    isDragging
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
                      {file ? (
                        <>
                          <FileSpreadsheet className="h-16 w-16 text-primary" />
                          <div>
                            <p className="text-lg font-semibold">{file.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {(file.size / 1024).toFixed(2)} KB
                            </p>
                          </div>
                          <Button variant="outline" type="button">
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

                {file && (
                  <div className="mt-6">
                    <Button
                      onClick={handleAnalyze}
                      className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300"
                      size="lg"
                    >
                      Analyze & Generate Dashboard
                    </Button>
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
