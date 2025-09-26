-- Load sample nutrition data from the provided CSV
-- This script populates the database with sample hostel menu data

INSERT INTO public.nutrition_data (day, meal_type, dish_name, calories, carbohydrates, protein, fats, free_sugar, fibre, sodium, calcium, iron, vitamin_c, folate) VALUES
('Sunday', 'Dinner', 'Gulab Jamun + Salad + Mint Butter Milk', 758.73, 42.09, 11.55, 61.26, 37.96, 2.06, 466.1, 368.59, 1.6, 28.26, 104.19),
('Monday', 'Breakfast', 'Poha + Tea', 320.45, 58.2, 8.3, 9.8, 12.5, 3.2, 380.5, 45.2, 2.1, 15.8, 65.4),
('Monday', 'Lunch', 'Dal Rice + Sabzi + Roti', 485.6, 72.4, 18.9, 12.3, 5.2, 8.7, 520.3, 125.8, 4.2, 22.5, 145.6),
('Monday', 'Dinner', 'Rajma Chawal + Pickle', 425.8, 65.3, 16.7, 8.9, 3.1, 12.4, 680.2, 89.3, 3.8, 18.9, 178.3),
('Tuesday', 'Breakfast', 'Upma + Coffee', 295.3, 48.6, 7.2, 8.4, 8.9, 2.8, 420.7, 38.5, 1.9, 12.3, 58.7),
('Tuesday', 'Lunch', 'Chole Bhature + Lassi', 620.9, 78.5, 22.4, 24.6, 15.8, 9.3, 890.4, 245.7, 5.1, 35.2, 198.5),
('Tuesday', 'Dinner', 'Paneer Curry + Rice + Roti', 545.2, 58.7, 24.8, 22.1, 8.4, 6.9, 650.8, 320.4, 3.2, 28.7, 125.9),
('Wednesday', 'Breakfast', 'Paratha + Curd + Pickle', 380.7, 45.2, 12.8, 18.9, 6.7, 4.1, 580.3, 185.6, 2.8, 8.9, 78.4),
('Wednesday', 'Lunch', 'Sambar Rice + Papad + Vegetable', 395.4, 68.9, 14.2, 9.7, 4.3, 11.8, 720.5, 98.7, 4.8, 45.6, 189.3),
('Wednesday', 'Dinner', 'Aloo Gobi + Roti + Dal', 365.8, 52.4, 13.9, 12.8, 7.2, 8.5, 480.9, 78.3, 3.5, 65.4, 156.7),
('Thursday', 'Breakfast', 'Idli Sambar + Coconut Chutney', 285.6, 52.8, 9.4, 6.2, 3.8, 5.7, 350.2, 125.4, 2.3, 18.9, 98.5),
('Thursday', 'Lunch', 'Biryani + Raita + Boiled Egg', 580.3, 72.6, 28.9, 18.4, 9.1, 4.2, 780.6, 156.8, 4.9, 12.7, 145.2),
('Thursday', 'Dinner', 'Khichdi + Pickle + Papad', 325.9, 58.7, 12.3, 6.8, 2.1, 7.9, 520.4, 89.6, 3.1, 22.8, 134.7),
('Friday', 'Breakfast', 'Dosa + Sambar + Chutney', 340.5, 62.4, 11.7, 8.9, 5.6, 6.3, 410.8, 98.3, 2.7, 28.4, 87.9),
('Friday', 'Lunch', 'Pav Bhaji + Butter + Onion', 485.7, 68.2, 14.8, 18.9, 12.4, 8.1, 920.3, 145.7, 4.2, 58.9, 167.4),
('Friday', 'Dinner', 'Kadhi Chawal + Pickle', 395.2, 65.8, 11.9, 9.7, 6.8, 5.4, 580.7, 125.9, 2.8, 15.6, 98.3),
('Saturday', 'Breakfast', 'Aloo Paratha + Curd + Tea', 420.8, 52.6, 14.2, 17.9, 8.3, 4.8, 650.4, 198.7, 3.2, 18.9, 89.5),
('Saturday', 'Lunch', 'Palak Paneer + Rice + Roti + Dal', 465.9, 48.7, 22.6, 24.8, 6.2, 9.7, 580.2, 385.4, 5.8, 78.9, 245.6),
('Saturday', 'Dinner', 'Vegetable Pulao + Raita + Pickle', 385.4, 62.3, 12.8, 11.9, 7.4, 6.2, 520.8, 145.3, 3.4, 35.7, 123.8);

-- Add some snack options
INSERT INTO public.nutrition_data (day, meal_type, dish_name, calories, carbohydrates, protein, fats, free_sugar, fibre, sodium, calcium, iron, vitamin_c, folate) VALUES
('Monday', 'Snack', 'Banana + Peanuts', 185.3, 28.4, 6.8, 8.2, 18.9, 4.1, 12.5, 45.7, 1.8, 12.4, 28.9),
('Tuesday', 'Snack', 'Biscuits + Tea', 165.7, 24.8, 3.2, 6.9, 15.6, 1.2, 180.4, 28.3, 0.9, 2.1, 15.7),
('Wednesday', 'Snack', 'Samosa + Chutney', 245.8, 32.6, 5.9, 12.4, 4.2, 2.8, 420.7, 38.9, 2.1, 8.7, 45.3),
('Thursday', 'Snack', 'Fruit Salad', 125.4, 32.1, 2.8, 0.8, 28.9, 5.6, 8.2, 45.7, 1.2, 85.4, 67.8),
('Friday', 'Snack', 'Roasted Chana + Lemon', 145.6, 22.8, 8.9, 3.2, 2.1, 7.8, 15.4, 78.9, 3.4, 18.9, 156.7),
('Saturday', 'Snack', 'Yogurt + Honey', 135.2, 18.7, 8.4, 4.2, 16.8, 0.5, 85.3, 245.6, 0.8, 2.8, 12.4),
('Sunday', 'Snack', 'Mixed Nuts', 195.8, 8.9, 7.2, 16.8, 3.4, 4.2, 5.7, 89.3, 2.8, 1.2, 45.6);
