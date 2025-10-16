const API_BASE_URL = 'https://localhost:7058/api/v1'; 

export const getDeliveryTypes = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/DeliveryType`);
        if (!response.ok) {
            throw new Error('Error al obtener los tipos de entrega.');
        }
        return await response.json();
    } catch (error) {
        console.error('Error en getDeliveryTypes:', error);
        throw error;
    }
};


export const createOrder = async (orderData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/Order`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'No se pudo crear la orden.');
        }
        return await response.json();
    } catch (error) {
        console.error('Error en createOrder:', error);
        throw error;
    }
};

export const getOrders = async (filters = {}) => {
    try {
        const queryParams = new URLSearchParams(filters);
        const response = await fetch(`${API_BASE_URL}/Order?${queryParams}`);
        if (!response.ok) {
            throw new Error('Error al obtener las órdenes.');
        }
        return await response.json();
    } catch (error) {
        console.error('Error en getOrders:', error);
        throw error;
    }
};


export const getStatuses = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/Status`);
        if (!response.ok) {
            throw new Error('Error al obtener los estados.');
        }
        return await response.json();
    } catch (error) {
        console.error('Error en getStatuses:', error);
        throw error;
    }
};

export const updateOrderItemStatus = async (orderId, itemId, newStatusId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/Order/${orderId}/item/${itemId}`, {
            method: 'PATCH', 
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: newStatusId }),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'No se pudo actualizar el estado del ítem.');
        }
        return await response.json();
    } catch (error) {
        console.error('Error en updateOrderItemStatus:', error);
        throw error;
    }
};

export const patchOrder  = async (orderNumber, orderData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/Order/${orderNumber}`, {
            method: 'PATCH', 
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'No se pudo actualizar la orden.');
        }
        return await response.json();
    } catch (error) {
        console.error('Error en patchOrder:', error);
        throw error;
    }
};