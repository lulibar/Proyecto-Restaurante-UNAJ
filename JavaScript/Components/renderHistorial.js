export const renderTodaysOrdersList = (orders, container) => {
    if (orders.length === 0) {
        container.innerHTML = '<p class="text-center mt-3">No se encontraron órdenes para el día de hoy.</p>';
        return;
    }
    const ordersHTML = orders.map(order => `
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
                        ${order.deliveryTo ? `<p class="mb-1"><strong>Dirección:</strong> ${order.deliveryTo}</p>` : ''}
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
    `).join('');
    container.innerHTML = ordersHTML;
};

export const renderHistoryTable = (orders, container) => {
    if (orders.length === 0) {
        container.innerHTML = '<tr><td colspan="5" class="text-center">No se encontraron órdenes para el período seleccionado.</td></tr>';
        return;
    }
    const rowsHTML = orders.map(order => `
        <tr>
            <td>#${order.orderNumber}</td>
            <td>${new Date(order.createdAt).toLocaleString()}</td>
            <td>${order.deliveryType.name}</td>
            <td><span class="badge bg-primary">${order.status.name}</span></td>
            <td>$${order.totalAmount.toFixed(2)}</td>
        </tr>
    `).join('');
    container.innerHTML = rowsHTML;
};

export const renderSalesSummary = (orders, container) => {
    const totalSales = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const numberOfOrders = orders.length;

    const summaryHTML = `
        <div class="alert alert-success">
            <h5>Resumen del Período</h5>
            <p class="mb-1"><strong>Total de Ventas:</strong> $${totalSales.toFixed(2)}</p>
            <p class="mb-0"><strong>Cantidad de Órdenes:</strong> ${numberOfOrders}</p>
        </div>
    `;
    container.innerHTML = summaryHTML;
};

export const renderOrderDetailsModal = (order, container) => {
    if (!order) {
        container.innerHTML = '<p class="text-danger">Error: No se encontró la orden.</p>';
        return;
    }
    const detailsHTML = `
        <div class="mb-3">
            <strong>Número de Orden:</strong> #${order.orderNumber}<br>
            <strong>Estado General:</strong> <span class="badge bg-primary">${order.status.name}</span><br>
            <strong>Fecha de Creación:</strong> ${new Date(order.createdAt).toLocaleString()}<br>
            <strong>Última Actualización:</strong> ${new Date(order.updatedAt).toLocaleString()}<br>
            <strong>Tipo de Entrega:</strong> ${order.deliveryType.name}<br>
            ${order.deliveryTo ? `<strong>Dirección:</strong> ${order.deliveryTo}<br>` : ''}
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

export const renderStatusFilterOptions = (statuses, selectElement) => {
    const optionsHTML = statuses.map(status => `<option value="${status.id}">${status.name}</option>`).join('');
    selectElement.innerHTML += optionsHTML;
};