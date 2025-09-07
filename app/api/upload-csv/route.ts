import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Parse CSV content
    const text = await file.text()
    const lines = text.split("\n")
    const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""))

    const nutritionData = []

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue

      const values = line.split(",").map((v) => v.trim().replace(/"/g, ""))

      if (values.length >= 11) {
        nutritionData.push({
          day: values[0],
          meal_type: values[1],
          dish_name: values[2],
          calories: Number.parseFloat(values[3]) || 0,
          carbohydrates: Number.parseFloat(values[4]) || 0,
          protein: Number.parseFloat(values[5]) || 0,
          fats: Number.parseFloat(values[6]) || 0,
          free_sugar: Number.parseFloat(values[7]) || 0,
          fibre: Number.parseFloat(values[8]) || 0,
          sodium: Number.parseFloat(values[9]) || 0,
          calcium: Number.parseFloat(values[10]) || 0,
          iron: Number.parseFloat(values[11]) || 0,
          vitamin_c: Number.parseFloat(values[12]) || 0,
          folate: Number.parseFloat(values[13]) || 0,
        })
      }
    }

    // Insert data into Supabase
    const { data, error } = await supabase.from("nutrition_data").insert(nutritionData)

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: "Failed to insert data" }, { status: 500 })
    }

    return NextResponse.json({
      message: "CSV uploaded successfully",
      count: nutritionData.length,
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Failed to process CSV" }, { status: 500 })
  }
}
