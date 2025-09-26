import { createClient } from "@/lib/supabase/server"
import {
  calculateNutrientRequirements,
  calculateNutrientIntake,
  analyzeNutrientIntake,
  type UserProfile,
} from "@/lib/nutrient-calculator"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { userProfile, dateRange } = await request.json()

    // Get user's meal data for the specified date range
    const { data: meals, error: mealsError } = await supabase
      .from("nutrition_data")
      .select("*")
      .gte("created_at", dateRange?.start || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      .lte("created_at", dateRange?.end || new Date().toISOString())

    if (mealsError) {
      return NextResponse.json({ error: "Failed to fetch meal data" }, { status: 500 })
    }

    // Calculate requirements based on user profile
    const requirements = calculateNutrientRequirements(userProfile as UserProfile)

    // Calculate actual intake from meals
    const intake = calculateNutrientIntake(meals || [])

    // Perform analysis
    const analysis = analyzeNutrientIntake(intake, requirements)

    return NextResponse.json({
      analysis,
      mealCount: meals?.length || 0,
      dateRange: {
        start: dateRange?.start || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        end: dateRange?.end || new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("Nutrition analysis error:", error)
    return NextResponse.json({ error: "Failed to analyze nutrition" }, { status: 500 })
  }
}
