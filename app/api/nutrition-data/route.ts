import { createServerClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    const { searchParams } = new URL(request.url)
    const day = searchParams.get("day")
    const mealType = searchParams.get("mealType")

    let query = supabase.from("nutrition_data").select("*").order("day", { ascending: true })

    if (day) {
      query = query.eq("day", day)
    }
    if (mealType) {
      query = query.eq("meal_type", mealType)
    }

    const { data, error } = await query

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to fetch nutrition data" }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
