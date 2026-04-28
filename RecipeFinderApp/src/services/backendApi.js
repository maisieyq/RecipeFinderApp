const API_URL = 'http://10.0.2.2:3000';

const request = async (url, options = {}) => {
  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
};

export const getPantry = () => {
  return request(`${API_URL}/pantry`);
};

export const addPantryItem = item => {
  return request(`${API_URL}/pantry`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ingredientName: item.ingredientName,
      quantity: item.quantity || '',
      expiryDate: item.expiryDate || '',
    }),
  });
};

export const updatePantryItem = (id, item) => {
  return request(`${API_URL}/pantry/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(item),
  });
};

export const deletePantryItem = id => {
  return request(`${API_URL}/pantry/${id}`, {
    method: 'DELETE',
  });
};