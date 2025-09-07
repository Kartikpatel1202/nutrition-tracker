// Intelligent meal recommendation system

import { calculateMealScore, type MealData } from "./meal-scoring"
import {
  analyzeNutrientIntake,
  calculateNutrientRequirements,
  type UserProfile,
  type NutrientIntake,
} from "./nutrient-calculator"

export interface MealRecommendation {
  meal: MealData
  score: number
  reason: string
  benefits: string[]
  nutritionalHighlights: string[]
  suitabilityForGoals: number
}

export interface DailyMealPlan {
  breakfast: MealRecommendation
  lunch: MealRecommendation
  dinner: MealRecommendation
  snack?: MealRecommendation
  totalNutrition: NutrientIntake
  planScore: number
  balanceAnalysis: string
}

export interface NutritionalGap {
  nutrient: string
  currentIntake: number
  recommendedIntake: number
  deficitPercentage: number
  foodSources: string[]
  priority: "high" | "medium" | "low"
}

export interface RecommendationSet {
  mealRecommendations: MealRecommendation[]
  dailyMealPlan: DailyMealPlan | null
  nutritionalGaps: NutritionalGap[]
  generalAdvice: string[]
  weeklyGoals: string[]
  alternativeMeals: { original: MealData; alternatives: MealRecommendation[] }[]
}

// Analyze nutritional gaps from user's recent intake
export function analyzeNutritionalGaps(recentIntake: NutrientIntake, userProfile: UserProfile): NutritionalGap[] {
  const requirements = calculateNutrientRequirements(userProfile)
  const gaps: NutritionalGap[] = []

  const nutrientInfo = {
    protein: {
      foodSources: ["Lentils", "Chickpeas", "Paneer", "Eggs", "Greek Yogurt", "Quinoa"],
      unit: "g",
    },
    fiber: {
      foodSources: ["Whole grains", "Vegetables", "Fruits", "Legumes", "Oats"],
      unit: "g",
    },
    calcium: {
      foodSources: ["Dairy products", "Leafy greens", "Sesame seeds", "Almonds"],
      unit: "mg",
    },
    iron: {
      foodSources: ["Spinach", "Lentils", "Fortified cereals", "Pumpkin seeds"],
      unit: "mg",
    },
    vitaminC: {
      foodSources: ["Citrus fruits", "Bell peppers", "Strawberries", "Broccoli"],
      unit: "mg",
    },
    folate: {
      foodSources: ["Leafy greens", "Legumes", "Fortified grains", "Asparagus"],
      unit: "μg",
    },
  }

  Object.entries(requirements).forEach(([nutrient, required]) => {
    const current = recentIntake[nutrient as keyof NutrientIntake] || 0
    const deficitPercentage = Math.max(0, ((required - current) / required) * 100)

    if (deficitPercentage > 20) {
      // Only include significant gaps
      const info = nutrientInfo[nutrient as keyof typeof nutrientInfo]
      if (info) {
        gaps.push({
          nutrient,
          currentIntake: current,
          recommendedIntake: required,
          deficitPercentage,
          foodSources: info.foodSources,
          priority: deficitPercentage > 50 ? "high" : deficitPercentage > 30 ? "medium" : "low",
        })
      }
    }
  })

  return gaps.sort((a, b) => b.deficitPercentage - a.deficitPercentage)
}

