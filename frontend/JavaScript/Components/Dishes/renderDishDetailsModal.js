export const createDishDetailsModalContentHTML = (dish) => {
    if (!dish) {
        return '<p class="text-danger">Error: No se encontró el plato.</p>';
    }

    const availabilityBadge = dish.isActive
        ? '<span class="badge bg-success">Disponible</span>'
        : '<span class="badge bg-danger">No Disponible</span>';

    return `
        <img src="${dish.image || 'https://placehold.co/600x400'}" class="img-fluid rounded mb-3" alt="${dish.name}">
        <h3>${dish.name}</h3>
        <p class="lead">${dish.description || 'Sin descripción detallada.'}</p>
        <div class="d-flex justify-content-between align-items-center">
            <h4>Precio: <span class="fw-bold text-dark">$${dish.price.toFixed(2)}</span></h4>
            <h5>${availabilityBadge}</h5>
        </div>
    `;
};