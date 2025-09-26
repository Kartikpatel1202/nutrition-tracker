import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  Calculator,
  BarChart3,
  Lightbulb,
  Shield,
  Clock,
  Smartphone,
  TrendingUp,
  Users,
  Award,
  Zap,
} from "lucide-react"

export function FeatureShowcase() {
  const features = [
    {
      icon: Calculator,
      title: "Meal Suitability Scoring",
      description:
        "Advanced algorithm rates every meal from A+ to F based on nutritional balance, portion size, and your personal health goals.",
      color: "from-emerald-500 to-green-500",
      bgColor: "from-emerald-50 to-green-50",
    },
    {
      icon: BarChart3,
      title: "Comprehensive Analytics",
      description:
        "Beautiful charts and insights showing your nutrition trends, macro breakdowns, and progress over time.",
      color: "from-blue-500 to-cyan-500",
      bgColor: "from-blue-50 to-cyan-50",
    },
    {
      icon: Lightbulb,
      title: "AI-Powered Recommendations",
      description: "Smart suggestions for better meal choices, daily meal plans, and personalized nutrition advice.",
      color: "from-purple-500 to-pink-500",
      bgColor: "from-purple-50 to-pink-50",
    },
    {
      icon: TrendingUp,
      title: "Nutrient Calculation Engine",
      description:
        "Precise BMR/TDEE calculations and personalized daily requirements based on your age, gender, and activity level.",
      color: "from-orange-500 to-red-500",
      bgColor: "from-orange-50 to-red-50",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your health data is protected with enterprise-grade security and privacy controls.",
      color: "from-gray-500 to-slate-500",
      bgColor: "from-gray-50 to-slate-50",
    },
    {
      icon: Smartphone,
      title: "Mobile Optimized",
      description: "Access your nutrition dashboard anywhere with our responsive design that works on all devices.",
      color: "from-indigo-500 to-blue-500",
      bgColor: "from-indigo-50 to-blue-50",
    },
  ]

  const benefits = [
    {
      icon: Clock,
      title: "Save Time",
      description: "No more guessing about meal nutrition - get instant analysis and recommendations.",
    },
    {
      icon: Award,
      title: "Achieve Goals",
      description: "Whether it's weight loss, muscle gain, or general health - we help you succeed.",
    },
    {
      icon: Users,
      title: "Student-Focused",
      description: "Designed specifically for hostel life and student dietary needs and constraints.",
    },
    {
      icon: Zap,
      title: "Instant Results",
      description: "Get meal scores, recommendations, and insights in real-time as you make food choices.",
    },
  ]

  return (
    <div className="py-16 lg:py-24">
      {/* Features Section */}
      <div className="container mx-auto px-4 mb-16">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-blue-100 text-blue-700">Powerful Features</Badge>
          <h2 className="text-3xl font-bold mb-4 lg:text-4xl">
            Everything you need for
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {" "}
              smart nutrition
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Our comprehensive platform combines AI, data science, and nutrition expertise to transform how you approach
            hostel dining.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card
              key={index}
              className={`shadow-lg border-0 bg-gradient-to-br ${feature.bgColor} hover:shadow-xl transition-all duration-300`}
            >
              <CardHeader>
                <div className={`p-3 rounded-lg bg-gradient-to-r ${feature.color} w-fit mb-4`}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-gradient-to-r from-emerald-50 to-blue-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 lg:text-4xl">
              Why students choose
              <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                {" "}
                Nutrition Tracker
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join thousands of students who have transformed their nutrition and health with our platform.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mb-12">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="p-4 bg-white rounded-full shadow-lg w-fit mx-auto mb-4">
                  <benefit.icon className="h-8 w-8 text-emerald-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold mb-4">Ready to transform your nutrition?</h3>
              <p className="text-muted-foreground mb-6">
                Join thousands of students already using our platform to make smarter food choices and achieve their
                health goals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600"
                  asChild
                >
                  <Link href="/auth/sign-up">Start Free Today</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/scorer">Try Meal Scorer</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
