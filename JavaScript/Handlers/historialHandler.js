let debounceTimeout;
const debounce = (func, delay = 500) => {
    return (...args) => {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => func.apply(this, args), delay);
    };
};

// js/Handlers/reportsPageHandlers.js

export const setupHistorySearch = (onSearch) => {
    const searchBtn = document.getElementById('search-history-btn');
    const fromDateInput = document.getElementById('from-date');
    const toDateInput = document.getElementById('to-date');
    const statusFilter = document.getElementById('history-status-filter');

    searchBtn.addEventListener('click', () => {
        const from = fromDateInput.value;
        const to = toDateInput.value;
        const statusId = statusFilter.value;


        if (!from && !to && !statusId) {
            alert('Por favor, selecciona al menos un filtro para buscar (fechas o estado).');
            return;
        }
        if ((from && !to) || (!from && to)) {
            alert('Por favor, selecciona un rango de fechas completo (Desde y Hasta).');
            return;
        }

        onSearch(from, to, statusId);
    });
};

export const setupTodaysOrdersActions = (actions) => {
    const searchInput = document.getElementById('todays-order-search');
    const container = document.getElementById('todays-orders-container');

    const debouncedSearch = debounce(actions.onSearch, 500);
    searchInput.addEventListener('input', (e) => {
        debouncedSearch(e.target.value);
    });

    container.addEventListener('click', (e) => {
        const detailsButton = e.target.closest('.view-details-btn');
        if (detailsButton) {
            const orderNumber = parseInt(detailsButton.getAttribute('data-order-number'));
            actions.onViewDetails(orderNumber);
        }
    });
};