export const createSalesSummaryHTML = (orders) => {
    const totalSales = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const numberOfOrders = orders.length;

    return `
    <div class="alert alert-success">
        <h5>Resumen del Período</h5>
        <p class="mb-1"><strong>Total de Ventas:</strong> $${totalSales.toFixed(2)}</p>
        <p class="mb-0"><strong>Cantidad de Órdenes:</strong> ${numberOfOrders}</p>
    </div>
    `;
};