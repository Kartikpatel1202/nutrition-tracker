"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Calendar, Target, TrendingUp } from "lucide-react"

export function WeeklyProgress() {
  // Mock data for weekly progress
  const weeklyGoals = [
    { name: "Protein Intake", current: 85, target: 100, unit: "g/day" },
    { name: "Fiber Intake", current: 22, target: 25, unit: "g/day" },
    { name: "Balanced Meals", current: 18, target: 21, unit: "meals" },
    { name: "Hydration", current: 6, target: 8, unit: "glasses" },
  ]

  const weekDays = [
    { day: "Mon", completed: true, score: 85 },
    { day: "Tue", completed: true, score: 92 },
    { day: "Wed", completed: true, score: 78 },
    { day: "Thu", completed: true, score: 88 },
    { day: "Fri", completed: true, score: 95 },
    { day: "Sat", completed: false, score: 0 },
    { day: "Sun", completed: false, score: 0 },
  ]

  return (
    <div className="space-y-6">
      {/* Weekly Goals */}
      <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-emerald-50">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Target className="h-5 w-5" />
            Weekly Goals
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {weeklyGoals.map((goal, index) => {
            const percentage = Math.round((goal.current / goal.target) * 100)
            return (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium text-gray-700">{goal.name}</span>
                  <Badge variant={percentage >= 100 ? "default" : "secondary"} className="text-xs">
                    {goal.current}/{goal.target} {goal.unit}
                  </Badge>
                </div>
                <Progress value={Math.min(percentage, 100)} className="h-2" />
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Weekly Calendar */}
      <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-blue-50">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            This Week
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {weekDays.map((day, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg text-center text-xs font-medium transition-colors ${
                  day.completed
                    ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                    : "bg-gray-100 text-gray-500 border border-gray-200"
                }`}
              >
                <div className="mb-1">{day.day}</div>
                {day.completed && <div className="text-xs font-bold">{day.score}%</div>}
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg">
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="h-4 w-4 text-emerald-600" />
              <span className="font-medium text-gray-700">Average Score:</span>
              <Badge className="bg-emerald-100 text-emerald-700">87.6%</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
