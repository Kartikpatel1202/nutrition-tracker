import { RecommendationsDashboard } from "@/components/recommendations-dashboard"

export default function RecommendationsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Smart Nutrition Recommendations
            </h1>
            <p className="text-lg text-muted-foreground">
              Get personalized meal suggestions and nutritional guidance powered by AI
            </p>
          </div>

          <RecommendationsDashboard />
        </div>
      </div>
    </div>
  )
}
