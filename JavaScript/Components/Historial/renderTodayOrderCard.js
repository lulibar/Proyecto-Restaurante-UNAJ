import { getDeliveryLabel } from '../../Shared/utils.js';

export const createTodayOrderCardHTML = (order) => {
    return `
    <div class="card mb-3">
        <div class="card-header d-flex justify-content-between align-items-center">
            <h5 class="mb-0">Orden #${order.orderNumber}</h5>
            <span class="badge bg-primary fs-6">${order.status.name}</span>
        </div>
        <div class="card-body">
            <div class="row">
                <div class="col-md-8">
                    <h6>Items:</h6>
                    <ul class="list-unstyled">
                        ${order.items.map(i => `<li>- ${i.quantity}x ${i.dish.name} ${i.notes ? `<small class="text-muted">(${i.notes})</small>` : ''}</li>`).join('')}
                    </ul>
                </div>
                <div class="col-md-4 border-start">
                    <h6>Entrega:</h6>
                    <p class="mb-1"><strong>Tipo:</strong> ${order.deliveryType.name}</p>
                    ${order.deliveryTo ? `<p class="mb-1"><strong>${getDeliveryLabel(order.deliveryType.name)}:</strong> ${order.deliveryTo}</p>` : ''}
                </div>
            </div>
        </div>
        <div class="card-footer text-end">
            <button class="btn btn-sm btn-outline-secondary view-details-btn" 
                    data-order-number="${order.orderNumber}"
                    data-bs-toggle="modal"
                    data-bs-target="#reportOrderDetailModal">
                Ver Detalle Completo
            </button>
        </div>
    </div>
    `;
};