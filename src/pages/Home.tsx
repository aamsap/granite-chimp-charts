import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Sparkles, FileUp, Download, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import heroBg from "@/assets/hero-bg.jpg";

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url(${heroBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-hero opacity-5" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              Transform Your Data into{" "}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Beautiful Dashboards
              </span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Upload your CSV or Excel file and let our AI create stunning visualizations and insights automatically. No coding required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/chimp-chart">
                <Button size="lg" className="bg-gradient-primary hover:shadow-glow transition-all duration-300">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/how-to-use">
                <Button size="lg" variant="outline">
                  See How It Works
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How Chimp Chart Works
            </h2>
            <p className="text-muted-foreground text-lg">
              From data to dashboard in four simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-2 hover:shadow-card transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center mb-4">
                  <FileUp className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle>Upload Your Data</CardTitle>
                <CardDescription>
                  Simply drag and drop your CSV or Excel file
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:shadow-card transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-gradient-secondary flex items-center justify-center mb-4">
                  <Sparkles className="h-6 w-6 text-secondary-foreground" />
                </div>
                <CardTitle>AI Analysis</CardTitle>
                <CardDescription>
                  Our AI analyzes your data and suggests KPIs
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:shadow-card transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle>Auto Visualization</CardTitle>
                <CardDescription>
                  Beautiful charts and graphs are generated automatically
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:shadow-card transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-gradient-secondary flex items-center justify-center mb-4">
                  <Download className="h-6 w-6 text-secondary-foreground" />
                </div>
                <CardTitle>Export & Share</CardTitle>
                <CardDescription>
                  Print your dashboard or share online
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Why Choose Chimp Chart?
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center space-y-2">
                <div className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  No Code
                </div>
                <p className="text-muted-foreground">
                  Create professional dashboards without any technical skills
                </p>
              </div>

              <div className="text-center space-y-2">
                <div className="text-4xl font-bold bg-gradient-secondary bg-clip-text text-transparent">
                  AI-Powered
                </div>
                <p className="text-muted-foreground">
                  Intelligent analysis suggests the best visualizations for your data
                </p>
              </div>

              <div className="text-center space-y-2">
                <div className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  Instant
                </div>
                <p className="text-muted-foreground">
                  Get your dashboard in seconds, not hours
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-hero">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground">
              Ready to Visualize Your Data?
            </h2>
            <p className="text-lg text-primary-foreground/90">
              Start creating beautiful dashboards today. No credit card required.
            </p>
            <Link to="/chimp-chart">
              <Button size="lg" variant="secondary" className="shadow-glow">
                Start Free Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
