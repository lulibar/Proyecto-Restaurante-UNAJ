export const createPendingOrderItemHTML = (order) => {
    return `
    <div class="list-group-item list-group-item-action">
        <div class="d-flex w-100 justify-content-between">
            <h5 class="mb-1">Orden #${order.orderNumber}</h5>
            <small>Total: $${order.totalAmount.toFixed(2)}</small>
        </div>
        <p class="mb-1">
            <small>Entrega: ${order.deliveryType.name} - ${order.deliveryTo || 'Sin detalle'}</small>
        </p>
        <div class="mt-2 text-end">
            <button class="btn btn-sm btn-primary select-order-btn" 
                    data-order-number="${order.orderNumber}">
                <i class="fa-solid fa-edit me-1"></i> Editar
            </button>
        </div>
    </div>
    `;
};