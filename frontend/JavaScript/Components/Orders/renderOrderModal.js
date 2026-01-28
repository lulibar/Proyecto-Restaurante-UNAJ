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

export const createOrderModalContentHTML = (order) => {
    if (!order) {
        return '<p class="text-danger">Error: No se encontró la orden.</p>';
    }

    const deliveryLabel = getDeliveryLabel(order.deliveryType.name);

    const itemsHTML = order.items.map(item => `
        <li class="list-group-item d-flex justify-content-between align-items-center">
            <div>
                <div class="fw-bold">${item.quantity}x ${item.dish.name}</div>
                ${item.notes ? `<small class="text-muted">Notas: ${item.notes}</small>` : ''}
            </div>
            <span class="badge bg-secondary">${item.status.name}</span>
        </li>
    `).join('');

    return `
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
            ${itemsHTML}
        </ul>
    `;
};