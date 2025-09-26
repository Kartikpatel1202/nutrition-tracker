// Nutrient calculation engine for personalized nutrition analysis

export interface UserProfile {
  age: number
  gender: "male" | "female" | "other"
  weight: number // kg
  height: number // cm
  activityLevel: "sedentary" | "light" | "moderate" | "active" | "very_active"
  healthGoals?: string[]
  dietaryRestrictions?: string[]
}

export interface NutrientRequirements {
  calories: number
  protein: number // grams
  carbohydrates: number // grams
  fats: number // grams
  fiber: number // grams
  sodium: number // mg
  calcium: number // mg
  iron: number // mg
  vitaminC: number // mg
  folate: number // μg
}

export interface NutrientIntake {
  calories: number
  protein: number
  carbohydrates: number
  fats: number
  fiber: number
  sodium: number
  calcium: number
  iron: number
  vitaminC: number
  folate: number
}

export interface NutrientAnalysis {
  requirements: NutrientRequirements
  intake: NutrientIntake
  percentages: Record<string, number>
  deficiencies: string[]
  excesses: string[]
  recommendations: string[]
  overallScore: number
}

// Calculate Basal Metabolic Rate using Mifflin-St Jeor Equation
export function calculateBMR(profile: UserProfile): number {
  const { weight, height, age, gender } = profile

  if (gender === "male") {
    return 10 * weight + 6.25 * height - 5 * age + 5
  } else {
    return 10 * weight + 6.25 * height - 5 * age - 161
  }
}

// Calculate Total Daily Energy Expenditure
export function calculateTDEE(profile: UserProfile): number {
  const bmr = calculateBMR(profile)
  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  }

  return Math.round(bmr * activityMultipliers[profile.activityLevel])
}

// Calculate daily nutrient requirements
export function calculateNutrientRequirements(profile: UserProfile): NutrientRequirements {
  const calories = calculateTDEE(profile)
  const { weight, age, gender } = profile

  // Protein: 0.8-1.2g per kg body weight
  const protein = Math.round(weight * 1.0)

  // Carbohydrates: 45-65% of total calories (using 50%)
  const carbohydrates = Math.round((calories * 0.5) / 4)

  // Fats: 20-35% of total calories (using 30%)
  const fats = Math.round((calories * 0.3) / 9)

  // Fiber: 25g for women, 38g for men (adjusted for age)
  const fiber = gender === "male" ? (age > 50 ? 30 : 38) : age > 50 ? 21 : 25

  // Sodium: <2300mg per day
  const sodium = 2300

  // Calcium: varies by age and gender
  let calcium = 1000
  if (age > 50) calcium = gender === "female" ? 1200 : 1000
  if (age > 70) calcium = 1200

  // Iron: varies by age and gender
  let iron = gender === "male" ? 8 : 18
  if (age > 50) iron = 8

  // Vitamin C: 90mg for men, 75mg for women
  const vitaminC = gender === "male" ? 90 : 75

  // Folate: 400μg for adults
  const folate = 400

  return {
    calories,
    protein,
    carbohydrates,
    fats,
    fiber,
    sodium,
    calcium,
    iron,
    vitaminC,
    folate,
  }
}

// Analyze nutrient intake vs requirements
export function analyzeNutrientIntake(intake: NutrientIntake, requirements: NutrientRequirements): NutrientAnalysis {
  const percentages: Record<string, number> = {}
  const deficiencies: string[] = []
  const excesses: string[] = []
  const recommendations: string[] = []

  // Calculate percentages and identify issues
  Object.keys(requirements).forEach((nutrient) => {
    const key = nutrient as keyof NutrientRequirements
    const intakeValue = intake[key]
    const requirementValue = requirements[key]

    const percentage = Math.round((intakeValue / requirementValue) * 100)
    percentages[nutrient] = percentage

    // Identify deficiencies (< 80% of requirement)
    if (percentage < 80) {
      deficiencies.push(nutrient)
    }

    // Identify excesses (> 150% of requirement, except fiber and vitamins)
    if (percentage > 150 && !["fiber", "vitaminC", "folate"].includes(nutrient)) {
      excesses.push(nutrient)
    }
  })

  // Generate recommendations
  if (deficiencies.includes("protein")) {
    recommendations.push("Include more protein-rich foods like legumes, dairy, or lean meats")
  }

  if (deficiencies.includes("fiber")) {
    recommendations.push("Add more fruits, vegetables, and whole grains to increase fiber intake")
  }

  if (deficiencies.includes("calcium")) {
    recommendations.push("Include more dairy products, leafy greens, or fortified foods for calcium")
  }

  if (deficiencies.includes("iron")) {
    recommendations.push("Include iron-rich foods like spinach, lentils, or fortified cereals")
  }

  if (deficiencies.includes("vitaminC")) {
    recommendations.push("Add citrus fruits, berries, or bell peppers for vitamin C")
  }

  if (excesses.includes("sodium")) {
    recommendations.push("Reduce sodium intake by limiting processed foods and adding less salt")
  }

  if (excesses.includes("calories")) {
    recommendations.push("Consider portion control or increasing physical activity")
  }

  // Calculate overall nutrition score
  const adequateNutrients = Object.values(percentages).filter((p) => p >= 80 && p <= 150).length
  const totalNutrients = Object.keys(percentages).length
  const overallScore = Math.round((adequateNutrients / totalNutrients) * 100)

  return {
    requirements,
    intake,
    percentages,
    deficiencies,
    excesses,
    recommendations,
    overallScore,
  }
}

// Calculate nutrient intake from meal data
export function calculateNutrientIntake(meals: any[]): NutrientIntake {
  return meals.reduce(
    (total, meal) => ({
      calories: total.calories + (meal.calories || 0),
      protein: total.protein + (meal.protein || 0),
      carbohydrates: total.carbohydrates + (meal.carbohydrates || 0),
      fats: total.fats + (meal.fats || 0),
      fiber: total.fiber + (meal.fibre || 0),
      sodium: total.sodium + (meal.sodium || 0),
      calcium: total.calcium + (meal.calcium || 0),
      iron: total.iron + (meal.iron || 0),
      vitaminC: total.vitaminC + (meal.vitamin_c || 0),
      folate: total.folate + (meal.folate || 0),
    }),
    {
      calories: 0,
      protein: 0,
      carbohydrates: 0,
      fats: 0,
      fiber: 0,
      sodium: 0,
      calcium: 0,
      iron: 0,
      vitaminC: 0,
      folate: 0,
    },
  )
}

// Get nutrition grade based on score
export function getNutritionGrade(score: number): { grade: string; color: string; description: string } {
  if (score >= 90) {
    return { grade: "A+", color: "text-green-600", description: "Excellent nutrition" }
  } else if (score >= 80) {
    return { grade: "A", color: "text-green-500", description: "Very good nutrition" }
  } else if (score >= 70) {
    return { grade: "B", color: "text-blue-500", description: "Good nutrition" }
  } else if (score >= 60) {
    return { grade: "C", color: "text-yellow-500", description: "Fair nutrition" }
  } else if (score >= 50) {
    return { grade: "D", color: "text-orange-500", description: "Poor nutrition" }
  } else {
    return { grade: "F", color: "text-red-500", description: "Very poor nutrition" }
  }
}
