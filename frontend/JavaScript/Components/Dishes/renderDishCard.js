// renderDishCard.js (Modificado)

export const createDishCardHTML = (dish) => {
    const imageUrl = (dish.image && dish.image.startsWith('http')) 
        ? dish.image 
        : 'https://placehold.co/300x200'; // Placeholder
    
    return `
    <div class="col">
        <div class="card h-100 shadow-sm dish-card">
            <img src="${imageUrl}" class="card-img-top" alt="${dish.name}">
            
            <div class="card-body d-flex flex-column">
                <h6 class="card-title" title="${dish.name}">${dish.name}</h6>
                <p class="card-text small text-muted flex-grow-1">${dish.description || 'Sin descripción.'}</p>
                
                <div class="mt-auto">
                    <span class="fw-bold text-dark">$${dish.price.toFixed(2)}</span>
                    <div class="d-flex justify-content-between align-items-center mt-2">
                        <button class="btn btn-sm btn-outline-secondary view-dish-details-btn" 
                                data-dish-id="${dish.id}"
                                data-bs-toggle="modal"
                                data-bs-target="#dishDetailsModal">
                            Detalles
                        </button>
                        <button class="btn btn-sm btn-danger add-dish-btn" data-dish-id="${dish.id}">
                            <i class="fa-solid fa-plus"></i> Agregar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
};