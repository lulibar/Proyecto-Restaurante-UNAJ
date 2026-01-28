
/* export const renderStatusColumns = (statuses, container) => {
    const filteredStatuses = statuses.filter(s => s.name !== 'Entregado' && s.name !== 'Cancelado');

    const columnsHTML = filteredStatuses.map(status => `
        <div class="col-md-3">
            <div class="card bg-light">
                <div class="card-header text-center">
                    <h5 class="card-title">${status.name}</h5>
                </div>
                <div class="card-body" id="status-col-${status.id}" data-status-id="${status.id}">
                    </div>
            </div>
        </div>
    `).join('');
    container.innerHTML = columnsHTML;
};

export const renderOrderCards = (orders, statuses) => {
    document.querySelectorAll('[data-status-id]').forEach(col => col.innerHTML = '');

    orders.forEach(order => {
        const column = document.getElementById(`status-col-${order.status.id}`);
        if (column) {
            const card = document.createElement('div');
            card.className = 'card shadow-sm mb-3';
            card.setAttribute('data-order-id', order.orderNumber);
            card.innerHTML = `
                <div class="card-header d-flex justify-content-between">
                    <h6 class="my-0">Orden #${order.orderNumber}</h6>
                    <span class="badge bg-info text-dark">${order.deliveryType.name}</span>
                </div>
                <ul class="list-group list-group-flush">
                    ${order.items.map(item => {
                        const nextStatus = statuses.find(s => s.id > item.status.id && s.name !== 'Cancelado' && s.name !== 'Entregado');
                        return `
                        <li class="list-group-item d-flex justify-content-between align-items-center">
                            <div>
                                ${item.quantity}x ${item.dish.name}
                                <br>
                                <small class="badge bg-secondary">${item.status.name}</small>
                            </div>
                            ${nextStatus ? `
                            <button class="btn btn-outline-primary btn-sm move-item-btn"
                                    data-order-number="${order.orderNumber}"
                                    data-item-id="${item.id}"
                                    data-next-status-id="${nextStatus.id}">
                                ${nextStatus.name}
                            </button>
                            ` : '<span class="badge bg-success">Listo</span>'}
                        </li>
                        `;
                    }).join('')}
                </ul>
                <div class="card-footer text-end">
                    <button class="btn btn-sm btn-outline-secondary view-details-btn"
                            data-order-number="${order.orderNumber}"
                            data-bs-toggle="modal"
                            data-bs-target="#orderDetailsModal">
                        Ver Detalle
                    </button>
                </div>
                `;
            column.appendChild(card);
        }
    });
};

export const renderOrderDetailsModal = (order, container) => {
    if (!order) {
        container.innerHTML = '<p class="text-danger">Error: No se encontró la orden.</p>';
        return;
    }

    const deliveryLabel = getDeliveryLabel(order.deliveryType.name);

    const detailsHTML = `
        <div class="mb-3">
            <strong>Número de Orden:</strong> #${order.orderNumber}<br>
            <strong>Estado General:</strong> <span class="badge bg-primary">${order.status.name}</span><br>
            <strong>Fecha de Creación:</strong> ${new Date(order.createdAt).toLocaleString()}<br>
            <strong>Tipo de Entrega:</strong> ${order.deliveryType.name}<br>
            
            ${order.deliveryTo ? `<strong>${deliveryLabel}</strong> ${order.deliveryTo}<br>` : ''}
            
            <strong>Total:</strong> <span class="fw-bold">$${order.totalAmount.toFixed(2)}</span>
        </div>
        <h5>Platos</h5>
        <ul class="list-group">
            ${order.items.map(item => `
                <li class="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                        <div class="fw-bold">${item.quantity}x ${item.dish.name}</div>
                        ${item.notes ? `<small class="text-muted">Notas: ${item.notes}</small>` : ''}
                    </div>
                    <span class="badge bg-secondary">${item.status.name}</span>
                </li>
            `).join('')}
        </ul>
    `;
    container.innerHTML = detailsHTML;
};

const getDeliveryLabel = (deliveryTypeName) => {
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
*/