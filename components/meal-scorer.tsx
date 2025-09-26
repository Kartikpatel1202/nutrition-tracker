"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Calculator, Zap, X } from "lucide-react"
import { calculateMealScore, getScoreColorScheme, type MealData, type MealScore } from "@/lib/meal-scoring"
import dishData from "../public/dish-data.json"
// Type for the nutritional data from the JSON file
type DishNutrition = {
  "Calories (kcal)": number
  "Carbohydrates (g)": number
  "Protein (g)": number
  "Fats (g)": number
  "Free Sugar (g)": number
  "Fibre (g)": number
  "Sodium (mg)": number
  "Calcium (mg)": number
  "Iron (mg)": number
  "Vitamin C (mg)": number
  "Folate (µg)": number
}

// Type for the dish object
type Dish = {
  name: string
  nutrition: DishNutrition
}

export function MealScorer() {
  const [selectedDishes, setSelectedDishes] = useState<Dish[]>([])
  const [selectedDishName, setSelectedDishName] = useState<string>("")
  const [mealType, setMealType] = useState<string>("lunch")
  const [score, setScore] = useState<MealScore | null>(null)

  const dishNames = useMemo(() => Object.keys(dishData).sort(), [])

  // Calculate the total nutrients based on selected dishes
  const totalNutrients = useMemo(() => {
    const totals: MealData = {
      dish_name: selectedDishes.map(d => d.name).join(' + '),
      meal_type: mealType as MealData["meal_type"],
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
    }
    
    selectedDishes.forEach(dish => {
      totals.calories += dish.nutrition["Calories (kcal)"]
      totals.protein += dish.nutrition["Protein (g)"]
      totals.carbohydrates += dish.nutrition["Carbohydrates (g)"]
      totals.fats += dish.nutrition["Fats (g)"]
      totals.fibre += dish.nutrition["Fibre (g)"]
      totals.sodium += dish.nutrition["Sodium (mg)"]
      totals.calcium += dish.nutrition["Calcium (mg)"]
      totals.iron += dish.nutrition["Iron (mg)"]
      totals.vitamin_c += dish.nutrition["Vitamin C (mg)"]
      totals.folate += dish.nutrition["Folate (µg)"]
    })

    return totals
  }, [selectedDishes, mealType])

  const handleAddDish = () => {
    if (selectedDishName) {
      const dishNutrition = dishData[selectedDishName as keyof typeof dishData] as DishNutrition
      setSelectedDishes(prev => [
        ...prev,
        {
          name: selectedDishName,
          nutrition: dishNutrition
        }
      ])
      // Reset selected dish name for next selection
      setSelectedDishName("")
    }
  }

  const handleRemoveDish = (index: number) => {
    setSelectedDishes(prev => prev.filter((_, i) => i !== index))
  }

  const calculateScore = () => {
    if (selectedDishes.length > 0) {
      // Round the totals before calculating score
      const roundedTotals: MealData = {
        ...totalNutrients,
        calories: Number(totalNutrients.calories.toFixed(3)),
        protein: Number(totalNutrients.protein.toFixed(3)),
        carbohydrates: Number(totalNutrients.carbohydrates.toFixed(3)),
        fats: Number(totalNutrients.fats.toFixed(3)),
        fibre: Number(totalNutrients.fibre.toFixed(3)),
        sodium: Number(totalNutrients.sodium.toFixed(3)),
        calcium: Number(totalNutrients.calcium.toFixed(3)),
        iron: Number(totalNutrients.iron.toFixed(3)),
        vitamin_c: Number(totalNutrients.vitamin_c.toFixed(3)),
        folate: Number(totalNutrients.folate.toFixed(3))
      }
      const mealScore = calculateMealScore(roundedTotals as MealData)
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
          <CardDescription>Select dishes to get a comprehensive suitability score</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="dish-select">Select Dish</Label>
            <div className="flex items-center space-x-2">
              <Select value={selectedDishName} onValueChange={setSelectedDishName}>
                <SelectTrigger id="dish-select" className="flex-1">
                  <SelectValue placeholder="Select a dish" />
                </SelectTrigger>
                <SelectContent>
                  {dishNames.map((dishName) => (
                    <SelectItem key={dishName} value={dishName}>
                      {dishName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={handleAddDish} disabled={!selectedDishName}>
                Add
              </Button>
            </div>
          </div>
          
          {selectedDishes.length > 0 && (
            <div className="space-y-2">
              <Label>Selected Dishes</Label>
              <div className="flex flex-wrap gap-2">
                {selectedDishes.map((dish, index) => (
                  <Badge key={index} variant="secondary" className="pl-3 pr-1 py-1 text-sm flex items-center gap-1">
                    {dish.name}
                    <button onClick={() => handleRemoveDish(index)} className="ml-1 p-0.5 rounded-full hover:bg-gray-200">
                      <X className="h-3 w-3 text-gray-500" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="meal-type">Meal Type</Label>
              <Select value={mealType} onValueChange={setMealType}>
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
              <Label htmlFor="calories">Calories (kcal)</Label>
              <Input
                id="calories"
                type="number"
                value={totalNutrients.calories.toFixed(3)}
                readOnly
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="protein">Protein (g)</Label>
              <Input
                id="protein"
                type="number"
                value={totalNutrients.protein.toFixed(3)}
                readOnly
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="carbohydrates">Carbohydrates (g)</Label>
              <Input
                id="carbohydrates"
                type="number"
                value={totalNutrients.carbohydrates.toFixed(3)}
                readOnly
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fats">Fats (g)</Label>
              <Input
                id="fats"
                type="number"
                value={totalNutrients.fats.toFixed(3)}
                readOnly
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fibre">Fiber (g)</Label>
              <Input
                id="fibre"
                type="number"
                value={totalNutrients.fibre.toFixed(3)}
                readOnly
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sodium">Sodium (mg)</Label>
              <Input
                id="sodium"
                type="number"
                value={totalNutrients.sodium.toFixed(3)}
                readOnly
              />
            </div>
          </div>

          <Button onClick={calculateScore} className="w-full" disabled={selectedDishes.length === 0}>
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
            <CardDescription className={colorScheme.textColor}>
              {selectedDishes.map(d => d.name).join(' + ')}
            </CardDescription>
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