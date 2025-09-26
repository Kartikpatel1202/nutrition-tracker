import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CheckCircle, Mail, Utensils } from "lucide-react"

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="p-3 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full">
              <Utensils className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              Nutrition Tracker
            </h1>
          </div>
        </div>

        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-green-100 rounded-full w-fit">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-700">Account Created Successfully!</CardTitle>
            <CardDescription>Welcome to your nutrition journey</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <Mail className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <p className="text-sm text-blue-700 font-medium mb-1">Check Your Email</p>
              <p className="text-xs text-blue-600">
                We&apos;ve sent you a confirmation email. Please click the link to verify your account before signing
                in.
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Once verified, you&apos;ll have access to:</p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Personalized nutrition recommendations</li>
                <li>• Meal suitability scoring</li>
                <li>• Progress tracking and analytics</li>
                <li>• Custom meal planning</li>
              </ul>
            </div>

            <div className="pt-4">
              <Button
                asChild
                className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600"
              >
                <Link href="/auth/login">Continue to Sign In</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