// Find best meal recommendations based on nutritional needs
export function generateMealRecommendations(
  availableMeals: MealData[],
  userProfile: UserProfile,
  nutritionalGaps: NutritionalGap[],
  mealType?: string,
  limit = 5,
): MealRecommendation[] {
  const recommendations: MealRecommendation[] = []

  availableMeals.forEach((meal) => {
    if (mealType && meal.meal_type.toLowerCase() !== mealType.toLowerCase()) {
      return
    }

    const mealScore = calculateMealScore(meal, userProfile)
    let bonusScore = 0
    const benefits: string[] = []
    const nutritionalHighlights: string[] = []

    // Bonus points for addressing nutritional gaps
    nutritionalGaps.forEach((gap) => {
      const mealNutrientValue = (meal[gap.nutrient as keyof MealData] as number) || 0
      const gapContribution = (mealNutrientValue / gap.recommendedIntake) * 100

      if (gapContribution > 15) {
        bonusScore += gap.priority === "high" ? 15 : gap.priority === "medium" ? 10 : 5
        benefits.push(`Helps address ${gap.nutrient} deficiency`)
        nutritionalHighlights.push(`${Math.round(gapContribution)}% of daily ${gap.nutrient} needs`)
      }
    })

    // Health goal alignment bonus
    let goalAlignment = 0
    if (userProfile.healthGoals) {
      userProfile.healthGoals.forEach((goal) => {
        switch (goal.toLowerCase()) {
          case "weight_loss":
            if (meal.calories < 400 && meal.protein > 15) {
              goalAlignment += 10
              benefits.push("Supports weight management goals")
            }
            break
          case "muscle_gain":
            if (meal.protein > 20) {
              goalAlignment += 15
              benefits.push("High protein for muscle building")
            }
            break
          case "heart_health":
            if (meal.sodium < 400 && meal.fibre > 5) {
              goalAlignment += 10
              benefits.push("Heart-healthy nutrition profile")
            }
            break
        }
      })
    }

    // Nutritional highlights
    if (meal.protein > 20) nutritionalHighlights.push("High protein content")
    if (meal.fibre > 8) nutritionalHighlights.push("Excellent fiber source")
    if (meal.calcium > 300) nutritionalHighlights.push("Rich in calcium")
    if (meal.iron > 3) nutritionalHighlights.push("Good iron source")
    if (meal.vitamin_c > 30) nutritionalHighlights.push("High vitamin C")

    const finalScore = Math.min(100, mealScore.overallScore + bonusScore + goalAlignment)

    let reason = `Score: ${finalScore}/100`
    if (bonusScore > 0) reason += ` (addresses nutritional gaps)`
    if (goalAlignment > 0) reason += ` (aligns with health goals)`

    recommendations.push({
      meal,
      score: finalScore,
      reason,
      benefits,
      nutritionalHighlights,
      suitabilityForGoals: goalAlignment,
    })
  })

  return recommendations.sort((a, b) => b.score - a.score).slice(0, limit)
}

