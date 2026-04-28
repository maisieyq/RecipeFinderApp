export const INGREDIENTS = [
  // Proteins
  { id: 'i1', name: 'Chicken Breast', category: 'Protein', emoji: '🍗' },
  { id: 'i2', name: 'Ground Beef', category: 'Protein', emoji: '🥩' },
  { id: 'i3', name: 'Salmon', category: 'Protein', emoji: '🐟' },
  { id: 'i4', name: 'Eggs', category: 'Protein', emoji: '🥚' },
  { id: 'i5', name: 'Tofu', category: 'Protein', emoji: '🫘' },
  { id: 'i6', name: 'Shrimp', category: 'Protein', emoji: '🦐' },

  // Vegetables
  { id: 'i7', name: 'Garlic', category: 'Vegetable', emoji: '🧄' },
  { id: 'i8', name: 'Onion', category: 'Vegetable', emoji: '🧅' },
  { id: 'i9', name: 'Tomato', category: 'Vegetable', emoji: '🍅' },
  { id: 'i10', name: 'Spinach', category: 'Vegetable', emoji: '🥬' },
  { id: 'i11', name: 'Carrot', category: 'Vegetable', emoji: '🥕' },
  { id: 'i12', name: 'Bell Pepper', category: 'Vegetable', emoji: '🫑' },
  { id: 'i13', name: 'Mushroom', category: 'Vegetable', emoji: '🍄' },
  { id: 'i14', name: 'Broccoli', category: 'Vegetable', emoji: '🥦' },
  { id: 'i15', name: 'Potato', category: 'Vegetable', emoji: '🥔' },

  // Pantry
  { id: 'i16', name: 'Pasta', category: 'Pantry', emoji: '🍝' },
  { id: 'i17', name: 'Rice', category: 'Pantry', emoji: '🍚' },
  { id: 'i18', name: 'Flour', category: 'Pantry', emoji: '🌾' },
  { id: 'i19', name: 'Olive Oil', category: 'Pantry', emoji: '🫒' },
  { id: 'i20', name: 'Butter', category: 'Pantry', emoji: '🧈' },
  { id: 'i21', name: 'Soy Sauce', category: 'Pantry', emoji: '🍶' },
  { id: 'i22', name: 'Lemon', category: 'Pantry', emoji: '🍋' },

  // Dairy
  { id: 'i23', name: 'Cheese', category: 'Dairy', emoji: '🧀' },
  { id: 'i24', name: 'Milk', category: 'Dairy', emoji: '🥛' },
  { id: 'i25', name: 'Cream', category: 'Dairy', emoji: '🥛' },

  // Herbs
  { id: 'i26', name: 'Basil', category: 'Herb', emoji: '🌿' },
  { id: 'i27', name: 'Rosemary', category: 'Herb', emoji: '🌿' },
  { id: 'i28', name: 'Chili', category: 'Herb', emoji: '🌶️' },
];

export const PANTRY_SHORTCUTS = [
  { id: 'p1', name: 'Salt & Pepper', emoji: '🧂' },
  { id: 'p2', name: 'Olive Oil', emoji: '🫒' },
  { id: 'p3', name: 'Garlic', emoji: '🧄' },
  { id: 'p4', name: 'Onion', emoji: '🧅' },
  { id: 'p5', name: 'Butter', emoji: '🧈' },
  { id: 'p6', name: 'Soy Sauce', emoji: '🍶' },
  { id: 'p7', name: 'Lemon Juice', emoji: '🍋' },
  { id: 'p8', name: 'Sugar', emoji: '🍬' },
];

