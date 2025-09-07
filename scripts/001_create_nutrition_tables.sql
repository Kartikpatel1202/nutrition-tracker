-- Create nutrition data table for storing CSV data
CREATE TABLE IF NOT EXISTS public.nutrition_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day TEXT NOT NULL,
  meal_type TEXT NOT NULL,
  dish_name TEXT NOT NULL,
  calories DECIMAL(10,2),
  carbohydrates DECIMAL(10,2),
  protein DECIMAL(10,2),
  fats DECIMAL(10,2),
  free_sugar DECIMAL(10,2),
  fibre DECIMAL(10,2),
  sodium DECIMAL(10,2),
  calcium DECIMAL(10,2),
  iron DECIMAL(10,2),
  vitamin_c DECIMAL(10,2),
  folate DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user profiles table for personalized recommendations
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  age INTEGER,
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  weight DECIMAL(5,2),
  height DECIMAL(5,2),
  activity_level TEXT CHECK (activity_level IN ('sedentary', 'light', 'moderate', 'active', 'very_active')),
  dietary_restrictions TEXT[],
  health_goals TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create meal tracking table for user consumption
CREATE TABLE IF NOT EXISTS public.meal_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  nutrition_data_id UUID REFERENCES public.nutrition_data(id) ON DELETE CASCADE,
  consumed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  portion_size DECIMAL(3,2) DEFAULT 1.0,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  notes TEXT
);

-- Enable Row Level Security
ALTER TABLE public.nutrition_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_tracking ENABLE ROW LEVEL SECURITY;

-- RLS Policies for nutrition_data (public read access)
CREATE POLICY "Allow public read access to nutrition data" ON public.nutrition_data FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users to insert nutrition data" ON public.nutrition_data FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- RLS Policies for user_profiles
CREATE POLICY "Users can view their own profile" ON public.user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.user_profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.user_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can delete their own profile" ON public.user_profiles FOR DELETE USING (auth.uid() = id);

-- RLS Policies for meal_tracking
CREATE POLICY "Users can view their own meal tracking" ON public.meal_tracking FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own meal tracking" ON public.meal_tracking FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own meal tracking" ON public.meal_tracking FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own meal tracking" ON public.meal_tracking FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_nutrition_data_day ON public.nutrition_data(day);
CREATE INDEX IF NOT EXISTS idx_nutrition_data_meal_type ON public.nutrition_data(meal_type);
CREATE INDEX IF NOT EXISTS idx_meal_tracking_user_id ON public.meal_tracking(user_id);
CREATE INDEX IF NOT EXISTS idx_meal_tracking_consumed_at ON public.meal_tracking(consumed_at);
