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
let confirmationModalInstance = null; // Instancia del modal
const confirmationModalElement = document.getElementById('confirmationModal'); // El modal completo
const confirmationModalBody = document.getElementById('confirmationModalBody'); // El cuerpo del modal
const confirmActionBtn = document.getElementById('confirmActionBtn'); // El botón de confirmar
let actionToConfirm = null;

const showConfirmationModal = (message, onConfirmCallback) => {
    confirmationModalBody.textContent = message;
    actionToConfirm = onConfirmCallback; 
    if (!confirmationModalInstance) {
        confirmationModalInstance = new bootstrap.Modal(confirmationModalElement);
    }
    confirmationModalInstance.show();
};

const setupConfirmationModal = () => {
    if (confirmActionBtn) {
        confirmActionBtn.addEventListener('click', () => {
        
            if (typeof actionToConfirm === 'function') {
                try {
                    actionToConfirm(); 
                } catch (error) {
                    alert("Ocurrió un error inesperado al confirmar."); 
                }
            } else {
                console.warn('No hay ninguna acción definida para confirmar.'); 
            }
        });
    } else {
        console.error('¡Error crítico! No se encontró el botón confirmActionBtn en el HTML.'); 
    }
    if(confirmationModalElement) {
        confirmationModalElement.addEventListener('hidden.bs.modal', () => {
            actionToConfirm = null; 
        });
    }
};
const refreshOrders = async () => {
    try {
        const orders = await getOrders();
        state.orders = orders.filter(o => o.status.name !== 'Entregado' && o.status.name !== 'Cancelado');
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

const handleCancelItem = (orderNumber, itemId) => {
    const order = state.orders.find(o => o.orderNumber === orderNumber);
    if (!order) return;
    const item = order.items.find(i => i.id === itemId);
    if (!item) return;
    
    const CANCELLED_STATUS_ID = 5; 

    showConfirmationModal(
        `¿Estás seguro de que quieres cancelar el item "${item.quantity}x ${item.dish.name}" de la Orden #${orderNumber}?`,
        async () => { 
            try {
                await updateOrderItemStatus(orderNumber, itemId, CANCELLED_STATUS_ID); 
                await refreshOrders(); 
                confirmationModalInstance.hide();
            } catch (error) {
                console.error("Error al cancelar el item:", error);
                alert(`Error al cancelar el item: ${error.message}`);
                confirmationModalInstance.hide();
            }
        }
    );
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
            column.insertAdjacentHTML('beforeend', cardHTML);
        }
    });
};

export const initPanelPage = async () => {
    try {
        const [statuses, orders] = await Promise.all([getStatuses(), getOrders()]);
        
        state.statuses = statuses;
        state.orders = orders.filter(o => o.status.name !== 'Entregado' && o.status.name !== 'Cancelado');
        
        renderColumns();
        renderCards();
        initializePanelHandlers(ordersBoardContainer, handleItemStatusUpdate, showOrderDetails, handleCancelItem);
        setupConfirmationModal(); 
    } catch (error) {
        console.error("Error al inicializar el panel:", error);
        ordersBoardContainer.innerHTML = '<p class="text-danger text-center">No se pudieron cargar las órdenes.</p>';
    }
};