const API_BASE_URL = 'https://localhost:7058/api/v1'; 

export const getCategories = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/Category`);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al obtener las categorías.');
        }
        return await response.json();
    } catch (error) {
        console.error('Error en getCategories:', error);
        throw error; 
    }
};


export const getDishes = async (filters = {}) => {
    try {
        const queryParams = new URLSearchParams();
        if (filters.name) queryParams.append('name', filters.name);
        if (filters.category) queryParams.append('category', filters.category);
        if (filters.sortByPrice) queryParams.append('sortByPrice', filters.sortByPrice);
        if (filters.onlyActive === true) queryParams.append('onlyActive', filters.onlyActive);
        
        const url = `${API_BASE_URL}/Dish?${queryParams.toString()}`;
        
        const response = await fetch(url);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al obtener los platos.');
        }
        return await response.json();
    } catch (error) {
        console.error('Error en getDishes:', error);
        throw error;
    }
};

export const createDish = async (dishData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/Dish`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dishData),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'No se pudo crear el plato.');
        }
        return await response.json();
    } catch (error) {
        console.error('Error en createDish:', error);
        throw error;
    }
};


export const updateDish = async (dishId, dishData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/Dish/${dishId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dishData),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'No se pudo actualizar el plato.');
        }
        return await response.json();
    } catch (error) {
        console.error('Error en updateDish:', error);
        throw error;
    }
};


export const deleteDish = async (dishId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/Dish/${dishId}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'No se pudo eliminar el plato.');
        }
        return await response.json();
    } catch (error) {
        console.error('Error en deleteDish:', error);
        throw error;
    }
};

export const getDishById = async (dishId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/Dish/${dishId}`);
        if (!response.ok) {
            if (response.status === 404) {
                return null;
            }
            const error = await response.json();
            throw new Error(error.message || 'Error al obtener el plato por ID.');
        }
        return await response.json();
    } catch (error) {
        console.error('Error en getDishById:', error);
        throw error;
    }
};