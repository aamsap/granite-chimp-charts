import { Dashboard } from '@/components/dashboard';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const VisualizationDemo = () => {
    // Sample data for demonstration
    const sampleData = [
        { Date: "2024-01-01", Product: "Widget A", Revenue: 1500, Quantity: 10, Customer_Type: "Premium", Region: "North" },
        { Date: "2024-01-02", Product: "Widget B", Revenue: 800, Quantity: 5, Customer_Type: "Standard", Region: "South" },
        { Date: "2024-01-03", Product: "Widget A", Revenue: 1200, Quantity: 8, Customer_Type: "Premium", Region: "East" },
        { Date: "2024-01-04", Product: "Widget C", Revenue: 1800, Quantity: 15, Customer_Type: "Standard", Region: "West" },
        { Date: "2024-01-05", Product: "Widget B", Revenue: 900, Quantity: 6, Customer_Type: "Premium", Region: "North" },
        { Date: "2024-01-06", Product: "Widget A", Revenue: 2000, Quantity: 12, Customer_Type: "Premium", Region: "South" },
        { Date: "2024-01-07", Product: "Widget C", Revenue: 1600, Quantity: 14, Customer_Type: "Standard", Region: "East" },
        { Date: "2024-01-08", Product: "Widget B", Revenue: 1100, Quantity: 7, Customer_Type: "Premium", Region: "West" },
        { Date: "2024-01-09", Product: "Widget A", Revenue: 1300, Quantity: 9, Customer_Type: "Standard", Region: "North" },
        { Date: "2024-01-10", Product: "Widget C", Revenue: 1900, Quantity: 16, Customer_Type: "Premium", Region: "South" }
    ];

    const demoDashboard = {
        title: "Chimp Chart - Visualization Templates Demo",
        description: "Demonstrasi semua template visualisasi yang tersedia di Chimp Chart, powered by Granite AI.",
        dataType: "financial",
        confidence: 0.95,
        processingTime: 1800,
        insights: [
            {
                type: "Revenue Analysis",
                title: "Revenue Growth Trend",
                description: "Analisis menunjukkan tren pertumbuhan revenue yang positif dengan peningkatan 15% dari bulan sebelumnya.",
                confidence: 0.92
            },
            {
                type: "Product Performance",
                title: "Product Mix Analysis",
                description: "Widget A dan Widget C menunjukkan performa terbaik dengan kontribusi 60% dari total revenue.",
                confidence: 0.88
            },
            {
                type: "Customer Segmentation",
                title: "Customer Value Analysis",
                description: "Customer Premium memberikan kontribusi revenue 65% lebih tinggi dibanding Standard customers.",
                confidence: 0.90
            }
        ],
        kpis: [
            {
                id: "total_revenue",
                name: "Total Revenue",
                description: "Total pendapatan dari semua produk",
                type: "sum",
                column: "Revenue",
                category: "financial"
            },
            {
                id: "avg_revenue",
                name: "Average Revenue",
                description: "Rata-rata pendapatan per transaksi",
                type: "average",
                column: "Revenue",
                category: "statistical"
            },
            {
                id: "total_quantity",
                name: "Total Quantity",
                description: "Total jumlah produk terjual",
                type: "sum",
                column: "Quantity",
                category: "financial"
            },
            {
                id: "record_count",
                name: "Total Records",
                description: "Jumlah total transaksi",
                type: "count",
                column: "Date",
                category: "categorical"
            }
        ],
        visualizations: [
            {
                id: "revenue_trend",
                type: "line",
                title: "Revenue Trend Over Time",
                description: "Tren pendapatan dari waktu ke waktu",
                xAxis: "Date",
                yAxis: "Revenue",
                data: sampleData,
                recommended: true
            },
            {
                id: "product_distribution",
                type: "pie",
                title: "Product Distribution by Revenue",
                description: "Distribusi produk berdasarkan revenue",
                dataKey: "Revenue",
                xAxis: "Product",
                data: [
                    { Product: "Widget A", Revenue: 6000 },
                    { Product: "Widget B", Revenue: 2800 },
                    { Product: "Widget C", Revenue: 5300 }
                ],
                recommended: true
            },
            {
                id: "revenue_by_date",
                type: "bar",
                title: "Daily Revenue",
                description: "Pendapatan harian",
                xAxis: "Date",
                yAxis: "Revenue",
                data: sampleData,
                recommended: false
            },
            {
                id: "quantity_area",
                type: "area",
                title: "Quantity Sold Over Time",
                description: "Jumlah produk terjual dari waktu ke waktu",
                xAxis: "Date",
                yAxis: "Quantity",
                data: sampleData,
                recommended: true
            },
            {
                id: "revenue_vs_quantity",
                type: "scatter",
                title: "Revenue vs Quantity Correlation",
                description: "Korelasi antara revenue dan quantity",
                xAxis: "Quantity",
                yAxis: "Revenue",
                data: sampleData,
                recommended: false
            }
        ],
        rawData: sampleData
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />

            <div className="flex-1 pt-24 pb-20">
                <div className="container mx-auto px-4">
                    <div className="mb-8 text-center">
                        <h1 className="text-4xl font-bold mb-4">📊 Template Visualisasi Chimp Chart</h1>
                        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                            Lihat semua template visualisasi yang tersedia: KPI Cards, Bar Charts, Line Charts,
                            Pie Charts, Area Charts, dan Scatter Charts. Semua didukung oleh Granite AI untuk
                            analisis data yang cerdas.
                        </p>
                    </div>

                    <Dashboard
                        title={demoDashboard.title}
                        description={demoDashboard.description}
                        dataType={demoDashboard.dataType}
                        confidence={demoDashboard.confidence}
                        processingTime={demoDashboard.processingTime}
                        insights={demoDashboard.insights}
                        kpis={demoDashboard.kpis}
                        visualizations={demoDashboard.visualizations}
                        rawData={demoDashboard.rawData}
                    />
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default VisualizationDemo;
