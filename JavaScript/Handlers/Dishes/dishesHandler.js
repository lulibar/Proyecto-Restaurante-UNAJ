export const setupDishPageFilters = (onSearchChange, onCategoryChange, onActiveChange) => {
    const searchInput = document.getElementById('dish-search-input');
    const categorySelect = document.getElementById('dish-category-filter');
    const activeSelect = document.getElementById('dish-active-filter');

    // El 'debounced' onSearchChange vendrá desde la página (director)
    searchInput.addEventListener('input', (e) => onSearchChange(e.target.value));

    categorySelect.addEventListener('change', (e) => onCategoryChange(e.target.value));

    activeSelect.addEventListener('change', (e) => onActiveChange(e.target.checked));
};

export const setupDishPageActions = (actions) => {
    const createBtn = document.getElementById('create-dish-btn');
    const tableBody = document.getElementById('dishes-table-body');
    const form = document.getElementById('dish-form');

    // Botón crear
    createBtn.addEventListener('click', actions.onCreateClick);

    // Botones editar y eliminar (delegación de eventos)
    tableBody.addEventListener('click', (e) => {
        const editBtn = e.target.closest('.edit-dish-btn');
        if (editBtn) {
            const dishId = editBtn.getAttribute('data-dish-id');
            actions.onEditClick(dishId);
            return;
        }
        
        const deleteBtn = e.target.closest('.delete-dish-btn');
        if (deleteBtn) {
            const dishId = deleteBtn.getAttribute('data-dish-id');
            actions.onDeleteClick(dishId);
        }
    });
    
    // Envío del formulario
    form.addEventListener('submit', actions.onFormSubmit);
};