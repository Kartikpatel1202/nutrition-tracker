import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    const supabase = await createClient()

    // Check if data already exists
    const { data: existingData, error: checkError } = await supabase.from("nutrition_data").select("id").limit(1)

    if (checkError) {
      return NextResponse.json({ error: "Failed to check existing data" }, { status: 500 })
    }

    if (existingData && existingData.length > 0) {
      return NextResponse.json({ message: "Sample data already loaded", count: 0 })
    }

    // Load sample data from the provided CSV
    const sampleData = [
      {
        day: "Sunday",
        meal_type: "Dinner",
        dish_name: "Gulab Jamun + Salad + Mint Butter Milk",
        calories: 758.73,
        carbohydrates: 42.09,
        protein: 11.55,
        fats: 61.26,
        free_sugar: 37.96,
        fibre: 2.06,
        sodium: 466.1,
        calcium: 368.59,
        iron: 1.6,
        vitamin_c: 28.26,
        folate: 104.19,
      },
      {
        day: "Monday",
        meal_type: "Breakfast",
        dish_name: "Poha + Tea",
        calories: 320.45,
        carbohydrates: 58.2,
        protein: 8.3,
        fats: 9.8,
        free_sugar: 12.5,
        fibre: 3.2,
        sodium: 380.5,
        calcium: 45.2,
        iron: 2.1,
        vitamin_c: 15.8,
        folate: 65.4,
      },
      {
        day: "Monday",
        meal_type: "Lunch",
        dish_name: "Dal Rice + Sabzi + Roti",
        calories: 485.6,
        carbohydrates: 72.4,
        protein: 18.9,
        fats: 12.3,
        free_sugar: 5.2,
        fibre: 8.7,
        sodium: 520.3,
        calcium: 125.8,
        iron: 4.2,
        vitamin_c: 22.5,
        folate: 145.6,
      },
      // Add more sample data...
    ]

    // Insert sample data
    const { data, error } = await supabase.from("nutrition_data").insert(sampleData)

    if (error) {
      console.error("Sample data loading error:", error)
      return NextResponse.json({ error: "Failed to load sample data" }, { status: 500 })
    }

    return NextResponse.json({
      message: "Sample data loaded successfully",
      count: sampleData.length,
    })
  } catch (error) {
    console.error("Sample data loading error:", error)
    return NextResponse.json({ error: "Failed to load sample data" }, { status: 500 })
  }
}
