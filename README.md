# 🥗 AI Nutrition Tracker

> A modern full-stack **AI-powered Nutrition Tracking Platform** built with **Next.js 14**, **Supabase**, **TypeScript**, and **Tailwind CSS**. The application enables users to log meals, monitor calorie and nutrient intake, receive AI-assisted meal recommendations, and track their daily nutrition through an interactive dashboard.

---

# 📖 Overview

Maintaining a balanced diet can be challenging without proper tracking and nutritional insights. AI Nutrition Tracker helps users monitor their daily food intake by recording meals, calculating nutritional values, and providing personalized recommendations based on their eating habits.

Built with a modern full-stack architecture, the platform combines AI-powered recommendations with cloud-based storage and authentication to deliver a seamless nutrition management experience.

---

# ✨ Key Features

### 🔐 Secure User Authentication

- User Registration & Login
- Secure authentication with Supabase
- Protected user sessions
- Profile management

---

### 🍽️ Meal Logging

- Add Breakfast, Lunch, Dinner & Snacks
- Edit or delete meals
- Daily meal history
- Organized nutrition records

---

### 🧮 Nutrition Calculator

- Automatic calorie calculation
- Protein tracking
- Carbohydrate tracking
- Fat tracking
- Daily nutrition summary

---

### 🤖 AI Meal Recommendations

- AI-assisted food suggestions
- Personalized diet recommendations
- Healthy meal alternatives
- Nutrition improvement tips

---

### 📊 Nutrition Dashboard

- Daily calorie overview
- Macronutrient visualization
- Nutrition progress tracking
- Interactive statistics

---

### ☁️ Supabase Integration

- Secure Authentication
- PostgreSQL Database
- Real-time data synchronization
- Cloud data storage

---

### 📱 Responsive User Interface

- Mobile-friendly design
- Modern dashboard
- Clean and intuitive UI
- Built with Tailwind CSS & ShadCN UI

---

# 🏗️ System Architecture

```text
                    Next.js 14 Frontend
                            │
                            ▼
                     Server Actions / API
                            │
            ┌───────────────┼───────────────┐
            │               │               │
      Authentication   AI Recommendation   Nutrition
       (Supabase)         Engine          Calculator
            │               │               │
            └───────────────┼───────────────┘
                            │
                  Supabase PostgreSQL Database
```

---

# ⚙️ Tech Stack

| Category | Technology |
|-----------|------------|
| Frontend | Next.js 14 |
| Language | TypeScript |
| Styling | Tailwind CSS |
| UI Components | ShadCN UI |
| Backend | Next.js Server Actions |
| Database | PostgreSQL (Supabase) |
| Authentication | Supabase Auth |
| AI | AI-powered Recommendation Engine |
| Deployment | Vercel / Supabase |

---

# 🌐 Live Demo

The application is deployed on **Vercel** and is publicly accessible.

**🔗 Live Demo:** https://ai-nutrition-tracker-pearl.vercel.app/

You can explore the following features:

- 🔑 Secure User Authentication
- 🍽️ Meal Logging
- 🧮 Nutrition & Calorie Tracking
- 🤖 AI Meal Recommendations
- 📊 Nutrition Dashboard
- ☁️ Cloud Database Integration

---


# 🚀 Installation

## Clone Repository

```bash
git clone https://github.com/yourusername/AI-Nutrition-Tracker.git

cd AI-Nutrition-Tracker
```

---

# Install Dependencies

```bash
npm install
```

---

# Configure Environment Variables

Create a `.env.local` file

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url

NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

# Run Development Server

```bash
npm run dev
```

Application

```
http://localhost:3000
```

---

# Database Schema

### Users

| Field | Type |
|-------|------|
| id | UUID |
| email | TEXT |
| full_name | TEXT |
| created_at | TIMESTAMP |

---

### Meals

| Field | Type |
|-------|------|
| id | UUID |
| user_id | UUID |
| meal_type | TEXT |
| food_name | TEXT |
| calories | INTEGER |
| protein | FLOAT |
| carbohydrates | FLOAT |
| fats | FLOAT |
| created_at | TIMESTAMP |

---

### Recommendations

| Field | Type |
|-------|------|
| id | UUID |
| user_id | UUID |
| recommendation | TEXT |
| generated_at | TIMESTAMP |

---

# 🔄 Workflow

```text
User Login
      │
      ▼
Authentication
      │
      ▼
Add Daily Meals
      │
      ▼
Nutrition Calculation
      │
      ▼
AI Recommendation Engine
      │
      ▼
Dashboard Analytics
      │
      ▼
Store Data in Supabase
```

---

# 📂 Project Structure

```text
AI-Nutrition-Tracker
│
├── app/
│
├── components/
│
├── lib/
│
├── hooks/
│
├── public/
│
├── styles/
│
├── types/
│
├── utils/
│
├── supabase/
│
├── package.json
│
├── tailwind.config.ts
│
├── tsconfig.json
│
└── README.md
```

---

# 🔒 Core Features

✔ Secure Authentication

✔ Meal Logging

✔ Nutrition Calculator

✔ AI Meal Recommendations

✔ Daily Nutrition Dashboard

✔ Responsive Design

✔ Cloud Database Integration

✔ Type-Safe Development

---

# 📈 Future Enhancements

- Barcode Scanner for Food Products
- Food Image Recognition using AI
- Weekly & Monthly Nutrition Reports
- Water Intake Tracker
- Workout Recommendation System
- Goal-Based Diet Planning
- Push Notifications
- Mobile Application
- Wearable Device Integration

---

# 👨‍💻 Author

**Kartik Patel**

B.Tech Computer Science Engineering

VIT Chennai

---

## ⭐ Support

If you found this project useful, consider giving the repository a **Star ⭐**.
