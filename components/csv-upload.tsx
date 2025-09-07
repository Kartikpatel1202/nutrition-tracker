"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, CheckCircle, AlertCircle } from "lucide-react"

export function CsvUpload() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile && selectedFile.type === "text/csv") {
      setFile(selectedFile)
      setStatus("idle")
    } else {
      setStatus("error")
      setMessage("Please select a valid CSV file")
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    setStatus("idle")

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload-csv", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (response.ok) {
        setStatus("success")
        setMessage(`Successfully uploaded ${result.count} nutrition records`)
        setFile(null)
        // Reset file input
        const fileInput = document.getElementById("csv-file") as HTMLInputElement
        if (fileInput) fileInput.value = ""
      } else {
        setStatus("error")
        setMessage(result.error || "Upload failed")
      }
    } catch (error) {
      setStatus("error")
      setMessage("Network error occurred")
    } finally {
      setUploading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload Nutrition Data
        </CardTitle>
        <CardDescription>Upload a CSV file with nutrition data to populate the database</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="csv-file">CSV File</Label>
          <Input id="csv-file" type="file" accept=".csv" onChange={handleFileChange} disabled={uploading} />
        </div>

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

        <Button onClick={handleUpload} disabled={!file || uploading} className="w-full">
          {uploading ? "Uploading..." : "Upload CSV"}
        </Button>

        <div className="text-xs text-muted-foreground">
          Expected format: Day, Meal Type, Dish Name, Calories, Carbohydrates, Protein, Fats, Free Sugar, Fibre, Sodium,
          Calcium, Iron, Vitamin C, Folate
        </div>
      </CardContent>
    </Card>
  )
}
