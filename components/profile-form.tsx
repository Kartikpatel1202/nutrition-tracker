"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { User, Save, CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"

interface ProfileFormProps {
  user: any
  profile: any
}

export function ProfileForm({ user, profile }: ProfileFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    age: profile?.age || "",
    gender: profile?.gender || "",
    weight: profile?.weight || "",
    height: profile?.height || "",
    activityLevel: profile?.activity_level || "",
    healthGoals: profile?.health_goals || [],
    dietaryRestrictions: profile?.dietary_restrictions || [],
  })

  const healthGoalOptions = [
    "weight_loss",
    "weight_gain",
    "muscle_gain",
    "heart_health",
    "diabetes_management",
    "bone_health",
    "general_wellness",
  ]

  const dietaryRestrictionOptions = [
    "vegetarian",
    "vegan",
    "gluten_free",
    "dairy_free",
    "low_sodium",
    "low_sugar",
    "high_protein",
    "low_fat",
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const supabase = createClient()

    try {
      const { error } = await supabase.from("user_profiles").upsert({
        id: user.id,
        age: Number.parseInt(formData.age),
        gender: formData.gender,
        weight: Number.parseFloat(formData.weight),
        height: Number.parseFloat(formData.height),
        activity_level: formData.activityLevel,
        health_goals: formData.healthGoals,
        dietary_restrictions: formData.dietaryRestrictions,
        updated_at: new Date().toISOString(),
      })

      if (error) throw error

      setSuccess(true)
      setTimeout(() => {
        router.push("/dashboard")
      }, 2000)
    } catch (error) {
      console.error("Profile update error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleHealthGoalChange = (goal: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      healthGoals: checked ? [...prev.healthGoals, goal] : prev.healthGoals.filter((g) => g !== goal),
    }))
  }

  const handleDietaryRestrictionChange = (restriction: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      dietaryRestrictions: checked
        ? [...prev.dietaryRestrictions, restriction]
        : prev.dietaryRestrictions.filter((r) => r !== restriction),
    }))
  }

  if (success) {
    return (
      <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-emerald-50">
        <CardContent className="text-center py-12">
          <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-green-700 mb-2">Profile Updated!</h3>
          <p className="text-green-600">Redirecting to your personalized dashboard...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Personal Information
        </CardTitle>
        <CardDescription>Help us personalize your nutrition recommendations</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                placeholder="25"
                value={formData.age}
                onChange={(e) => setFormData((prev) => ({ ...prev, age: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select
                value={formData.gender}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, gender: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                placeholder="70"
                value={formData.weight}
                onChange={(e) => setFormData((prev) => ({ ...prev, weight: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="height">Height (cm)</Label>
              <Input
                id="height"
                type="number"
                placeholder="175"
                value={formData.height}
                onChange={(e) => setFormData((prev) => ({ ...prev, height: e.target.value }))}
                required
              />
            </div>
          </div>

          {/* Activity Level */}
          <div className="space-y-2">
            <Label htmlFor="activity">Activity Level</Label>
            <Select
              value={formData.activityLevel}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, activityLevel: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select activity level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sedentary">Sedentary (little/no exercise)</SelectItem>
                <SelectItem value="light">Light (light exercise 1-3 days/week)</SelectItem>
                <SelectItem value="moderate">Moderate (moderate exercise 3-5 days/week)</SelectItem>
                <SelectItem value="active">Active (hard exercise 6-7 days/week)</SelectItem>
                <SelectItem value="very_active">Very Active (very hard exercise, physical job)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Health Goals */}
          <div className="space-y-3">
            <Label>Health Goals</Label>
            <div className="grid gap-3 md:grid-cols-2">
              {healthGoalOptions.map((goal) => (
                <div key={goal} className="flex items-center space-x-2">
                  <Checkbox
                    id={goal}
                    checked={formData.healthGoals.includes(goal)}
                    onCheckedChange={(checked) => handleHealthGoalChange(goal, checked as boolean)}
                  />
                  <Label htmlFor={goal} className="text-sm capitalize">
                    {goal.replace(/_/g, " ")}
                  </Label>
                </div>
              ))}
            </div>
            {formData.healthGoals.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.healthGoals.map((goal) => (
                  <Badge key={goal} variant="secondary" className="text-xs">
                    {goal.replace(/_/g, " ")}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Dietary Restrictions */}
          <div className="space-y-3">
            <Label>Dietary Preferences</Label>
            <div className="grid gap-3 md:grid-cols-2">
              {dietaryRestrictionOptions.map((restriction) => (
                <div key={restriction} className="flex items-center space-x-2">
                  <Checkbox
                    id={restriction}
                    checked={formData.dietaryRestrictions.includes(restriction)}
                    onCheckedChange={(checked) => handleDietaryRestrictionChange(restriction, checked as boolean)}
                  />
                  <Label htmlFor={restriction} className="text-sm capitalize">
                    {restriction.replace(/_/g, " ")}
                  </Label>
                </div>
              ))}
            </div>
            {formData.dietaryRestrictions.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.dietaryRestrictions.map((restriction) => (
                  <Badge key={restriction} variant="outline" className="text-xs">
                    {restriction.replace(/_/g, " ")}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600"
            disabled={loading}
          >
            {loading ? (
              "Saving..."
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Profile
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
