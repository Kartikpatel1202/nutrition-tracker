import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowRight, BarChart3, Brain, Target, Users, Zap, Heart } from "lucide-react"

export function LandingHero() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-blue-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />

      <div className="container mx-auto px-4 py-16 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Hero Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200">
                AI-Powered Nutrition Tracking
              </Badge>
              <h1 className="text-4xl font-bold tracking-tight lg:text-6xl">
                <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                  Smart Nutrition
                </span>
                <br />
                for Hostel Life
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Transform your hostel dining experience with AI-powered meal analysis, personalized recommendations, and
                comprehensive nutrition tracking designed for student life.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-lg px-8"
                asChild
              >
                <Link href="/auth/sign-up">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/auth/login">Sign In</Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t">
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600">500+</div>
                <div className="text-sm text-muted-foreground">Meals Analyzed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">95%</div>
                <div className="text-sm text-muted-foreground">Accuracy Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">24/7</div>
                <div className="text-sm text-muted-foreground">Available</div>
              </div>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="relative">
            <div className="grid gap-4 md:grid-cols-2">
              {/* Feature Cards */}
              <Card className="shadow-lg border-0 bg-gradient-to-br from-emerald-50 to-green-50 transform rotate-2">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-emerald-500 rounded-lg">
                      <BarChart3 className="h-4 w-4 text-white" />
                    </div>
                    <h3 className="font-semibold text-emerald-700">Smart Analytics</h3>
                  </div>
                  <p className="text-sm text-emerald-600">
                    Track calories, macros, and micronutrients with detailed visualizations
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-cyan-50 transform -rotate-2 mt-8">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-blue-500 rounded-lg">
                      <Brain className="h-4 w-4 text-white" />
                    </div>
                    <h3 className="font-semibold text-blue-700">AI Recommendations</h3>
                  </div>
                  <p className="text-sm text-blue-600">Get personalized meal suggestions based on your health goals</p>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-50 to-pink-50 transform rotate-1 -mt-4">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-purple-500 rounded-lg">
                      <Target className="h-4 w-4 text-white" />
                    </div>
                    <h3 className="font-semibold text-purple-700">Goal Tracking</h3>
                  </div>
                  <p className="text-sm text-purple-600">
                    Set and achieve your nutrition goals with guided progress tracking
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 bg-gradient-to-br from-orange-50 to-red-50 transform -rotate-1">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-orange-500 rounded-lg">
                      <Zap className="h-4 w-4 text-white" />
                    </div>
                    <h3 className="font-semibold text-orange-700">Meal Scoring</h3>
                  </div>
                  <p className="text-sm text-orange-600">
                    Rate meals from A+ to F based on nutritional value and suitability
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 p-3 bg-gradient-to-r from-emerald-400 to-blue-400 rounded-full shadow-lg">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <div className="absolute -bottom-4 -left-4 p-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full shadow-lg">
              <Users className="h-5 w-5 text-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
