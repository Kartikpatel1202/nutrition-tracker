import { MealScorer } from "@/components/meal-scorer"

export default function ScorerPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Meal Suitability Scorer
            </h1>
            <p className="text-lg text-muted-foreground">
              Get detailed nutritional analysis and suitability scores for any meal
            </p>
          </div>

          <MealScorer />
        </div>
      </div>
    </div>
  )
}
