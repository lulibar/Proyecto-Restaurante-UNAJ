let debounceTimeout;
const debounce = (func, delay = 500) => {
    return (...args) => {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => func.apply(this, args), delay);
    };
};

export const setupDishPageFilters = (state, onFilterChange) => {
    const searchInput = document.getElementById('dish-search-input');
    const categorySelect = document.getElementById('dish-category-filter');
    const activeSelect = document.getElementById('dish-active-filter');

    const debouncedFilter = debounce(onFilterChange, 500);

    searchInput.addEventListener('input', (e) => {
        state.filters.name = e.target.value;
        debouncedFilter();
    });

    categorySelect.addEventListener('change', (e) => {
        state.filters.category = e.target.value;
        onFilterChange();
    });

    activeSelect.addEventListener('change', (e) => {
        state.filters.onlyActive = e.target.checked ? 'true' : ''; 
        onFilterChange();
    });
};

export const setupDishPageActions = (actions) => {
    const createBtn = document.getElementById('create-dish-btn');
    const tableBody = document.getElementById('dishes-table-body');
    const form = document.getElementById('dish-form');

    // Botón crear
    createBtn.addEventListener('click', actions.onCreateClick);

    // Botones editar y eliminar
    tableBody.addEventListener('click', (e) => {
        const editBtn = e.target.closest('.edit-dish-btn');
        const deleteBtn = e.target.closest('.delete-dish-btn');

        if (editBtn) {
            const dishId = editBtn.getAttribute('data-dish-id');
            actions.onEditClick(dishId);
        }
        if (deleteBtn) {
            const dishId = deleteBtn.getAttribute('data-dish-id');
            actions.onDeleteClick(dishId);
        }
    });
    
    form.addEventListener('submit', actions.onFormSubmit);
};