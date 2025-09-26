import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Navigation } from "@/components/navigation"
import { ErrorBoundary } from "@/components/error-boundary"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Nutrition Tracker - Smart Hostel Meal Management",
  description:
    "Track your nutrition, get personalized recommendations, and optimize your hostel meal choices with AI-powered insights.",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ErrorBoundary>
          <Navigation />
          <main className="min-h-screen">{children}</main>
        </ErrorBoundary>
      </body>
    </html>
  )
}
