import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                About <span className="bg-gradient-primary bg-clip-text text-transparent">Chimp Chart</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Making data visualization accessible to everyone
              </p>
            </div>

            <div className="space-y-8">
              <Card className="border-2">
                <CardContent className="pt-6">
                  <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    At Chimp Chart, we believe that everyone should be able to transform their data into 
                    beautiful, insightful visualizations—regardless of their technical expertise. We're 
                    democratizing data analytics by combining the power of AI with intuitive design, making 
                    it possible for anyone to create professional dashboards in seconds.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardContent className="pt-6">
                  <h2 className="text-2xl font-bold mb-4">The Story Behind Chimp Chart</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Chimp Chart was born from a simple frustration: creating data visualizations was either 
                    too complex (requiring coding skills) or too limited (with rigid templates that didn't 
                    fit your data). We knew there had to be a better way.
                  </p>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    By leveraging cutting-edge AI technology powered by Granite, we've built a platform that 
                    understands your data and automatically suggests the best ways to visualize it. No more 
                    struggling with chart types or spending hours designing dashboards—our AI does the heavy 
                    lifting for you.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    Whether you're a business analyst, researcher, student, or entrepreneur, Chimp Chart 
                    empowers you to tell compelling stories with your data.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardContent className="pt-6">
                  <h2 className="text-2xl font-bold mb-4">What Makes Us Different</h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg mb-2 text-primary">AI-Powered Intelligence</h3>
                      <p className="text-muted-foreground">
                        Our Granite AI doesn't just create charts—it understands your data, identifies 
                        meaningful patterns, and suggests KPIs that matter.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2 text-secondary">Zero Learning Curve</h3>
                      <p className="text-muted-foreground">
                        Upload your file, and you're done. No tutorials, no complex interfaces, no frustration. 
                        Just beautiful dashboards in seconds.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2 text-primary">Professional Results</h3>
                      <p className="text-muted-foreground">
                        Every dashboard is designed to impress, with modern aesthetics and clear, actionable 
                        insights that you can share with confidence.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 bg-gradient-hero">
                <CardContent className="pt-6">
                  <h2 className="text-2xl font-bold mb-4 text-primary-foreground">Get in Touch</h2>
                  <p className="text-primary-foreground/90 leading-relaxed mb-4">
                    We'd love to hear from you! Whether you have questions, feedback, or just want to say 
                    hello, feel free to reach out.
                  </p>
                  <p className="text-primary-foreground/90">
                    Email us at:{" "}
                    <a href="mailto:hello@chimpchart.com" className="font-semibold underline">
                      hello@chimpchart.com
                    </a>
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default About;
