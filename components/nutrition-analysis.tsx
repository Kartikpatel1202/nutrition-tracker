"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Calculator, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, RefreshCw } from "lucide-react"
import { getNutritionGrade, type NutrientAnalysis } from "@/lib/nutrient-calculator"

interface NutritionAnalysisProps {
  userProfile?: {
    age: number
    gender: "male" | "female" | "other"
    weight: number
    height: number
    activityLevel: "sedentary" | "light" | "moderate" | "active" | "very_active"
  }
}

export function NutritionAnalysis({ userProfile }: NutritionAnalysisProps) {
  const [analysis, setAnalysis] = useState<NutrientAnalysis | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Default profile for demo purposes
  const defaultProfile = {
    age: 22,
    gender: "male" as const,
    weight: 70,
    height: 175,
    activityLevel: "moderate" as const,
  }

  const profile = userProfile || defaultProfile

  const analyzeNutrition = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/analyze-nutrition", {
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
        setAnalysis(data.analysis)
      } else {
        setError(data.error || "Failed to analyze nutrition")
      }
    } catch (err) {
      setError("Network error occurred")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    analyzeNutrition()
  }, [])

  if (loading) {
    return (
      <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Nutrition Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin text-purple-600" />
            <span className="ml-2">Analyzing your nutrition...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-red-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Nutrition Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-2" />
            <p className="text-red-600">{error}</p>
            <Button onClick={analyzeNutrition} className="mt-4">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!analysis) return null

  const grade = getNutritionGrade(analysis.overallScore)

  return (
    <div className="space-y-6">
      {/* Overall Score */}
      <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Nutrition Analysis
          </CardTitle>
          <CardDescription>Based on your last 7 days of meals</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-3xl font-bold text-gray-900">{analysis.overallScore}%</div>
              <div className={`text-lg font-semibold ${grade.color}`}>Grade: {grade.grade}</div>
              <div className="text-sm text-muted-foreground">{grade.description}</div>
            </div>
            <div className="text-right">
              <Button onClick={analyzeNutrition} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
          <Progress value={analysis.overallScore} className="h-3" />
        </CardContent>
      </Card>

      {/* Nutrient Breakdown */}
      <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-blue-50">
        <CardHeader>
          <CardTitle>Nutrient Breakdown</CardTitle>
          <CardDescription>Your intake vs daily requirements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {Object.entries(analysis.percentages).map(([nutrient, percentage]) => {
              const isDeficient = percentage < 80
              const isExcess = percentage > 150
              const isOptimal = percentage >= 80 && percentage <= 150

              return (
                <div key={nutrient} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium capitalize">{nutrient.replace(/([A-Z])/g, " $1").trim()}</span>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={isOptimal ? "default" : "secondary"}
                        className={`text-xs ${
                          isDeficient
                            ? "bg-red-100 text-red-700"
                            : isExcess
                              ? "bg-orange-100 text-orange-700"
                              : "bg-green-100 text-green-700"
                        }`}
                      >
                        {percentage}%
                      </Badge>
                      {isOptimal && <CheckCircle className="h-4 w-4 text-green-500" />}
                      {isDeficient && <TrendingDown className="h-4 w-4 text-red-500" />}
                      {isExcess && <TrendingUp className="h-4 w-4 text-orange-500" />}
                    </div>
                  </div>
                  <Progress value={Math.min(percentage, 200)} className="h-2" />
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      {analysis.recommendations.length > 0 && (
        <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Recommendations
            </CardTitle>
            <CardDescription>Personalized suggestions to improve your nutrition</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {analysis.recommendations.map((recommendation, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{recommendation}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
