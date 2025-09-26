import { calculateMealScore, type MealData } from "@/lib/meal-scoring"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { meal, userProfile } = await request.json()

    if (!meal) {
      return NextResponse.json({ error: "Meal data is required" }, { status: 400 })
    }

    // Calculate meal score
    const score = calculateMealScore(meal as MealData, userProfile)

    return NextResponse.json({
      score,
      meal: meal.dish_name,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Meal scoring error:", error)
    return NextResponse.json({ error: "Failed to score meal" }, { status: 500 })
  }
}
