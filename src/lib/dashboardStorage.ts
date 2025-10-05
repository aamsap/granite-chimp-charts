// Dashboard storage with temp file backend integration
// Uses in-memory storage with localStorage fallback and temp file persistence

interface DashboardData {
    id: string;
    title: string;
    description: string;
    dataType: string;
    confidence: number;
    processingTime: number;
    timestamp: string;
    insights: any[];
    kpis: any[];
    visualizations: any[];
    rawData: any[];
}

class DashboardStorage {
    private static instance: DashboardStorage;
    private dashboards: Map<string, DashboardData> = new Map();

    static getInstance(): DashboardStorage {
        if (!DashboardStorage.instance) {
            DashboardStorage.instance = new DashboardStorage();
        }
        return DashboardStorage.instance;
    }

    async saveDashboard(id: string, data: DashboardData): Promise<void> {
        this.dashboards.set(id, data);

        // Save to localStorage as backup
        try {
            localStorage.setItem(`dashboard_${id}`, JSON.stringify(data));
            console.log(`✅ Dashboard saved to localStorage with ID: ${id}`);
        } catch (error) {
            console.warn('Failed to save dashboard to localStorage:', error);
        }

        // Save to temp storage backend
        try {
            const response = await fetch('http://localhost:3001/api/temp/save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    fileId: id,
                    dashboardData: data
                })
            });

            if (response.ok) {
                console.log(`✅ Dashboard saved to temp storage with ID: ${id}`);
            } else {
                console.warn('Failed to save dashboard to temp storage');
            }
        } catch (error) {
            console.warn('Failed to save dashboard to temp storage:', error);
        }

        console.log(`✅ Dashboard saved with ID: ${id}`);
        console.log(`📊 Dashboard data:`, {
            title: data.title,
            dataType: data.dataType,
            insightsCount: data.insights.length,
            kpisCount: data.kpis.length,
            visualizationsCount: data.visualizations.length
        });
        console.log(`🗂️ Total dashboards stored: ${this.dashboards.size}`);
    }

    async getDashboard(id: string): Promise<DashboardData | null> {
        console.log(`🔍 Looking for dashboard with ID: ${id}`);
        console.log(`🗂️ Available dashboard IDs:`, Array.from(this.dashboards.keys()));

        // Try in-memory storage first
        let dashboard = this.dashboards.get(id);
        if (dashboard) {
            console.log(`✅ Dashboard retrieved from memory with ID: ${id}`);
            return dashboard;
        }

        // Fallback to localStorage
        try {
            const storedData = localStorage.getItem(`dashboard_${id}`);
            if (storedData) {
                dashboard = JSON.parse(storedData);
                console.log(`✅ Dashboard retrieved from localStorage with ID: ${id}`);
                // Restore to memory for future access
                this.dashboards.set(id, dashboard);
                return dashboard;
            }
        } catch (error) {
            console.warn('Failed to retrieve dashboard from localStorage:', error);
        }

        // Fallback to temp storage backend
        try {
            const response = await fetch(`http://localhost:3001/api/temp/get/${id}`);
            if (response.ok) {
                const result = await response.json();
                dashboard = result.data;
                console.log(`✅ Dashboard retrieved from temp storage with ID: ${id}`);
                // Restore to memory for future access
                this.dashboards.set(id, dashboard);
                return dashboard;
            }
        } catch (error) {
            console.warn('Failed to retrieve dashboard from temp storage:', error);
        }

        console.log(`❌ Dashboard not found with ID: ${id}`);
        return null;
    }

    getAllDashboards(): DashboardData[] {
        return Array.from(this.dashboards.values());
    }

    deleteDashboard(id: string): boolean {
        return this.dashboards.delete(id);
    }
}

export const dashboardStorage = DashboardStorage.getInstance();
export type { DashboardData };

