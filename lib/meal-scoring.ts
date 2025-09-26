// Advanced meal suitability scoring system

export interface MealData {
  dish_name: string
  meal_type: string
  calories: number
  protein: number
  carbohydrates: number
  fats: number
  fibre: number
  sodium: number
  calcium: number
  iron: number
  vitamin_c: number
  folate: number
  free_sugar?: number
}

export interface UserProfile {
  age: number
  gender: "male" | "female" | "other"
  weight: number
  height: number
  activityLevel: "sedentary" | "light" | "moderate" | "active" | "very_active"
  healthGoals?: string[]
  dietaryRestrictions?: string[]
}

export interface ScoringFactors {
  nutritionalBalance: number
  portionAppropriate: number
  micronutrientDensity: number
  healthGoalAlignment: number
  dietaryRestrictionCompliance: number
  mealTimingAppropriate: number
}

export interface MealScore {
  overallScore: number
  grade: "A+" | "A" | "B+" | "B" | "C+" | "C" | "D" | "F"
  factors: ScoringFactors
  strengths: string[]
  improvements: string[]
  healthImpact: "excellent" | "good" | "fair" | "poor"
  recommendation: string
}

// Calculate macronutrient balance score (0-100)
function calculateMacroBalance(meal: MealData): number {
  const totalCalories = meal.calories
  if (totalCalories === 0) return 0

  const proteinCalories = meal.protein * 4
  const carbCalories = meal.carbohydrates * 4
  const fatCalories = meal.fats * 9

  const proteinPercent = (proteinCalories / totalCalories) * 100
  const carbPercent = (carbCalories / totalCalories) * 100
  const fatPercent = (fatCalories / totalCalories) * 100

  // Ideal ranges: Protein 15-25%, Carbs 45-65%, Fats 20-35%
  let score = 100

  // Protein scoring
  if (proteinPercent < 10 || proteinPercent > 35) score -= 20
  else if (proteinPercent < 15 || proteinPercent > 25) score -= 10

  // Carbohydrate scoring
  if (carbPercent < 35 || carbPercent > 75) score -= 20
  else if (carbPercent < 45 || carbPercent > 65) score -= 10

  // Fat scoring
  if (fatPercent < 15 || fatPercent > 45) score -= 20
  else if (fatPercent < 20 || fatPercent > 35) score -= 10

  return Math.max(0, score)
}

// Calculate portion appropriateness (0-100)
function calculatePortionScore(meal: MealData, mealType: string): number {
  const calories = meal.calories
  let idealRange: [number, number]

  switch (mealType.toLowerCase()) {
    case "breakfast":
      idealRange = [300, 500]
      break
    case "lunch":
      idealRange = [400, 700]
      break
    case "dinner":
      idealRange = [400, 600]
      break
    case "snack":
      idealRange = [100, 250]
      break
    default:
      idealRange = [300, 600]
  }

  const [min, max] = idealRange
  const optimal = (min + max) / 2

  if (calories >= min && calories <= max) {
    // Within ideal range, score based on how close to optimal
    const deviation = Math.abs(calories - optimal) / (optimal * 0.3)
    return Math.max(80, 100 - deviation * 20)
  } else if (calories < min) {
    // Too low
    const deficit = (min - calories) / min
    return Math.max(0, 80 - deficit * 80)
  } else {
    // Too high
    const excess = (calories - max) / max
    return Math.max(0, 80 - excess * 60)
  }
}

