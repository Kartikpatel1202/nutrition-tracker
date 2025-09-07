import { createClient } from "@/lib/supabase/server"
import { generateRecommendations } from "@/lib/recommendation-engine"
import { calculateNutrientIntake } from "@/lib/nutrient-calculator"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { userProfile, dateRange } = await request.json()

    // Get available meals from the database
    const { data: availableMeals, error: mealsError } = await supabase.from("nutrition_data").select("*").limit(100)

    if (mealsError) {
      return NextResponse.json({ error: "Failed to fetch meal data" }, { status: 500 })
    }

    // Get user's recent meal intake for analysis
    const { data: recentMeals, error: recentError } = await supabase
      .from("nutrition_data")
      .select("*")
      .gte("created_at", dateRange?.start || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      .lte("created_at", dateRange?.end || new Date().toISOString())

    if (recentError) {
      return NextResponse.json({ error: "Failed to fetch recent meals" }, { status: 500 })
    }

    // Calculate recent nutrient intake
    const recentIntake = calculateNutrientIntake(recentMeals || [])

    // Generate recommendations
    const recommendations = generateRecommendations(
      availableMeals || [],
      userProfile,
      recentIntake,
      [], // Could include recent meal scores if available
    )

    return NextResponse.json({
      recommendations,
      analysisDate: new Date().toISOString(),
      mealsAnalyzed: recentMeals?.length || 0,
      availableMeals: availableMeals?.length || 0,
    })
  } catch (error) {
    console.error("Recommendations error:", error)
    return NextResponse.json({ error: "Failed to generate recommendations" }, { status: 500 })
  }
}
