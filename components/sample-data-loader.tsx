"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Database, CheckCircle, AlertCircle, RefreshCw } from "lucide-react"

export function SampleDataLoader() {
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  const loadSampleData = async () => {
    setLoading(true)
    setStatus("idle")

    try {
      const response = await fetch("/api/load-sample-data", {
        method: "POST",
      })

      const result = await response.json()

      if (response.ok) {
        setStatus("success")
        setMessage(result.message)
      } else {
        setStatus("error")
        setMessage(result.error || "Failed to load sample data")
      }
    } catch (error) {
      setStatus("error")
      setMessage("Network error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Sample Data
        </CardTitle>
        <CardDescription>Load sample hostel menu data to test the application</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {status === "success" && (
          <div className="flex items-center gap-2 text-green-600 text-sm">
            <CheckCircle className="h-4 w-4" />
            {message}
          </div>
        )}

        {status === "error" && (
          <div className="flex items-center gap-2 text-red-600 text-sm">
            <AlertCircle className="h-4 w-4" />
            {message}
          </div>
        )}

        <Button onClick={loadSampleData} disabled={loading} className="w-full">
          {loading ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Loading...
            </>
          ) : (
            "Load Sample Data"
          )}
        </Button>

        <div className="text-xs text-muted-foreground">
          This will populate the database with sample hostel menu items including breakfast, lunch, dinner, and snack
          options.
        </div>
      </CardContent>
    </Card>
  )
}
