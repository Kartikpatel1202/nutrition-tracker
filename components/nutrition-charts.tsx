"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts"

interface NutritionData {
  day: string
  meal_type: string
  dish_name: string
  calories: number
  protein: number
  carbohydrates: number
  fats: number
  fibre: number
  sodium: number
}

interface NutritionChartsProps {
  nutritionData: NutritionData[]
}

export function NutritionCharts({ nutritionData }: NutritionChartsProps) {
  // Process data for charts
  const dailyNutrition = nutritionData.reduce(
    (acc, item) => {
      const day = item.day
      if (!acc[day]) {
        acc[day] = { day, calories: 0, protein: 0, carbohydrates: 0, fats: 0 }
      }
      acc[day].calories += item.calories
      acc[day].protein += item.protein
      acc[day].carbohydrates += item.carbohydrates
      acc[day].fats += item.fats
      return acc
    },
    {} as Record<string, any>,
  )

  const chartData = Object.values(dailyNutrition)

  // Macronutrient distribution
  const totalMacros = nutritionData.reduce(
    (acc, item) => ({
      protein: acc.protein + item.protein,
      carbohydrates: acc.carbohydrates + item.carbohydrates,
      fats: acc.fats + item.fats,
    }),
    { protein: 0, carbohydrates: 0, fats: 0 },
  )

  const macroData = [
    { name: "Protein", value: Math.round(totalMacros.protein), color: "#10b981" },
    { name: "Carbohydrates", value: Math.round(totalMacros.carbohydrates), color: "#3b82f6" },
    { name: "Fats", value: Math.round(totalMacros.fats), color: "#f59e0b" },
  ]

  // Meal type distribution
  const mealTypeData = nutritionData.reduce(
    (acc, item) => {
      const mealType = item.meal_type
      if (!acc[mealType]) {
        acc[mealType] = { meal_type: mealType, calories: 0, count: 0 }
      }
      acc[mealType].calories += item.calories
      acc[mealType].count += 1
      return acc
    },
    {} as Record<string, any>,
  )

  const mealChartData = Object.values(mealTypeData)

  return (
    <div className="space-y-6">
      {/* Daily Nutrition Trends */}
      <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900">Daily Nutrition Trends</CardTitle>
          <CardDescription>Track your daily calorie and macronutrient intake</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="day" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="calories" stroke="#ef4444" strokeWidth={3} name="Calories" />
              <Line type="monotone" dataKey="protein" stroke="#10b981" strokeWidth={3} name="Protein (g)" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Macronutrient Distribution */}
        <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-emerald-50">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-900">Macronutrient Distribution</CardTitle>
            <CardDescription>Your overall macro breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={macroData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {macroData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Meal Type Analysis */}
        <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-blue-50">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-900">Meal Type Analysis</CardTitle>
            <CardDescription>Calories by meal type</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={mealChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="meal_type" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="calories" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
