// Este archivo se encarga de "dibujar" partes de la página.
// No contiene lógica de negocio, solo genera HTML.

export const renderCategories = (categories, container) => {
    let buttonsHTML = '<button class="btn btn-secondary active" data-category-id="all">Todas</button>';
    buttonsHTML += categories.map(category => `<button class="btn btn-outline-secondary" data-category-id="${category.id}">${category.name}</button>`).join('');
    container.innerHTML = buttonsHTML;
};

export const renderDishes = (dishes, container) => {
    if (dishes.length === 0) {
        container.innerHTML = '<div class="col-12"><p class="text-center">No se encontraron platos.</p></div>';
        return;
    }

    // 1. Agrupamos los platos por el nombre de su categoría
    const dishesByCategory = dishes.reduce((acc, dish) => {
        const categoryName = dish.category.name;
        if (!acc[categoryName]) {
            acc[categoryName] = []; // Si la categoría no existe en nuestro grupo, la creamos
        }
        acc[categoryName].push(dish); // Agregamos el plato a su categoría correspondiente
        return acc;
    }, {});

    // 2. Generamos el HTML con secciones
    let dishesHTML = '';
    for (const categoryName in dishesByCategory) {
        // Añadimos un título de sección para cada categoría
        dishesHTML += `
            <div class="col-12">
                <h3 class="mt-4 mb-3">${categoryName}</h3>
                <hr>
            </div>
        `;

        // Renderizamos las tarjetas de los platos de esa categoría
        dishesHTML += dishesByCategory[categoryName].map(dish => {
            const imageUrl = (dish.image && dish.image.startsWith('http')) 
                ? dish.image 
                : 'https://placehold.co/300x200';
            return `
            <div class="col"><div class="card h-100">
                <img src="${imageUrl}" class="card-img-top" alt="${dish.name}">
                <div class="card-body">
                    <h5 class="card-title">${dish.name}</h5>
                    <p class="card-text text-truncate">${dish.description || 'Sin descripción.'}</p>
                    <p class="card-text"><strong>Precio: $${dish.price.toFixed(2)}</strong></p>
                </div>
                <div class="card-footer d-flex justify-content-between align-items-center">
                    <button class="btn btn-sm btn-outline-secondary view-dish-details-btn" 
                            data-dish-id="${dish.id}"
                            data-bs-toggle="modal"
                            data-bs-target="#dishDetailsModal">
                        Ver Detalles
                    </button>
                    <button class="btn btn-primary add-dish-btn" data-dish-id="${dish.id}">
                        <i class="fa-solid fa-plus"></i> Agregar
                    </button>
                </div>
            </div></div>`;
        }).join('');
    }

    container.innerHTML = dishesHTML;
};

export const renderComanda = (comanda, container, totalElement, confirmButton) => {
    if (comanda.length === 0) {
        container.innerHTML = '<p class="text-muted text-center">Aún no has agregado platos.</p>';
        totalElement.textContent = '$0.00';
        confirmButton.disabled = true;
        return;
    }
    const comandaHTML = comanda.map(item => `
        <div class="list-group-item">
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <h6 class="my-0">${item.name}</h6>
                    <small class="text-muted">Precio: $${item.price.toFixed(2)}</small>
                </div>
                <div class="d-flex align-items-center">
                    <button class="btn btn-sm btn-outline-secondary" data-dish-id="${item.id}" data-action="decrease">-</button>
                    <span class="mx-2">${item.quantity}</span>
                    <button class="btn btn-sm btn-outline-secondary" data-dish-id="${item.id}" data-action="increase">+</button>
                </div>
            </div>
            
            <input type="text" 
                class="form-control form-control-sm mt-2 comanda-item-notes" 
                placeholder="Notas (ej: sin sal, punto de cocción...)" 
                value="${item.notes}"
                data-dish-id="${item.id}">
            </div>
    `).join('');
    container.innerHTML = comandaHTML;
    const total = comanda.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    totalElement.textContent = `$${total.toFixed(2)}`;
    confirmButton.disabled = false;
};

export const renderDeliveryTypes = (deliveryTypes, container) => { 
    if (deliveryTypes.length === 0) return;
    const deliveryHTML = deliveryTypes.map(type => `
        <div class="form-check">
            <input class="form-check-input" type="radio" name="deliveryType" id="deliveryType-${type.id}" value="${type.id}">
            <label class="form-check-label" for="deliveryType-${type.id}">${type.name}</label>
        </div>
    `).join('');
    container.innerHTML = deliveryHTML;
};

export const renderPendingOrdersModal = (orders, container) => {
    if (orders.length === 0) {
        container.innerHTML = '<p class="text-center">No hay órdenes pendientes para modificar.</p>';
        return;
    }
    const ordersHTML = `
        <div class="list-group">
            ${orders.map(order => `
                <div class="list-group-item">
                    <div class="d-flex w-100 justify-content-between">
                        <h5 class="mb-1">Orden #${order.orderNumber}</h5>
                        <small>Total: $${order.totalAmount.toFixed(2)}</small>
                    </div>
                    
                    <small>Entrega: ${order.deliveryType.name}</small>

                    <div class="mt-2 text-end">
                        <button class="btn btn-sm btn-primary select-order-btn ms-2" 
                                data-order-number="${order.orderNumber}">
                            Editar
                        </button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    container.innerHTML = ordersHTML;
};

export const renderDishDetailsModal = (dish, container) => {
    if (!dish) {
        container.innerHTML = '<p class="text-danger">Error: No se encontró el plato.</p>';
        return;
    }

    const availabilityBadge = dish.isActive
        ? '<span class="badge bg-success">Disponible</span>'
        : '<span class="badge bg-danger">No Disponible</span>';

    const detailsHTML = `
        <img src="${dish.image || 'https://placehold.co/600x400'}" class="img-fluid rounded mb-3" alt="${dish.name}">
        <h3>${dish.name}</h3>
        <p class="lead">${dish.description || 'Sin descripción detallada.'}</p>
        <div class="d-flex justify-content-between align-items-center">
            <h4>Precio: <span class="fw-bold text-primary">$${dish.price.toFixed(2)}</span></h4>
            <h5>Disponibilidad: ${availabilityBadge}</h5>
        </div>
    `;
    container.innerHTML = detailsHTML;
};