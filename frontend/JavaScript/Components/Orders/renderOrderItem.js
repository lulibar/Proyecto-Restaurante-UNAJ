export const createOrderItemHTML = (item) => {
    return `
    <div class="list-group-item">
        <div class="d-flex justify-content-between align-items-center">
            <div>
                <h6 class="my-0">${item.name}</h6>
                <small class="text-muted">Precio: $${item.price.toFixed(2)}</small>
            </div>
            <div class="d-flex align-items-center">
                <button class="btn btn-sm btn-outline-secondary rounded-circle px-2 py-1 lh-1" data-dish-id="${item.id}" data-action="decrease">-</button>
                <span class="mx-2 fw-bold">${item.quantity}</span>
                <button class="btn btn-sm btn-outline-secondary rounded-circle px-2 py-1 lh-1" data-dish-id="${item.id}" data-action="increase">+</button>
            </div>
        </div>
        
        <input type="text" 
            class="form-control form-control-sm mt-2 comanda-item-notes" 
            placeholder="Notas (ej: sin sal...)" 
            value="${item.notes || ''}"
            data-dish-id="${item.id}">
        </div>
    `;
};