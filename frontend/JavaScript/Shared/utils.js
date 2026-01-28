let debounceTimeout;

export const debounce = (func, delay = 500) => {
    return (...args) => {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => func.apply(this, args), delay);
    };
};

export const getDeliveryLabel = (deliveryTypeName) => {
    switch (deliveryTypeName) {
        case 'Dine-In': 
            return 'Mesa:';
        case 'Take away':
            return 'Retira:';
        case 'Delivery':
            return 'Dirección:';
        default:
            return 'Detalle:';
    }
};

export const isUUID = (str) => {
    const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    return uuidRegex.test(str);
};