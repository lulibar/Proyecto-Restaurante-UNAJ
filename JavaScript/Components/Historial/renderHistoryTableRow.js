export const createHistoryTableRowHTML = (order) => {
    return `
    <tr>
        <td>#${order.orderNumber}</td>
        <td>${new Date(order.createdAt).toLocaleString()}</td>
        <td>${order.deliveryType.name}</td>
        <td><span class="badge bg-primary">${order.status.name}</span></td>
        <td>$${order.totalAmount.toFixed(2)}</td>
    </tr>
    `;
};