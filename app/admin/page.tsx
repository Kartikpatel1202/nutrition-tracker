import { CsvUpload } from "@/components/csv-upload"
import { SampleDataLoader } from "@/components/sample-data-loader"







export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="container mx-auto py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-lg text-muted-foreground">Manage nutrition data and system configuration</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <SampleDataLoader />
            <CsvUpload />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="p-6 border rounded-lg bg-white/80 backdrop-blur-sm">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <span>Database Status</span>
              </h3>
              <p className="text-sm text-muted-foreground mb-4">Monitor database health and performance</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Tables:</span>
                  <span className="font-medium">3 active</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className="text-green-600 font-medium">Healthy</span>
                </div>
              </div>
            </div>

            <div className="p-6 border rounded-lg bg-white/80 backdrop-blur-sm">
              <h3 className="font-semibold mb-2">System Metrics</h3>
              <p className="text-sm text-muted-foreground mb-4">View system usage and analytics</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Active Users:</span>
                  <span className="font-medium">1,247</span>
                </div>
                <div className="flex justify-between">
                  <span>Meals Analyzed:</span>
                  <span className="font-medium">15,632</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
