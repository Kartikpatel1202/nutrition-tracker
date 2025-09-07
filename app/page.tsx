import { createClient } from "@/lib/supabase/server"
import { DashboardOverview } from "@/components/dashboard-overview"
import { NutritionCharts } from "@/components/nutrition-charts"
import { MealCards } from "@/components/meal-cards"
import { WeeklyProgress } from "@/components/weekly-progress"
import { LandingHero } from "@/components/landing-hero"
import { FeatureShowcase } from "@/components/feature-showcase"

export default async function HomePage() {
  const supabase = await createClient()

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // If user is authenticated, show dashboard
  if (user) {
    // Get user profile
    const { data: profile } = await supabase.from("user_profiles").select("*").eq("id", user.id).single()

    // Fetch nutrition data for dashboard
    const { data: nutritionData } = await supabase.from("nutrition_data").select("*").limit(50)

    const { data: todaysMeals } = await supabase
      .from("nutrition_data")
      .select("*")
      .eq("day", new Date().toLocaleDateString("en-US", { weekday: "long" }))

    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent mb-2">
              Welcome back, {user.user_metadata?.first_name || "there"}!
            </h1>
            <p className="text-lg text-muted-foreground">Here's your personalized nutrition dashboard</p>
          </div>

          {!profile && (
            <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 text-center">
                <strong>Complete your profile</strong> to get personalized recommendations.{" "}
                <a href="/profile" className="underline hover:no-underline">
                  Set up now →
                </a>
              </p>
            </div>
          )}

          {/* Dashboard Grid */}
          <div className="grid gap-6 lg:grid-cols-12">
            {/* Overview Cards */}
            <div className="lg:col-span-12">
              <DashboardOverview nutritionData={nutritionData || []} />
            </div>

            {/* Charts Section */}
            <div className="lg:col-span-8">
              <NutritionCharts nutritionData={nutritionData || []} />
            </div>

            {/* Weekly Progress */}
            <div className="lg:col-span-4">
              <WeeklyProgress />
            </div>

            {/* Today's Meals */}
            <div className="lg:col-span-12">
              <MealCards meals={todaysMeals || []} userProfile={profile} />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // If user is not authenticated, show landing page
  return (
    <div className="min-h-screen">
      <LandingHero />
      <FeatureShowcase />
    </div>
  )
}
