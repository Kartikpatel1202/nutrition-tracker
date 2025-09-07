"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Utensils, TrendingUp, Award, AlertCircle, ChevronDown, ChevronUp } from "lucide-react"
import { calculateMealScore, getScoreColorScheme, type MealData } from "@/lib/meal-scoring"
import { useState } from "react"

interface Meal extends MealData {
  id?: string
  day: string
}

interface MealCardsProps {
  meals: Meal[]
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

export function MealCards({ meals, userProfile }: MealCardsProps) {
  const [expandedMeal, setExpandedMeal] = useState<number | null>(null)

  if (meals.length === 0) {
    return (
      <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Utensils className="h-5 w-5" />
            Today's Meals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">No meal data available for today</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Utensils className="h-5 w-5" />
          Today's Meals
          <Badge variant="secondary" className="ml-auto">
            {meals.length} meals
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {meals.map((meal, index) => {
            const mealScore = calculateMealScore(meal, userProfile)
            const colorScheme = getScoreColorScheme(mealScore.overallScore)
            const isExpanded = expandedMeal === index

            return (
              <Card
                key={index}
                className={`${colorScheme.bgColor} ${colorScheme.borderColor} border-2 shadow-sm hover:shadow-md transition-all duration-300`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      {meal.meal_type}
                    </Badge>
                    <div className="flex items-center gap-2">
                      <Badge className={`text-xs font-bold ${colorScheme.textColor} bg-white/80`}>
                        {mealScore.grade}
                      </Badge>
                      <Badge className={`text-xs ${colorScheme.textColor} bg-white/60`}>
                        {mealScore.overallScore}/100
                      </Badge>
                    </div>
                  </div>
                  <CardTitle className="text-sm font-medium text-balance leading-tight">{meal.dish_name}</CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Suitability Score</span>
                      <div className="flex items-center gap-1">
                        {mealScore.healthImpact === "excellent" && <Award className="h-3 w-3 text-green-600" />}
                        {mealScore.healthImpact === "good" && <TrendingUp className="h-3 w-3 text-blue-600" />}
                        {mealScore.healthImpact === "fair" && <AlertCircle className="h-3 w-3 text-yellow-600" />}
                        {mealScore.healthImpact === "poor" && <AlertCircle className="h-3 w-3 text-red-600" />}
                        <span className={`font-medium capitalize ${colorScheme.textColor}`}>
                          {mealScore.healthImpact}
                        </span>
                      </div>
                    </div>

                    <Progress value={mealScore.overallScore} className="h-3" />

                    <div className="text-xs text-muted-foreground">{mealScore.recommendation}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Calories:</span>
                      <span className="font-medium">{Math.round(meal.calories)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Protein:</span>
                      <span className="font-medium">{Math.round(meal.protein)}g</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Carbs:</span>
                      <span className="font-medium">{Math.round(meal.carbohydrates)}g</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Fats:</span>
                      <span className="font-medium">{Math.round(meal.fats)}g</span>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setExpandedMeal(isExpanded ? null : index)}
                    className="w-full text-xs"
                  >
                    {isExpanded ? (
                      <>
                        Hide Details <ChevronUp className="h-3 w-3 ml-1" />
                      </>
                    ) : (
                      <>
                        View Details <ChevronDown className="h-3 w-3 ml-1" />
                      </>
                    )}
                  </Button>

                  {isExpanded && (
                    <div className="space-y-3 pt-2 border-t border-white/50">
                      <div className="space-y-2">
                        <h4 className="text-xs font-semibold text-gray-700">Scoring Breakdown</h4>
                        {Object.entries(mealScore.factors).map(([factor, score]) => (
                          <div key={factor} className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="capitalize text-muted-foreground">
                                {factor.replace(/([A-Z])/g, " $1").trim()}
                              </span>
                              <span className="font-medium">{Math.round(score)}/100</span>
                            </div>
                            <Progress value={score} className="h-1" />
                          </div>
                        ))}
                      </div>

                      {mealScore.strengths.length > 0 && (
                        <div className="space-y-1">
                          <h4 className="text-xs font-semibold text-green-700">Strengths</h4>
                          <ul className="space-y-1">
                            {mealScore.strengths.map((strength, i) => (
                              <li key={i} className="text-xs text-green-600 flex items-start gap-1">
                                <div className="w-1 h-1 bg-green-500 rounded-full mt-1.5 flex-shrink-0" />
                                {strength}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {mealScore.improvements.length > 0 && (
                        <div className="space-y-1">
                          <h4 className="text-xs font-semibold text-orange-700">Improvements</h4>
                          <ul className="space-y-1">
                            {mealScore.improvements.map((improvement, i) => (
                              <li key={i} className="text-xs text-orange-600 flex items-start gap-1">
                                <div className="w-1 h-1 bg-orange-500 rounded-full mt-1.5 flex-shrink-0" />
                                {improvement}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