export const RECIPES = [
  //Garlic Butter Chicken
  {
    id: 'r1',
    title: 'Garlic Butter Chicken',
    image: 'https://www.platingpixels.com/wp-content/uploads/2016/08/Garlic-Butter-Chicken-7.jpg',    
    cookTime: '25 min',
    servings: 4,
    difficulty: 'Easy',
    calories: 380,
    rating: 4.8,
    reviewCount: 1243,
    tags: ['Dinner', 'High Protein', 'Quick'],
    ingredients: ['Chicken Breast', 'Garlic', 'Butter', 'Rosemary', 'Lemon'],
    matchCount: 5,
    description:
      'Juicy pan-seared chicken breast basted in herb-infused garlic butter. A weeknight classic ready in under 30 minutes.',
    steps: [
      'Season chicken with salt, pepper, and rosemary.',
      'Heat a skillet over medium-high. Add olive oil.',
      'Sear chicken 6 min per side until golden.',
      'Add butter and garlic; baste continuously for 3 min.',
      'Squeeze lemon over top. Rest 5 min before serving.',
    ],
    nutrition: { protein: '42g', carbs: '2g', fat: '18g', fiber: '0g' },
  },

  //Mushroom Pasta
  {
    id: 'r2',
    title: 'Mushroom Pasta',
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400',
    cookTime: '20 min',
    servings: 2,
    difficulty: 'Easy',
    calories: 520,
    rating: 4.6,
    reviewCount: 876,
    tags: ['Vegetarian', 'Pasta', 'Comfort'],
    ingredients: ['Pasta', 'Mushroom', 'Garlic', 'Cream', 'Cheese', 'Butter'],
    matchCount: 4,
    description:
      'Creamy mushroom pasta with garlic and Parmesan. Rich, silky, and deeply satisfying.',
    steps: [
      'Cook pasta al dente. Reserve 1 cup pasta water.',
      'Sauté garlic in butter until fragrant.',
      'Add mushrooms, cook until golden brown.',
      'Pour cream; simmer 3 min. Add cheese.',
      'Toss pasta, add pasta water to loosen. Season to taste.',
    ],
    nutrition: { protein: '18g', carbs: '68g', fat: '24g', fiber: '4g' },
  },

  //Salmon Teriyaki Bowl
  {
    id: 'r3',
    title: 'Salmon Teriyaki Bowl',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
    cookTime: '30 min',
    servings: 2,
    difficulty: 'Medium',
    calories: 450,
    rating: 4.9,
    reviewCount: 2018,
    tags: ['Breakfast', 'Bowl', 'Fish'],
    ingredients: ['Salmon', 'Rice', 'Soy Sauce', 'Garlic', 'Spinach'],
    matchCount: 5,
    description:
      'Glazed salmon over steamed jasmine rice with wilted spinach. Umami-packed and nutritious.',
    steps: [
      'Mix soy sauce, mirin, sugar for teriyaki glaze.',
      'Marinate salmon 10 min.',
      'Pan-fry salmon 4 min per side, glazing each turn.',
      'Wilt spinach with garlic in the same pan.',
      'Serve over rice. Drizzle remaining glaze.',
    ],
    nutrition: { protein: '36g', carbs: '48g', fat: '14g', fiber: '3g' },
  },

  //Spicy Shakshuka
  {
    id: 'r4',
    title: 'Spicy Shakshuka',
    image: 'https://images.unsplash.com/photo-1590412200988-a436970781fa?w=400',
    cookTime: '25 min',
    servings: 4,
    difficulty: 'Easy',
    calories: 280,
    rating: 4.7,
    reviewCount: 654,
    tags: ['Lunch', 'Vegetarian', 'Spicy'],
    ingredients: ['Eggs', 'Tomato', 'Bell Pepper', 'Onion', 'Garlic', 'Chili'],
    matchCount: 6,
    description:
      'Poached eggs in a smoky, spiced tomato sauce. A Middle Eastern classic for any meal of the day.',
    steps: [
      'Sauté onion, garlic, and peppers until soft.',
      'Add tomatoes, chili, cumin; simmer 10 min.',
      'Make wells, crack eggs in. Cover.',
      'Cook 5–7 min until whites set but yolks runny.',
      'Garnish with fresh herbs. Serve with crusty bread.',
    ],
    nutrition: { protein: '14g', carbs: '18g', fat: '12g', fiber: '5g' },
  },

  //Beef Stir Fry
  {
    id: 'r5',
    title: 'Beef Stir Fry',
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400',
    cookTime: '15 min',
    servings: 3,
    difficulty: 'Easy',
    calories: 410,
    rating: 4.5,
    reviewCount: 932,
    tags: ['Quick', 'Dinner', 'Asian'],
    ingredients: ['Ground Beef', 'Bell Pepper', 'Broccoli', 'Soy Sauce', 'Garlic', 'Carrot'],
    matchCount: 5,
    description:
      'Smoky wok-tossed beef and vegetables in a savory soy glaze. Done in 15 minutes flat.',
    steps: [
      'High heat wok with oil. Brown beef until caramelized.',
      'Remove beef. Stir fry veggies 3 min.',
      'Add beef back with soy sauce and garlic.',
      'Toss 2 min. Finish with sesame oil.',
      'Serve immediately over steamed rice.',
    ],
    nutrition: { protein: '28g', carbs: '14g', fat: '22g', fiber: '4g' },
  },

  //Tofu Fried Rice
  {
    id: 'r6',
    title: 'Tofu Fried Rice',
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400',
    cookTime: '20 min',
    servings: 2,
    difficulty: 'Easy',
    calories: 360,
    rating: 4.4,
    reviewCount: 448,
    tags: ['Vegan', 'Asian', 'Quick'],
    ingredients: ['Tofu', 'Rice', 'Eggs', 'Soy Sauce', 'Carrot', 'Onion'],
    matchCount: 5,
    description:
      'Golden crispy tofu tossed with day-old rice, scrambled egg, and vegetables.',
    steps: [
      'Press and cube tofu. Fry until golden on all sides.',
      'Scramble eggs in same pan, set aside.',
      'Stir fry onion and carrot 2 min.',
      'Add rice; toss over high heat 3 min.',
      'Add tofu, egg, soy sauce. Toss until combined.',
    ],
    nutrition: { protein: '20g', carbs: '52g', fat: '12g', fiber: '3g' },
  },
];

export const CATEGORIES = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Quick', 'Vegetarian'];
