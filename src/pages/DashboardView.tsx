import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Dashboard } from '@/components/dashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, Share2, AlertCircle, Printer } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { dashboardStorage } from '@/lib/dashboardStorage';
import { DashboardData } from '@/types';
import config from '@/config';

const DashboardView = () => {
  const { id } = useParams<{ id: string }>();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboard = async () => {
      if (id) {
        console.log('🔍 DashboardView: Looking for dashboard with ID:', id);
        try {
          const data = await dashboardStorage.getDashboard(id);
          if (data) {
            console.log('✅ DashboardView: Found dashboard data:', data);
            setDashboardData(data);
            setError(null);
          } else {
            console.log('❌ DashboardView: Dashboard not found for ID:', id);
            setError('Dashboard not found');
          }
        } catch (err) {
          console.error('❌ DashboardView: Error loading dashboard:', err);
          setError('Failed to load dashboard');
        }
        setLoading(false);
      }
    };

    loadDashboard();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 pt-24 pb-20 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 pt-24 pb-20 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Dashboard Not Found</h2>
            <p className="text-muted-foreground mb-4">
              {error || 'The requested dashboard could not be found.'}
            </p>
            <Link to="/chimp-chart">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Upload
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    // Implement share functionality
    console.log('Sharing dashboard...');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <div className="flex-1 pt-24 pb-20">
        <div className="container mx-auto px-4">
          {/* Header Actions */}
          <div className="flex items-center justify-between mb-6">
            <Link to="/chimp-chart">
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Upload
              </Button>
            </Link>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
              <Button size="sm" onClick={handlePrint}>
                <Printer className="mr-2 h-4 w-4" />
                Print Dashboard
              </Button>
            </div>
          </div>

          {/* Dashboard Content */}
          <Dashboard
            title={dashboardData.title}
            description={dashboardData.description}
            dataType={dashboardData.dataType}
            confidence={dashboardData.confidence}
            processingTime={dashboardData.processingTime}
            insights={dashboardData.insights}
            kpis={dashboardData.kpis}
            visualizations={dashboardData.visualizations}
            rawData={dashboardData.rawData}
          />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default DashboardView;