// Calculate micronutrient density score (0-100)
function calculateMicronutrientScore(meal: MealData): number {
  let score = 0
  const calories = meal.calories

  if (calories === 0) return 0

  // Fiber density (per 100 calories)
  const fiberDensity = (meal.fibre / calories) * 100
  if (fiberDensity >= 3) score += 20
  else if (fiberDensity >= 2) score += 15
  else if (fiberDensity >= 1) score += 10

  // Vitamin C density
  const vitaminCDensity = (meal.vitamin_c / calories) * 100
  if (vitaminCDensity >= 10) score += 15
  else if (vitaminCDensity >= 5) score += 10
  else if (vitaminCDensity >= 2) score += 5

  // Iron density
  const ironDensity = (meal.iron / calories) * 100
  if (ironDensity >= 1) score += 15
  else if (ironDensity >= 0.5) score += 10
  else if (ironDensity >= 0.2) score += 5

  // Calcium density
  const calciumDensity = (meal.calcium / calories) * 100
  if (calciumDensity >= 50) score += 15
  else if (calciumDensity >= 25) score += 10
  else if (calciumDensity >= 10) score += 5

  // Folate density
  const folateDensity = (meal.folate / calories) * 100
  if (folateDensity >= 20) score += 15
  else if (folateDensity >= 10) score += 10
  else if (folateDensity >= 5) score += 5

  // Sodium penalty (high sodium reduces score)
  const sodiumDensity = (meal.sodium / calories) * 100
  if (sodiumDensity > 300) score -= 20
  else if (sodiumDensity > 200) score -= 10

  // Free sugar penalty
  if (meal.free_sugar) {
    const sugarDensity = (meal.free_sugar / calories) * 100
    if (sugarDensity > 15) score -= 15
    else if (sugarDensity > 10) score -= 10
  }

  return Math.max(0, Math.min(100, score))
}

// Calculate health goal alignment (0-100)
function calculateHealthGoalAlignment(meal: MealData, healthGoals: string[] = []): number {
  if (healthGoals.length === 0) return 75 // Neutral score if no goals

  let score = 50
  const calories = meal.calories

  healthGoals.forEach((goal) => {
    switch (goal.toLowerCase()) {
      case "weight_loss":
        // Favor high protein, high fiber, lower calorie density
        if (meal.protein / calories > 0.15) score += 10
        if (meal.fibre / calories > 0.02) score += 10
        if (calories < 400) score += 5
        break

      case "muscle_gain":
        // Favor high protein
        if (meal.protein / calories > 0.2) score += 15
        if (meal.protein > 20) score += 10
        break

      case "heart_health":
        // Favor low sodium, high fiber
        if (meal.sodium < 400) score += 10
        if (meal.fibre > 5) score += 10
        if (meal.fats / calories < 0.3) score += 5
        break

      case "diabetes_management":
        // Favor low sugar, high fiber, balanced carbs
        if (meal.free_sugar && meal.free_sugar < 10) score += 10
        if (meal.fibre > 5) score += 10
        if (meal.carbohydrates / calories < 0.6) score += 5
        break

      case "bone_health":
        // Favor high calcium, vitamin D
        if (meal.calcium > 200) score += 15
        break
    }
  })

  return Math.max(0, Math.min(100, score))
}

// Calculate dietary restriction compliance (0-100)
function calculateDietaryCompliance(meal: MealData, restrictions: string[] = []): number {
  if (restrictions.length === 0) return 100

  let score = 100

  restrictions.forEach((restriction) => {
    switch (restriction.toLowerCase()) {
      case "low_sodium":
        if (meal.sodium > 600) score -= 30
        else if (meal.sodium > 400) score -= 15
        break

      case "low_sugar":
        if (meal.free_sugar && meal.free_sugar > 15) score -= 30
        else if (meal.free_sugar && meal.free_sugar > 10) score -= 15
        break

      case "high_protein":
        if (meal.protein < 15) score -= 20
        break

      case "low_fat":
        const fatPercent = (meal.fats * 9) / meal.calories
        if (fatPercent > 0.35) score -= 25
        else if (fatPercent > 0.25) score -= 10
        break
    }
  })

  return Math.max(0, score)
}

