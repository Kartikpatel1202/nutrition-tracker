import { redirect } from "next/navigation"

export default function DashboardPage() {
  // Redirect to main page which now handles dashboard logic
  redirect("/")
}
