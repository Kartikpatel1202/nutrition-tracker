"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Calculator, Zap } from "lucide-react"
import { calculateMealScore, getScoreColorScheme, type MealData, type MealScore } from "@/lib/meal-scoring"

export function MealScorer() {
  const [meal, setMeal] = useState<Partial<MealData>>({
    dish_name: "",
    meal_type: "lunch",
    calories: 0,
    protein: 0,
    carbohydrates: 0,
    fats: 0,
    fibre: 0,
    sodium: 0,
    calcium: 0,
    iron: 0,
    vitamin_c: 0,
    folate: 0,
  })

  const [score, setScore] = useState<MealScore | null>(null)

  const handleInputChange = (field: keyof MealData, value: string | number) => {
    setMeal((prev) => ({
      ...prev,
      [field]: typeof value === "string" && field !== "dish_name" && field !== "meal_type" ? Number(value) : value,
    }))
  }

  const calculateScore = () => {
    if (meal.dish_name && meal.calories && meal.calories > 0) {
      const mealScore = calculateMealScore(meal as MealData)
      setScore(mealScore)
    }
  }

  const colorScheme = score ? getScoreColorScheme(score.overallScore) : null

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Input Form */}
      <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Meal Scorer
          </CardTitle>
          <CardDescription>Enter meal details to get a comprehensive suitability score</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="dish-name">Dish Name</Label>
              <Input
                id="dish-name"
                placeholder="e.g., Grilled Chicken Salad"
                value={meal.dish_name}
                onChange={(e) => handleInputChange("dish_name", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="meal-type">Meal Type</Label>
              <Select value={meal.meal_type} onValueChange={(value) => handleInputChange("meal_type", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="breakfast">Breakfast</SelectItem>
                  <SelectItem value="lunch">Lunch</SelectItem>
                  <SelectItem value="dinner">Dinner</SelectItem>
                  <SelectItem value="snack">Snack</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="calories">Calories</Label>
              <Input
                id="calories"
                type="number"
                placeholder="0"
                value={meal.calories || ""}
                onChange={(e) => handleInputChange("calories", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="protein">Protein (g)</Label>
              <Input
                id="protein"
                type="number"
                placeholder="0"
                value={meal.protein || ""}
                onChange={(e) => handleInputChange("protein", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="carbohydrates">Carbohydrates (g)</Label>
              <Input
                id="carbohydrates"
                type="number"
                placeholder="0"
                value={meal.carbohydrates || ""}
                onChange={(e) => handleInputChange("carbohydrates", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fats">Fats (g)</Label>
              <Input
                id="fats"
                type="number"
                placeholder="0"
                value={meal.fats || ""}
                onChange={(e) => handleInputChange("fats", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fibre">Fiber (g)</Label>
              <Input
                id="fibre"
                type="number"
                placeholder="0"
                value={meal.fibre || ""}
                onChange={(e) => handleInputChange("fibre", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sodium">Sodium (mg)</Label>
              <Input
                id="sodium"
                type="number"
                placeholder="0"
                value={meal.sodium || ""}
                onChange={(e) => handleInputChange("sodium", e.target.value)}
              />
            </div>
          </div>

          <Button onClick={calculateScore} className="w-full" disabled={!meal.dish_name || !meal.calories}>
            <Zap className="h-4 w-4 mr-2" />
            Calculate Score
          </Button>
        </CardContent>
      </Card>

      {/* Score Results */}
      {score && colorScheme && (
        <Card className={`shadow-lg border-2 ${colorScheme.bgColor} ${colorScheme.borderColor}`}>
          <CardHeader>
            <CardTitle className={`flex items-center justify-between ${colorScheme.textColor}`}>
              <span>Meal Score Results</span>
              <Badge className={`text-lg font-bold ${colorScheme.textColor} bg-white/80`}>{score.grade}</Badge>
            </CardTitle>
            <CardDescription className={colorScheme.textColor}>{meal.dish_name}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">Overall Score</span>
                <span className={`text-2xl font-bold ${colorScheme.textColor}`}>{score.overallScore}/100</span>
              </div>
              <Progress value={score.overallScore} className="h-3" />
              <div className={`text-sm ${colorScheme.textColor}`}>{score.recommendation}</div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-gray-700">Scoring Breakdown</h4>
              {Object.entries(score.factors).map(([factor, value]) => (
                <div key={factor} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="capitalize text-muted-foreground">{factor.replace(/([A-Z])/g, " $1").trim()}</span>
                    <span className="font-medium">{Math.round(value)}/100</span>
                  </div>
                  <Progress value={value} className="h-2" />
                </div>
              ))}
            </div>

            {score.strengths.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-semibold text-green-700">Strengths</h4>
                <ul className="space-y-1">
                  {score.strengths.map((strength, i) => (
                    <li key={i} className="text-sm text-green-600 flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {score.improvements.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-semibold text-orange-700">Areas for Improvement</h4>
                <ul className="space-y-1">
                  {score.improvements.map((improvement, i) => (
                    <li key={i} className="text-sm text-orange-600 flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                      {improvement}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
