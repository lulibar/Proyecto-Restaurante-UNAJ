import renderNavbar from '../Shared/navbar.js';
import { getOrders, getStatuses } from '../APIs/OrderApi.js';
import { renderTodaysOrdersList, renderHistoryTable, renderSalesSummary, renderOrderDetailsModal, renderStatusFilterOptions } from '../Components/renderHistorial.js';
import { setupHistorySearch, setupTodaysOrdersActions } from '../Handlers/historialHandler.js';

// --- ESTADO DE LA PÁGINA ---
const state = {
    todaysOrders: [],
    searchTerm: '',   
    statuses: []
};

// --- ELEMENTOS DEL DOM ---
const todaysOrdersContainer = document.getElementById('todays-orders-container');
const historyOrdersBody = document.getElementById('history-orders-body');
const salesSummaryContainer = document.getElementById('sales-summary-container');
const orderDetailsContent = document.getElementById('report-order-details-content');
const statusFilterSelect = document.getElementById('history-status-filter');


// --- LÓGICA DE LA APLICACIÓN ---
const filterAndRenderTodaysOrders = () => {
    const searchTerm = state.searchTerm.toLowerCase();
    const filteredOrders = state.todaysOrders.filter(order => 
        order.orderNumber.toString().includes(searchTerm)
    );
    renderTodaysOrdersList(filteredOrders, todaysOrdersContainer);
};

const loadTodaysOrders = async () => {
    try {
        todaysOrdersContainer.innerHTML = '<p>Cargando...</p>';
        const today = new Date();
        const from = new Date(today.setHours(0, 0, 0, 0)).toISOString();
        const to = new Date(today.setHours(23, 59, 59, 999)).toISOString();

        const orders = await getOrders({ from, to });
        state.todaysOrders = orders; // Guardamos la lista completa
        filterAndRenderTodaysOrders(); // Renderizamos (ya filtrando si hay algo)
    } catch (error) {
        console.error("Error al cargar órdenes del día:", error);
        todaysOrdersContainer.innerHTML = '<p class="text-danger">Error al cargar las órdenes.</p>';
    }
};

const handleHistorySearch = async (fromDate, toDate, statusId) => {
    try {
        historyOrdersBody.innerHTML = '<tr><td colspan="5" class="text-center">Buscando...</td></tr>';
        salesSummaryContainer.innerHTML = '';

        const filters = {};

        if (fromDate) {
            filters.from = new Date(fromDate).toISOString();
        }
        if (toDate) {
            filters.to = new Date(new Date(toDate).setHours(23, 59, 59, 999)).toISOString();
        }
        
        if (statusId) {
            filters.statusId = statusId;
        }

        const orders = await getOrders(filters); 
        renderHistoryTable(orders, historyOrdersBody);
        renderSalesSummary(orders, salesSummaryContainer);
    } catch (error) {
        console.error("Error al buscar historial:", error);
        historyOrdersBody.innerHTML = '<tr><td colspan="5" class="text-danger text-center">Error al buscar las órdenes.</td></tr>';
    }
};

const showOrderDetails = (orderNumber) => {
    const order = state.todaysOrders.find(o => o.orderNumber === orderNumber);
    renderOrderDetailsModal(order, orderDetailsContent);
};

// --- INICIALIZACIÓN ---
const initializePage = async () => {
    try {
        const statuses = await getStatuses();
        state.statuses = statuses;
        renderStatusFilterOptions(state.statuses, statusFilterSelect);
    } catch (error) {
        console.error("Error al cargar los estados:", error);
    }
    loadTodaysOrders(); 
    setupHistorySearch(handleHistorySearch);
    setupTodaysOrdersActions({
        onSearch: (term) => {
            state.searchTerm = term;
            filterAndRenderTodaysOrders();
        },
        onViewDetails: showOrderDetails,
    });
};

document.addEventListener('DOMContentLoaded', () => {
    renderNavbar();
    initializePage();
});