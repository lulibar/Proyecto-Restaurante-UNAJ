export const createOrderCardHTML = (order, statuses) => {
    const itemsHTML = order.items.map(item => {
        const nextStatus = statuses.find(s => s.id > item.status.id && s.name !== 'Cancelado' && s.name !== 'Entregado');
        const CANCELLED_STATUS_ID = 5; 
        const cancelButtonHTML = (item.status.id !== CANCELLED_STATUS_ID && item.status.name !== 'Entregado') ? ` 
            <button type="button" 
                    class="btn-close cancel-item-btn" 
                    aria-label="Cancelar item"
                    title="Cancelar este item"
                    style="font-size: 0.75rem;" 
                    data-order-number="${order.orderNumber}"
                    data-item-id="${item.id}">
            </button>
        ` : '<div style="height: 1.25rem;"></div>'; 

        const moveButtonHTML = nextStatus ? `
            <button class="btn btn-primary btn-sm move-item-btn mt-1" 
                    data-order-number="${order.orderNumber}"
                    data-item-id="${item.id}"
                    data-next-status-id="${nextStatus.id}">
                ${nextStatus.name}
            </button>
        ` : (item.status.id !== CANCELLED_STATUS_ID ? '<span class="badge bg-success mt-1">Listo</span>' : '');

        return `
        <li class="list-group-item d-flex justify-content-between align-items-start">
            
            <div>
                ${item.quantity}x ${item.dish.name}
                <br>
                <small class="badge bg-secondary mt-1">${item.status.name}</small>
            </div>

            <div class="d-flex flex-column align-items-end">
                ${cancelButtonHTML}
                ${moveButtonHTML}
            </div>
        </li>
        `;
    }).join('');

    return `
        <div class="card shadow-sm mb-3" data-order-id="${order.orderNumber}">
            <div class="card-header d-flex justify-content-between">
                <h6 class="my-0">Orden #${order.orderNumber}</h6>
                <span class="badge bg-info text-dark">${order.deliveryType.name}</span>
            </div>
            <ul class="list-group list-group-flush">
                ${itemsHTML}
            </ul>
            <div class="card-footer text-end">
                <button class="btn btn-sm btn-outline-secondary view-details-btn"
                        data-order-number="${order.orderNumber}"
                        data-bs-toggle="modal"
                        data-bs-target="#orderDetailsModal">
                    Ver Detalle
                </button>
            </div>
        </div>
    `;
};