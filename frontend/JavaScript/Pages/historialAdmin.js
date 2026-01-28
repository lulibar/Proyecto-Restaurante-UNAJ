// 1. IMPORTACIONES
import { getOrders, getStatuses } from '../APIs/OrderApi.js';
import { createTodayOrderCardHTML } from '../Components/Historial/renderTodayOrderCard.js';
import { createHistoryTableRowHTML } from '../Components/Historial/renderHistoryTableRow.js';
import { createSalesSummaryHTML } from '../Components/Historial/renderSalesSummary.js';
import { createStatusFilterOptionsHTML } from '../Components/Historial/rendreStatusFilterOptions.js';
import { createOrderModalContentHTML } from '../Components/Orders/renderOrderModal.js'; 
import { setupHistorySearch, setupTodaysOrdersActions } from '../Handlers/Historial/historialHandler.js';

// 2. ESTADO DE LA PÁGINA
const state = {
    todaysOrders: [],
    searchTerm: '', 
    statuses: []
};

// 3. ELEMENTOS DEL DOM
const todaysOrdersContainer = document.getElementById('todays-orders-container');
const historyOrdersBody = document.getElementById('history-orders-body');
const salesSummaryContainer = document.getElementById('sales-summary-container');
const orderDetailsContent = document.getElementById('report-order-details-content');
const statusFilterSelect = document.getElementById('history-status-filter');

// 4. LÓGICA DE RENDERIZADO
const renderTodaysOrders = () => {
    const searchTerm = state.searchTerm.toLowerCase();
    const filteredOrders = state.todaysOrders.filter(order => 
        order.orderNumber.toString().includes(searchTerm)
    );

    if (filteredOrders.length === 0) {
        todaysOrdersContainer.innerHTML = '<p class="text-center mt-3">No se encontraron órdenes.</p>';
        return;
    }
    todaysOrdersContainer.innerHTML = filteredOrders.map(createTodayOrderCardHTML).join('');
};

const renderHistory = (orders) => {
    if (orders.length === 0) {
        historyOrdersBody.innerHTML = '<tr><td colspan="5" class="text-center">No se encontraron órdenes para el período seleccionado.</td></tr>';
        salesSummaryContainer.innerHTML = '';
        return;
    }
    historyOrdersBody.innerHTML = orders.map(createHistoryTableRowHTML).join('');
    salesSummaryContainer.innerHTML = createSalesSummaryHTML(orders);
};

const renderStatusOptions = () => {
    statusFilterSelect.innerHTML += createStatusFilterOptionsHTML(state.statuses);
};

const loadTodaysOrders = async () => {
    try {
        todaysOrdersContainer.innerHTML = '<p>Cargando...</p>';
        const today = new Date();
        const from = new Date(today.setHours(0, 0, 0, 0)).toISOString();
        const to = new Date(today.setHours(23, 59, 59, 999)).toISOString();

        const orders = await getOrders({ from, to });
        state.todaysOrders = orders;
        renderTodaysOrders();
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
        if (fromDate) filters.from = new Date(fromDate).toISOString();
        if (toDate) filters.to = new Date(new Date(toDate).setHours(23, 59, 59, 999)).toISOString();
        if (statusId) filters.statusId = statusId;

        const orders = await getOrders(filters); 
        renderHistory(orders);
    } catch (error) {
        console.error("Error al buscar historial:", error);
        historyOrdersBody.innerHTML = '<tr><td colspan="5" class="text-danger text-center">Error al buscar las órdenes.</td></tr>';
    }
};

const showOrderDetails = (orderNumber) => {
    // Buscamos en las órdenes de hoy (o podríamos necesitar buscar en el historial también)
    const order = state.todaysOrders.find(o => o.orderNumber === orderNumber);
    if (order) {
        orderDetailsContent.innerHTML = createOrderModalContentHTML(order);
    }
};

const handleSearchInput = (term) => {
    state.searchTerm = term;
    renderTodaysOrders();
};

// 6. INICIALIZACIÓN DE LA PÁGINA
export const initHistoryPage = async () => {
    try {
        const statuses = await getStatuses();
        state.statuses = statuses;
        renderStatusOptions();
    } catch (error) {
        console.error("Error al cargar los estados:", error);
    }
    
    loadTodaysOrders(); 
    setupHistorySearch(handleHistorySearch);
    setupTodaysOrdersActions({
        onSearch: handleSearchInput,
        onViewDetails: showOrderDetails,
    });
};