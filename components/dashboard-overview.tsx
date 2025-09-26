"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Zap, Heart, Shield } from "lucide-react"

interface NutritionData {
  calories: number
  protein: number
  carbohydrates: number
  fats: number
}

interface DashboardOverviewProps {
  nutritionData: NutritionData[]
}

export function DashboardOverview({ nutritionData }: DashboardOverviewProps) {
  // Calculate averages
  const avgCalories =
    nutritionData.length > 0
      ? Math.round(nutritionData.reduce((sum, item) => sum + item.calories, 0) / nutritionData.length)
      : 0

  const avgProtein =
    nutritionData.length > 0
      ? Math.round(nutritionData.reduce((sum, item) => sum + item.protein, 0) / nutritionData.length)
      : 0

  const avgCarbs =
    nutritionData.length > 0
      ? Math.round(nutritionData.reduce((sum, item) => sum + item.carbohydrates, 0) / nutritionData.length)
      : 0

  const avgFats =
    nutritionData.length > 0
      ? Math.round(nutritionData.reduce((sum, item) => sum + item.fats, 0) / nutritionData.length)
      : 0

  const overviewCards = [
    {
      title: "Average Calories",
      value: `${avgCalories} kcal`,
      icon: Zap,
      color: "from-orange-500 to-red-500",
      bgColor: "bg-gradient-to-br from-orange-50 to-red-50",
      change: "+12%",
    },
    {
      title: "Average Protein",
      value: `${avgProtein}g`,
      icon: Heart,
      color: "from-emerald-500 to-green-500",
      bgColor: "bg-gradient-to-br from-emerald-50 to-green-50",
      change: "+8%",
    },
    {
      title: "Average Carbs",
      value: `${avgCarbs}g`,
      icon: TrendingUp,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-gradient-to-br from-blue-50 to-cyan-50",
      change: "+5%",
    },
    {
      title: "Average Fats",
      value: `${avgFats}g`,
      icon: Shield,
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-gradient-to-br from-purple-50 to-pink-50",
      change: "-3%",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {overviewCards.map((card, index) => (
        <Card key={index} className={`${card.bgColor} border-0 shadow-lg hover:shadow-xl transition-all duration-300`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">{card.title}</CardTitle>
            <div className={`p-2 rounded-lg bg-gradient-to-r ${card.color}`}>
              <card.icon className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{card.value}</div>
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <Badge variant="secondary" className="text-xs">
                {card.change}
              </Badge>
              <span>from last week</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