// Generate a balanced daily meal plan
export function generateDailyMealPlan(
  availableMeals: MealData[],
  userProfile: UserProfile,
  nutritionalGaps: NutritionalGap[],
): DailyMealPlan | null {
  const breakfastMeals = availableMeals.filter((m) => m.meal_type.toLowerCase() === "breakfast")
  const lunchMeals = availableMeals.filter((m) => m.meal_type.toLowerCase() === "lunch")
  const dinnerMeals = availableMeals.filter((m) => m.meal_type.toLowerCase() === "dinner")
  const snackMeals = availableMeals.filter((m) => m.meal_type.toLowerCase() === "snack")

  if (breakfastMeals.length === 0 || lunchMeals.length === 0 || dinnerMeals.length === 0) {
    return null
  }

  const breakfastRecs = generateMealRecommendations(breakfastMeals, userProfile, nutritionalGaps, "breakfast", 3)
  const lunchRecs = generateMealRecommendations(lunchMeals, userProfile, nutritionalGaps, "lunch", 3)
  const dinnerRecs = generateMealRecommendations(dinnerMeals, userProfile, nutritionalGaps, "dinner", 3)
  const snackRecs =
    snackMeals.length > 0 ? generateMealRecommendations(snackMeals, userProfile, nutritionalGaps, "snack", 2) : []

  if (breakfastRecs.length === 0 || lunchRecs.length === 0 || dinnerRecs.length === 0) {
    return null
  }

  // Select best combination for balanced nutrition
  const breakfast = breakfastRecs[0]
  const lunch = lunchRecs[0]
  const dinner = dinnerRecs[0]
  const snack = snackRecs.length > 0 ? snackRecs[0] : undefined

  // Calculate total nutrition
  const meals = [breakfast.meal, lunch.meal, dinner.meal]
  if (snack) meals.push(snack.meal)

  const totalNutrition: NutrientIntake = meals.reduce(
    (total, meal) => ({
      calories: total.calories + meal.calories,
      protein: total.protein + meal.protein,
      carbohydrates: total.carbohydrates + meal.carbohydrates,
      fats: total.fats + meal.fats,
      fiber: total.fiber + meal.fibre,
      sodium: total.sodium + meal.sodium,
      calcium: total.calcium + meal.calcium,
      iron: total.iron + meal.iron,
      vitaminC: total.vitaminC + meal.vitamin_c,
      folate: total.folate + meal.folate,
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

  const requirements = calculateNutrientRequirements(userProfile)
  const analysis = analyzeNutrientIntake(totalNutrition, requirements)

  const planScore = Math.round((breakfast.score + lunch.score + dinner.score + (snack?.score || 80)) / (snack ? 4 : 3))

  let balanceAnalysis = `This meal plan provides ${Math.round(analysis.overallScore)}% nutritional adequacy. `
  if (analysis.deficiencies.length > 0) {
    balanceAnalysis += `Consider adding foods rich in ${analysis.deficiencies.slice(0, 2).join(" and ")}.`
  } else {
    balanceAnalysis += "Well-balanced nutrition across all major nutrients."
  }

  return {
    breakfast,
    lunch,
    dinner,
    snack,
    totalNutrition,
    planScore,
    balanceAnalysis,
  }
}

// Generate general nutritional advice
export function generateGeneralAdvice(
  userProfile: UserProfile,
  nutritionalGaps: NutritionalGap[],
  recentMealScores: number[],
): string[] {
  const advice: string[] = []

  // Age-specific advice
  if (userProfile.age < 25) {
    advice.push("Focus on building healthy eating habits that will benefit you long-term")
    advice.push("Ensure adequate calcium intake for peak bone mass development")
  } else if (userProfile.age > 50) {
    advice.push("Pay special attention to calcium and vitamin D for bone health")
    advice.push("Consider foods rich in antioxidants to support healthy aging")
  }

  // Activity level advice
  if (userProfile.activityLevel === "very_active" || userProfile.activityLevel === "active") {
    advice.push("Increase protein intake to support muscle recovery and growth")
    advice.push("Stay well-hydrated, especially around workout times")
  } else if (userProfile.activityLevel === "sedentary") {
    advice.push("Focus on nutrient-dense, lower-calorie foods to maintain healthy weight")
    advice.push("Consider incorporating more physical activity into your routine")
  }

  // Gap-specific advice
  nutritionalGaps.forEach((gap) => {
    if (gap.priority === "high") {
      advice.push(`Prioritize foods rich in ${gap.nutrient}: ${gap.foodSources.slice(0, 3).join(", ")}`)
    }
  })

  // Meal score trends
  const avgScore = recentMealScores.reduce((sum, score) => sum + score, 0) / recentMealScores.length
  if (avgScore < 70) {
    advice.push("Try to choose more nutritionally balanced meals from the available options")
    advice.push("Look for meals with higher fiber content and lower sodium")
  } else if (avgScore > 85) {
    advice.push("Great job maintaining excellent nutritional choices!")
    advice.push("Continue focusing on variety to ensure all micronutrient needs are met")
  }

  // Health goal specific advice
  if (userProfile.healthGoals) {
    userProfile.healthGoals.forEach((goal) => {
      switch (goal.toLowerCase()) {
        case "weight_loss":
          advice.push("Choose meals with high protein and fiber to help with satiety")
          advice.push("Pay attention to portion sizes and meal timing")
          break
        case "muscle_gain":
          advice.push("Aim for protein at every meal, especially post-workout")
          advice.push("Don't forget carbohydrates for energy and recovery")
          break
        case "heart_health":
          advice.push("Limit sodium intake and choose meals rich in potassium")
          advice.push("Focus on meals with healthy fats and plenty of vegetables")
          break
      }
    })
  }

  return advice.slice(0, 6) // Limit to most relevant advice
}

// Generate weekly goals
export function generateWeeklyGoals(userProfile: UserProfile, nutritionalGaps: NutritionalGap[]): string[] {
  const goals: string[] = []

  // Nutritional gap goals
  nutritionalGaps.slice(0, 2).forEach((gap) => {
    if (gap.priority === "high") {
      goals.push(`Increase ${gap.nutrient} intake by choosing meals with ${gap.foodSources[0].toLowerCase()}`)
    }
  })

  // General improvement goals
  goals.push("Try at least 3 new nutritious meals from the hostel menu")
  goals.push("Aim for meals with suitability scores above 80")

  if (userProfile.healthGoals?.includes("weight_loss")) {
    goals.push("Choose high-protein, high-fiber meals for better satiety")
  }

  if (userProfile.healthGoals?.includes("muscle_gain")) {
    goals.push("Include a protein-rich meal or snack after physical activity")
  }

  goals.push("Maintain consistent meal timing throughout the week")

  return goals.slice(0, 5)
}

// Main recommendation generation function
export function generateRecommendations(
  availableMeals: MealData[],
  userProfile: UserProfile,
  recentIntake: NutrientIntake,
  recentMealScores: number[] = [],
): RecommendationSet {
  const nutritionalGaps = analyzeNutritionalGaps(recentIntake, userProfile)

  const mealRecommendations = generateMealRecommendations(availableMeals, userProfile, nutritionalGaps, undefined, 8)

  const dailyMealPlan = generateDailyMealPlan(availableMeals, userProfile, nutritionalGaps)

  const generalAdvice = generateGeneralAdvice(userProfile, nutritionalGaps, recentMealScores)

  const weeklyGoals = generateWeeklyGoals(userProfile, nutritionalGaps)

  // Generate alternatives for low-scoring meals
  const alternativeMeals: { original: MealData; alternatives: MealRecommendation[] }[] = []

  return {
    mealRecommendations,
    dailyMealPlan,
    nutritionalGaps,
    generalAdvice,
    weeklyGoals,
    alternativeMeals,
  }
}
