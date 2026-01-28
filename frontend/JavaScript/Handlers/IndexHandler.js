let debounceTimeout;
const debounce = (func, delay = 500) => {
    return (...args) => {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
};

export const setupFilterHandlers = (state, onFilterChange) => {
    const categoryFiltersContainer = document.getElementById('category-filters');
    const searchInput = document.getElementById('search-input');
    const sortByPriceSelect = document.getElementById('sort-by-price');
    const onlyActiveSwitch = document.getElementById('only-active-switch');

    // 1. Filtro por Categoría (lógica movida aquí adentro)
    categoryFiltersContainer.addEventListener('click', (event) => {
        if (event.target.tagName === 'BUTTON') {
            document.querySelectorAll('#category-filters button').forEach(btn => btn.classList.remove('active'));
            event.target.classList.add('active');
            
            const categoryId = event.target.getAttribute('data-category-id');
            state.filters.category = categoryId === 'all' ? null : categoryId;
            onFilterChange(); // Llama a la función central de actualización
        }
    });

    // 2. Búsqueda por Nombre (con debounce)
    const debouncedSearch = debounce(() => onFilterChange(), 500);
    searchInput.addEventListener('input', (event) => {
        state.filters.name = event.target.value;
        debouncedSearch();
    });

    // 3. Ordenar por Precio
    sortByPriceSelect.addEventListener('change', (event) => {
        state.filters.sortByPrice = event.target.value;
        onFilterChange();
    });

    // 4. Filtro de Activos
    onlyActiveSwitch.addEventListener('change', (event) => {
        state.filters.onlyActive = event.target.checked;
        onFilterChange();
    });
};


export const setupDishActions = (container, addDishToComanda, onViewDishDetails) => {
    container.addEventListener('click', (event) => {
        const addButton = event.target.closest('.add-dish-btn');
        const detailsButton = event.target.closest('.view-dish-details-btn');

        if (addButton) {
            const dishId = addButton.getAttribute('data-dish-id');
            addDishToComanda(dishId);
        }
        
        if (detailsButton) {
            const dishId = detailsButton.getAttribute('data-dish-id');
            onViewDishDetails(dishId);
        }
    });
};

export const setupComandaActions = (container, updateComandaQuantity) => {
    container.addEventListener('click', (event) => {
        const target = event.target;
        if (target.tagName === 'BUTTON') {
            const dishId = target.getAttribute('data-dish-id');
            const action = target.getAttribute('data-action');
            if (dishId && action) {
                updateComandaQuantity(dishId, action);
            }
        }
    });
};

export const setupDeliveryActions = (container, addressContainer, takeAwayContainer, dineInContainer, state) => {
    container.addEventListener('change', (event) => {
        const selectedId = parseInt(event.target.value);
        state.selectedDeliveryType = state.deliveryTypes.find(type => type.id === selectedId) || null;

        addressContainer.style.display = 'none';
        takeAwayContainer.style.display = 'none';
        dineInContainer.style.display = 'none';

        if (!state.selectedDeliveryType) return;

        const deliveryTypeName = state.selectedDeliveryType.name.toLowerCase();
        if (deliveryTypeName === 'delivery') {
            addressContainer.style.display = 'block';
        } else if (deliveryTypeName === 'take away' || deliveryTypeName === 'retiro en local') {
            takeAwayContainer.style.display = 'block';
        } else if (deliveryTypeName === 'dine-in' || deliveryTypeName === 'comida en el local') {
            dineInContainer.style.display = 'block';
        }
    });
};
export const setupNotesHandler = (container, handleUpdate) => {
    container.addEventListener('input', (event) => {
        const target = event.target;
        if (target.classList.contains('comanda-item-notes')) {
            const dishId = target.getAttribute('data-dish-id');
            const notes = target.value;
            handleUpdate(dishId, notes);
        }
    });
};


export const setupPendingOrdersModal = (modalContainer, onSelect) => {
    modalContainer.addEventListener('click', (event) => {
        const target = event.target.closest('.select-order-btn');
        if (target) {
            event.preventDefault();
            const orderNumber = parseInt(target.getAttribute('data-order-number'));
            onSelect(orderNumber);
        }
    });
};

export const setupConfirmButton = (button, handleConfirmOrder) => { 
    button.addEventListener('click', handleConfirmOrder);
};