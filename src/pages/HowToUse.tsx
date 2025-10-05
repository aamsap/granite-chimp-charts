import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileUp, CheckCircle2, Sparkles, BarChart3, Download, Settings } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const HowToUse = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                How to Use <span className="bg-gradient-primary bg-clip-text text-transparent">Chimp Chart</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Transform your data into insights in just a few simple steps
              </p>
            </div>

            <div className="space-y-6">
              <Card className="border-2 hover:shadow-card transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center flex-shrink-0">
                      <FileUp className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl mb-2">Step 1: Upload Your File</CardTitle>
                      <CardDescription className="text-base">
                        Click the upload area or drag and drop your CSV or Excel file (.csv, .xls, .xlsx). 
                        Your file should have clear column headers in the first row.
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              <Card className="border-2 hover:shadow-card transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-secondary flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="h-6 w-6 text-secondary-foreground" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl mb-2">Step 2: Data Validation</CardTitle>
                      <CardDescription className="text-base">
                        Our system automatically validates your data structure. We check for proper headers, 
                        column formats, and data consistency. If there are any issues, we'll let you know 
                        exactly what needs to be fixed.
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              <Card className="border-2 hover:shadow-card transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center flex-shrink-0">
                      <Sparkles className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl mb-2">Step 3: AI Analysis</CardTitle>
                      <CardDescription className="text-base">
                        Our Granite AI analyzes your data to understand its structure and meaning. It identifies 
                        key metrics, patterns, and relationships in your data to suggest the most relevant KPIs 
                        and insights.
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              <Card className="border-2 hover:shadow-card transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-secondary flex items-center justify-center flex-shrink-0">
                      <BarChart3 className="h-6 w-6 text-secondary-foreground" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl mb-2">Step 4: Automatic Visualization</CardTitle>
                      <CardDescription className="text-base">
                        Based on the analysis, our AI selects the best chart types for your data—whether it's 
                        bar charts, line graphs, pie charts, or more complex visualizations. Each visualization 
                        is optimized to highlight the most important insights.
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              <Card className="border-2 hover:shadow-card transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center flex-shrink-0">
                      <Settings className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl mb-2">Step 5: Review Your Dashboard</CardTitle>
                      <CardDescription className="text-base">
                        Your custom dashboard is generated with a title, description, and all the visualizations. 
                        With a paid plan, you can customize titles, descriptions, select different chart types, 
                        and manage multiple dashboard pages.
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              <Card className="border-2 hover:shadow-card transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-secondary flex items-center justify-center flex-shrink-0">
                      <Download className="h-6 w-6 text-secondary-foreground" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl mb-2">Step 6: Export & Share</CardTitle>
                      <CardDescription className="text-base">
                        Print your dashboard or share it online with your team. 
                        Perfect for reports, presentations, or keeping stakeholders informed.
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </div>

            <div className="mt-12 p-6 bg-muted/50 rounded-lg border">
              <h3 className="text-xl font-semibold mb-3">Tips for Best Results</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>Ensure your data has clear, descriptive column headers</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>Remove any empty rows or columns before uploading</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>Use consistent data formats (dates, numbers, categories)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>Free tier works best with datasets under 1000 rows</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default HowToUse;
