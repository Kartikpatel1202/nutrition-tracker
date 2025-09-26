"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Lightbulb, Target, Award, RefreshCw, Calendar, ChefHat, Heart, AlertTriangle } from "lucide-react"
import type { RecommendationSet } from "@/lib/recommendation-engine"

interface RecommendationsDashboardProps {
  userProfile?: {
    age: number
    gender: "male" | "female" | "other"
    weight: number
    height: number
    activityLevel: "sedentary" | "light" | "moderate" | "active" | "very_active"
    healthGoals?: string[]
    dietaryRestrictions?: string[]
  }
}

export function RecommendationsDashboard({ userProfile }: RecommendationsDashboardProps) {
  const [recommendations, setRecommendations] = useState<RecommendationSet | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Default profile for demo
  const defaultProfile = {
    age: 22,
    gender: "male" as const,
    weight: 70,
    height: 175,
    activityLevel: "moderate" as const,
    healthGoals: ["muscle_gain", "heart_health"],
    dietaryRestrictions: ["low_sodium"],
  }

  const profile = userProfile || defaultProfile

  const fetchRecommendations = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/recommendations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userProfile: profile,
          dateRange: {
            start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            end: new Date().toISOString(),
          },
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setRecommendations(data.recommendations)
      } else {
        setError(data.error || "Failed to fetch recommendations")
      }
    } catch (err) {
      setError("Network error occurred")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRecommendations()
  }, [])

  if (loading) {
    return (
      <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-purple-50">
        <CardContent className="flex items-center justify-center py-12">
          <RefreshCw className="h-6 w-6 animate-spin text-purple-600 mr-2" />
          <span>Generating personalized recommendations...</span>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-red-50">
        <CardContent className="text-center py-12">
          <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchRecommendations}>Try Again</Button>
        </CardContent>
      </Card>
    )
  }

  if (!recommendations) return null

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-50 to-blue-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Lightbulb className="h-6 w-6" />
                Personalized Recommendations
              </CardTitle>
              <CardDescription>AI-powered nutrition guidance based on your profile and recent meals</CardDescription>
            </div>
            <Button onClick={fetchRecommendations} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="meals" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="meals">Meal Recommendations</TabsTrigger>
          <TabsTrigger value="plan">Daily Plan</TabsTrigger>
          <TabsTrigger value="gaps">Nutritional Gaps</TabsTrigger>
          <TabsTrigger value="advice">Guidance</TabsTrigger>
        </TabsList>

        {/* Meal Recommendations */}
        <TabsContent value="meals" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {recommendations.mealRecommendations.map((rec, index) => (
              <Card key={index} className="shadow-lg border-0 bg-gradient-to-br from-white to-green-50">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      {rec.meal.meal_type}
                    </Badge>
                    <Badge className="bg-green-100 text-green-700 text-xs font-bold">{rec.score}/100</Badge>
                  </div>
                  <CardTitle className="text-sm font-medium text-balance">{rec.meal.dish_name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-xs text-muted-foreground">{rec.reason}</div>

                  <Progress value={rec.score} className="h-2" />

                  {rec.benefits.length > 0 && (
                    <div className="space-y-1">
                      <h5 className="text-xs font-semibold text-green-700">Benefits</h5>
                      <ul className="space-y-1">
                        {rec.benefits.slice(0, 2).map((benefit, i) => (
                          <li key={i} className="text-xs text-green-600 flex items-start gap-1">
                            <div className="w-1 h-1 bg-green-500 rounded-full mt-1.5 flex-shrink-0" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {rec.nutritionalHighlights.length > 0 && (
                    <div className="space-y-1">
                      <h5 className="text-xs font-semibold text-blue-700">Nutrition Highlights</h5>
                      <div className="flex flex-wrap gap-1">
                        {rec.nutritionalHighlights.slice(0, 2).map((highlight, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {highlight}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Daily Meal Plan */}
        <TabsContent value="plan" className="space-y-4">
          {recommendations.dailyMealPlan ? (
            <div className="space-y-6">
              <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-blue-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Optimized Daily Meal Plan
                  </CardTitle>
                  <CardDescription>
                    Plan Score: {recommendations.dailyMealPlan.planScore}/100 |{" "}
                    {recommendations.dailyMealPlan.balanceAnalysis}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Progress value={recommendations.dailyMealPlan.planScore} className="mb-4" />

                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {[
                      { label: "Breakfast", meal: recommendations.dailyMealPlan.breakfast },
                      { label: "Lunch", meal: recommendations.dailyMealPlan.lunch },
                      { label: "Dinner", meal: recommendations.dailyMealPlan.dinner },
                      ...(recommendations.dailyMealPlan.snack
                        ? [{ label: "Snack", meal: recommendations.dailyMealPlan.snack }]
                        : []),
                    ].map(({ label, meal }) => (
                      <Card key={label} className="bg-white/80">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">{label}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="text-xs font-medium">{meal.meal.dish_name}</div>
                          <Badge className="text-xs">{meal.score}/100</Badge>
                          <div className="text-xs text-muted-foreground">
                            {Math.round(meal.meal.calories)} cal | {Math.round(meal.meal.protein)}g protein
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="shadow-lg border-0">
              <CardContent className="text-center py-12">
                <ChefHat className="h-8 w-8 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Unable to generate a complete daily meal plan with available options
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Nutritional Gaps */}
        <TabsContent value="gaps" className="space-y-4">
          {recommendations.nutritionalGaps.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {recommendations.nutritionalGaps.map((gap, index) => (
                <Card
                  key={index}
                  className={`shadow-lg border-0 ${
                    gap.priority === "high"
                      ? "bg-gradient-to-br from-red-50 to-orange-50"
                      : gap.priority === "medium"
                        ? "bg-gradient-to-br from-yellow-50 to-amber-50"
                        : "bg-gradient-to-br from-blue-50 to-cyan-50"
                  }`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm capitalize">
                        {gap.nutrient.replace(/([A-Z])/g, " $1").trim()}
                      </CardTitle>
                      <Badge
                        className={`text-xs ${
                          gap.priority === "high"
                            ? "bg-red-100 text-red-700"
                            : gap.priority === "medium"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {gap.priority} priority
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Current vs Recommended</span>
                        <span>{Math.round(gap.deficitPercentage)}% deficit</span>
                      </div>
                      <Progress value={100 - gap.deficitPercentage} className="h-2" />
                      <div className="text-xs text-muted-foreground">
                        {Math.round(gap.currentIntake)} / {Math.round(gap.recommendedIntake)}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <h5 className="text-xs font-semibold">Good Sources</h5>
                      <div className="flex flex-wrap gap-1">
                        {gap.foodSources.slice(0, 4).map((source, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {source}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-emerald-50">
              <CardContent className="text-center py-12">
                <Award className="h-8 w-8 text-green-600 mx-auto mb-4" />
                <h3 className="font-semibold text-green-700 mb-2">Excellent Nutrition!</h3>
                <p className="text-green-600">No significant nutritional gaps detected in your recent intake.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Guidance & Goals */}
        <TabsContent value="advice" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            {/* General Advice */}
            <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-green-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Personalized Advice
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {recommendations.generalAdvice.map((advice, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-gray-700">{advice}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Weekly Goals */}
            <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-purple-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Weekly Goals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {recommendations.weeklyGoals.map((goal, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-gray-700">{goal}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
