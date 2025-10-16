import { getOrders, getStatuses, updateOrderItemStatus } from '../APIs/OrderApi.js';
import { createColumnHTML } from '../Components/Orders/renderOrderColumn.js';
import { createOrderCardHTML } from '../Components/Orders/renderOrderCard.js';
import { createOrderModalContentHTML } from '../Components/Orders/renderOrderModal.js';
import { initializePanelHandlers } from '../Handlers/Orders/panelHandler.js';

const state = {
    orders: [],
    statuses: [],
};
const ordersBoardContainer = document.getElementById('orders-board-container');
const orderDetailsContent = document.getElementById('order-details-content');

const refreshOrders = async () => {
    try {
        const orders = await getOrders();
        state.orders = orders.filter(o => o.status.name !== 'Entregado' && o.body.status.name !== 'Cancelado');
        renderCards(); 
    } catch (error) {
        console.error("Error al refrescar las órdenes:", error);
    }
};

const handleItemStatusUpdate = async (orderNumber, itemId, nextStatusId) => {
    try {
        await updateOrderItemStatus(orderNumber, itemId, nextStatusId);
        await refreshOrders();
    } catch (error) {
        alert(`Error al actualizar el ítem: ${error.message}`);
    }
};

const showOrderDetails = (orderNumber) => {
    const order = state.orders.find(o => o.orderNumber === orderNumber);
    if (order) {
        orderDetailsContent.innerHTML = createOrderModalContentHTML(order);
    }
};

const renderColumns = () => {
    const filteredStatuses = state.statuses.filter(s => s.name !== 'Entregado' && s.name !== 'Cancelado');
    ordersBoardContainer.innerHTML = filteredStatuses.map(status => createColumnHTML(status)).join('');
};

const renderCards = () => {
    document.querySelectorAll('[data-status-id]').forEach(col => col.innerHTML = '');

    state.orders.forEach(order => {
        const column = document.getElementById(`status-col-${order.status.id}`);
        if (column) {
            const cardHTML = createOrderCardHTML(order, state.statuses);
            // insertAdjacentHTML es más eficiente que .innerHTML +=
            column.insertAdjacentHTML('beforeend', cardHTML);
        }
    });
};

export const initPanelPage = async () => {
    try {
        const [statuses, orders] = await Promise.all([getStatuses(), getOrders()]);
        
        state.statuses = statuses;
        state.orders = orders.filter(o => o.status.name !== 'Entregado' && o.status.name !== 'Cancelado');
        
        // Flujo: Dibuja la estructura, luego las tarjetas, y al final les da vida
        renderColumns();
        renderCards();
        initializePanelHandlers(ordersBoardContainer, handleItemStatusUpdate, showOrderDetails);

    } catch (error) {
        console.error("Error al inicializar el panel:", error);
        ordersBoardContainer.innerHTML = '<p class="text-danger text-center">No se pudieron cargar las órdenes.</p>';
    }
};