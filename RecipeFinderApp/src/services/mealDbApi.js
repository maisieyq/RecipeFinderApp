const BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

const safeJson = async response => {
  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  return response.json();
};

export const searchMealsByName = async query => {
  const response = await fetch(
    `${BASE_URL}/search.php?s=${encodeURIComponent(query)}`
  );

  const data = await safeJson(response);
  return data.meals || [];
};

export const searchMealsByIngredient = async ingredient => {
  const response = await fetch(
    `${BASE_URL}/filter.php?i=${encodeURIComponent(ingredient)}`
  );

  const data = await safeJson(response);
  return data.meals || [];
};

export const getMealById = async id => {
  const response = await fetch(`${BASE_URL}/lookup.php?i=${id}`);
  const data = await safeJson(response);

  return data.meals && data.meals.length > 0 ? data.meals[0] : null;
};


const getEstimatedCookTime = (meal, ingredients, steps) => {
  const category = (meal.strCategory || '').toLowerCase();
  const text = `${meal.strMeal || ''} ${meal.strInstructions || ''}`.toLowerCase();

  if (text.includes('sandwich') || text.includes('salad')) {
      return '15 mins';
  }
  if (category.includes('dessert')) return '45 mins';
  if (category.includes('breakfast')) return '20 mins';
  if (category.includes('starter')) return '25 mins';
  if (category.includes('side')) return '20 mins';

  if (text.includes('bake') || text.includes('roast')) return '60 mins';
  if (text.includes('simmer') || text.includes('slow cook')) return '75 mins';
  if (text.includes('fry') || text.includes('stir-fry')) return '30 mins';
  if (text.includes('boil')) return '35 mins';

  if (steps.length >= 10 || ingredients.length >= 12) return '60 mins';
  if (steps.length >= 6 || ingredients.length >= 8) return '40 mins';

  return '25 mins';
};

const getEstimatedCalories = (meal, ingredients) => {
  const category = (meal.strCategory || '').toLowerCase();
  const text = ingredients.join(' ').toLowerCase();

  let calories = 350;

  if (category.includes('dessert')) calories += 250;
  if (category.includes('beef') || category.includes('pork')) calories += 250;
  if (category.includes('chicken')) calories += 150;
  if (category.includes('seafood')) calories += 100;
  if (category.includes('vegetarian')) calories -= 80;

  if (text.includes('cream') || text.includes('cheese') || text.includes('butter')) {
    calories += 180;
  }

  if (text.includes('rice') || text.includes('pasta') || text.includes('noodles')) {
    calories += 150;
  }

  if (text.includes('oil') || text.includes('fried')) {
    calories += 120;
  }

  return Math.max(250, calories);
};

const getDifficulty = (meal, ingredients, steps) => {
  const category = (meal.strCategory || '').toLowerCase();
  const text = `${meal.strMeal || ''} ${meal.strInstructions || ''}`.toLowerCase();

  if (
    ingredients.length <= 5 &&
    steps.length <= 4 &&
    !text.includes('bake') &&
    !text.includes('roast') &&
    !text.includes('marinate')
  ) {
    return 'Easy';
  }

  let score = 0;

  // Ingredients
  if (ingredients.length >= 12) score += 2;
  else if (ingredients.length >= 8) score += 1;

  // Steps
  if (steps.length >= 10) score += 2;
  else if (steps.length >= 6) score += 1;

  // Cooking complexity
  if (
    text.includes('bake') ||
    text.includes('roast') ||
    text.includes('simmer') ||
    text.includes('knead')
  ) {
    score += 1;
  }

  // Category adjustment
  if (category.includes('dessert')) score += 1;
  if (category.includes('breakfast') || category.includes('starter')) score -= 1;

  if (score >= 5) return 'Hard';
  if (score >= 3) return 'Medium';
  return 'Easy';
};

const estimateNutrition = (ingredients) => {
  let protein = 0;
  let carbs = 0;
  let fat = 0;
  let fiber = 0;

  const text = ingredients.join(' ').toLowerCase();

  // Protein sources
  if (text.includes('chicken')) protein += 25;
  if (text.includes('beef')) protein += 30;
  if (text.includes('pork')) protein += 28;
  if (text.includes('egg')) protein += 12;
  if (text.includes('fish') || text.includes('salmon') || text.includes('tuna')) protein += 22;
  if (text.includes('tofu') || text.includes('bean')) protein += 15;

  // Carbs sources
  if (text.includes('rice')) carbs += 40;
  if (text.includes('pasta') || text.includes('noodle')) carbs += 45;
  if (text.includes('bread')) carbs += 30;
  if (text.includes('potato')) carbs += 35;

  // Fat sources
  if (text.includes('oil')) fat += 15;
  if (text.includes('butter')) fat += 20;
  if (text.includes('cheese')) fat += 18;
  if (text.includes('cream')) fat += 25;

  // Fiber sources
  if (text.includes('vegetable') || text.includes('carrot') || text.includes('broccoli')) fiber += 6;
  if (text.includes('bean')) fiber += 8;
  if (text.includes('fruit')) fiber += 5;

  return {
    protein: `${protein}g`,
    carbs: `${carbs}g`,
    fat: `${fat}g`,
    fiber: `${fiber}g`,
  };
};


export const normalizeMeal = meal => {
  const ingredients = [];
  const steps = [];

  for (let i = 1; i <= 20; i += 1) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];

    if (ingredient && ingredient.trim()) {
      ingredients.push(
        `${measure ? measure.trim() : ''} ${ingredient.trim()}`.trim()
      );
    }
  }

  if (meal.strInstructions) {
    meal.strInstructions
      .split(/\r?\n|\. /)
      .map(step => step.trim())
      .filter(Boolean)
      .forEach(step => steps.push(step.endsWith('.') ? step : `${step}.`));
  }

  const estimatedCookTime = getEstimatedCookTime(meal, ingredients, steps);
  const estimatedCalories = getEstimatedCalories(meal, ingredients);
  const difficulty = getDifficulty(meal, ingredients, steps);

  return {
    id: meal.idMeal,
    title: meal.strMeal || 'Untitled Recipe',
    image: meal.strMealThumb,
    description: meal.strInstructions
      ? meal.strInstructions.substring(0, 140) + '...'
      : 'Recipe information retrieved from TheMealDB API.',
    cookTime: estimatedCookTime,
    calories: estimatedCalories,
    servings: 1,
    difficulty,
    ingredients,
    steps,
    tags: [meal.strCategory, meal.strArea].filter(Boolean),
    nutrition: estimateNutrition(ingredients),
    source: 'TheMealDB',
  };
};