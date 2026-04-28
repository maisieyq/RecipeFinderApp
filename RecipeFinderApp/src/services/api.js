const API_URL = 'http://10.0.2.2:3000';

export const getRecipes = async () => {
  const res = await fetch(`${API_URL}/recipes`);
  return res.json();
};