// Main meal scoring function
export function calculateMealScore(meal: MealData, userProfile?: UserProfile): MealScore {
  const factors: ScoringFactors = {
    nutritionalBalance: calculateMacroBalance(meal),
    portionAppropriate: calculatePortionScore(meal, meal.meal_type),
    micronutrientDensity: calculateMicronutrientScore(meal),
    healthGoalAlignment: calculateHealthGoalAlignment(meal, userProfile?.healthGoals),
    dietaryRestrictionCompliance: calculateDietaryCompliance(meal, userProfile?.dietaryRestrictions),
    mealTimingAppropriate: 85, // Default good score for timing
  }

  // Weighted average of all factors
  const weights = {
    nutritionalBalance: 0.25,
    portionAppropriate: 0.2,
    micronutrientDensity: 0.25,
    healthGoalAlignment: 0.15,
    dietaryRestrictionCompliance: 0.1,
    mealTimingAppropriate: 0.05,
  }

  const overallScore = Math.round(
    Object.entries(factors).reduce((sum, [key, value]) => {
      return sum + value * weights[key as keyof typeof weights]
    }, 0),
  )

  // Determine grade
  let grade: MealScore["grade"]
  if (overallScore >= 95) grade = "A+"
  else if (overallScore >= 90) grade = "A"
  else if (overallScore >= 85) grade = "B+"
  else if (overallScore >= 80) grade = "B"
  else if (overallScore >= 75) grade = "C+"
  else if (overallScore >= 70) grade = "C"
  else if (overallScore >= 60) grade = "D"
  else grade = "F"

  // Generate strengths and improvements
  const strengths: string[] = []
  const improvements: string[] = []

  if (factors.nutritionalBalance >= 80) strengths.push("Well-balanced macronutrients")
  else improvements.push("Improve macronutrient balance")

  if (factors.micronutrientDensity >= 70) strengths.push("Rich in essential vitamins and minerals")
  else improvements.push("Increase micronutrient density")

  if (factors.portionAppropriate >= 80) strengths.push("Appropriate portion size")
  else improvements.push("Adjust portion size")

  if (meal.fibre >= 5) strengths.push("High fiber content")
  if (meal.protein >= 15) strengths.push("Good protein content")
  if (meal.sodium < 400) strengths.push("Low sodium content")

  if (meal.sodium > 600) improvements.push("Reduce sodium content")
  if (meal.free_sugar && meal.free_sugar > 15) improvements.push("Reduce added sugar")

  // Health impact
  let healthImpact: MealScore["healthImpact"]
  if (overallScore >= 85) healthImpact = "excellent"
  else if (overallScore >= 75) healthImpact = "good"
  else if (overallScore >= 65) healthImpact = "fair"
  else healthImpact = "poor"

  // Generate recommendation
  let recommendation: string
  if (overallScore >= 90) {
    recommendation = "Excellent choice! This meal provides optimal nutrition for your health goals."
  } else if (overallScore >= 80) {
    recommendation = "Good meal choice with room for minor improvements in nutritional balance."
  } else if (overallScore >= 70) {
    recommendation = "Decent meal but consider adding more nutrients or adjusting portions."
  } else {
    recommendation = "Consider choosing a more nutritionally balanced alternative or modifying this meal."
  }

  return {
    overallScore,
    grade,
    factors,
    strengths,
    improvements,
    healthImpact,
    recommendation,
  }
}

// Get color scheme for score display
export function getScoreColorScheme(score: number): {
  bgColor: string
  textColor: string
  borderColor: string
  progressColor: string
} {
  if (score >= 90) {
    return {
      bgColor: "bg-gradient-to-br from-green-50 to-emerald-50",
      textColor: "text-green-700",
      borderColor: "border-green-200",
      progressColor: "bg-green-500",
    }
  } else if (score >= 80) {
    return {
      bgColor: "bg-gradient-to-br from-blue-50 to-cyan-50",
      textColor: "text-blue-700",
      borderColor: "border-blue-200",
      progressColor: "bg-blue-500",
    }
  } else if (score >= 70) {
    return {
      bgColor: "bg-gradient-to-br from-yellow-50 to-amber-50",
      textColor: "text-yellow-700",
      borderColor: "border-yellow-200",
      progressColor: "bg-yellow-500",
    }
  } else {
    return {
      bgColor: "bg-gradient-to-br from-red-50 to-rose-50",
      textColor: "text-red-700",
      borderColor: "border-red-200",
      progressColor: "bg-red-500",
    }
  }
}
