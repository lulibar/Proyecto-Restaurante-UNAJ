import { debounce } from '../../Shared/utils.js';

export const setupFilterHandlers = (onFilterChange) => {
    const categoryFiltersContainer = document.getElementById('category-filters');
    const searchInput = document.getElementById('search-input');
    const sortByPriceSelect = document.getElementById('sort-by-price');
    const onlyActiveSwitch = document.getElementById('only-active-switch');

    categoryFiltersContainer.addEventListener('click', (event) => {
        if (event.target.tagName === 'BUTTON') {
            document.querySelectorAll('#category-filters button').forEach(btn => btn.classList.remove('active', 'btn-secondary'));
            document.querySelectorAll('#category-filters button').forEach(btn => btn.classList.add('btn-outline-secondary'));

            event.target.classList.add('active', 'btn-secondary');
            event.target.classList.remove('btn-outline-secondary');
            
            const categoryId = event.target.getAttribute('data-category-id');
            onFilterChange({ category: categoryId === 'all' ? null : categoryId });
        }
    });

    const debouncedSearch = debounce(() => onFilterChange({}), 500); // Llama a onFilterChange sin argumentos específicos
    searchInput.addEventListener('input', (event) => {
        // Actualizamos el estado directamente en la página, el handler solo notifica
        onFilterChange({ name: event.target.value }); // Pasamos el cambio específico
        debouncedSearch(); // Llamamos al debounce que llamará a onFilterChange de nuevo
    });

    sortByPriceSelect.addEventListener('change', (event) => {
        onFilterChange({ sortByPrice: event.target.value });
    });

    onlyActiveSwitch.addEventListener('change', (event) => {
        onFilterChange({ onlyActive: event.target.checked });
    });
};

export const setupDishCardActions = (container, onAddDish, onViewDetails) => {
    container.addEventListener('click', (event) => {
        const addButton = event.target.closest('.add-dish-btn');
        if (addButton) {
            const dishId = addButton.getAttribute('data-dish-id');
            onAddDish(dishId);
            return;
        }
        
        const detailsButton = event.target.closest('.view-dish-details-btn');
        if (detailsButton) {
            const dishId = detailsButton.getAttribute('data-dish-id');
            onViewDetails(dishId);
        }
    });
};

export const setupComandaActions = (container, onUpdateQuantity, onUpdateNotes) => {
    container.addEventListener('click', (event) => {
        const target = event.target;
        if (target.tagName === 'BUTTON' && target.dataset.action) {
            const dishId = target.dataset.dishId;
            const action = target.dataset.action;
            onUpdateQuantity(dishId, action);
        }
    });

    // Usamos debounce para no actualizar en cada tecla
    const debouncedNotesUpdate = debounce(onUpdateNotes, 700);
    container.addEventListener('input', (event) => {
        const target = event.target;
        if (target.classList.contains('comanda-item-notes')) {
            const dishId = target.dataset.dishId;
            const notes = target.value;
            debouncedNotesUpdate(dishId, notes);
        }
    });
};

export const setupDeliveryActions = (container, onDeliveryTypeChange) => {
    container.addEventListener('change', (event) => {
        if (event.target.classList.contains('delivery-type-radio')) {
            const selectedId = parseInt(event.target.value);
            const selectedName = event.target.dataset.name;
            onDeliveryTypeChange(selectedId, selectedName);
        }
    });
};

export const setupPendingOrdersModal = (modalContainer, onSelectOrder) => {
    modalContainer.addEventListener('click', (event) => {
        const target = event.target.closest('.select-order-btn');
        if (target) {
            event.preventDefault();
            const orderNumber = parseInt(target.dataset.orderNumber);
            onSelectOrder(orderNumber);
        }
    });
};

export const setupConfirmButton = (button, onConfirm) => { 
    button.addEventListener('click', onConfirm);
};