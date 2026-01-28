// 1. IMPORTACIONES
import { getDishes, getCategories, createDish, updateDish, deleteDish, getDishById } from '../APIs/DishApi.js';
import { createDishTableRowHTML } from '../Components/Dishes/renderDishTableRow.js';
import { createCategoryOptionsHTML } from '../Components/Dishes/renderCategoryOptions.js';
import { renderDishForm } from '../Components/Dishes/renderDishForm.js';
import { setupDishPageFilters, setupDishPageActions } from '../Handlers/Dishes/dishesHandler.js';
import { debounce, isUUID } from '../Shared/utils.js';

// 2. ESTADO Y ELEMENTOS DEL DOM
const state = {
    dishes: [],
    categories: [],
    filters: {
        name: '',
        category: '',
        onlyActive: true, 
    }
};
let modalInstance = null; 
const dishesTableBody = document.getElementById('dishes-table-body');
const categoryFilterSelect = document.getElementById('dish-category-filter');
const categoryFormSelect = document.getElementById('dish-category');

// 3. FUNCIONES DE RENDERIZADO
const renderTable = () => {
    if (state.dishes.length === 0) {
        dishesTableBody.innerHTML = '<tr><td colspan="6" class="text-center">No se encontraron platos.</td></tr>';
        return;
    }
    dishesTableBody.innerHTML = state.dishes.map(createDishTableRowHTML).join('');
};

const renderCategoryFilters = () => {
    const optionsHTML = createCategoryOptionsHTML(state.categories);
    categoryFilterSelect.innerHTML += optionsHTML; 
};

// 4. LÓGICA DE LA APLICACIÓN (Callbacks)
const loadDishesAndRender = async () => {
    try {
        dishesTableBody.innerHTML = '<tr><td colspan="6" class="text-center">Buscando...</td></tr>';
        
        const searchTerm = state.filters.name.trim();
        let dishes = [];
        if (isUUID(searchTerm)) {
            const dish = await getDishById(searchTerm);
            dishes = dish ? [dish] : [];
        } else {
            const activeFilters = {};
            if (searchTerm) activeFilters.name = searchTerm;
            if (state.filters.category) activeFilters.category = state.filters.category;
            if (state.filters.onlyActive) activeFilters.onlyActive = true;
            
            dishes = await getDishes(activeFilters);
        }
        state.dishes = dishes;
        renderTable();
        
    } catch (error) {
        console.error("Error al cargar platos:", error);
        dishesTableBody.innerHTML = '<tr><td colspan="6" class="text-danger text-center">Error al cargar los platos.</td></tr>';
    }
};

const handleCreateClick = () => {
    renderDishForm(null, state.categories);
    modalInstance.show();
};

const handleEditClick = (dishId) => {
    const dishToEdit = state.dishes.find(d => d.id === dishId);
    if (dishToEdit) {
        renderDishForm(dishToEdit, state.categories);
        modalInstance.show();
    }
};

const handleDeleteClick = async (dishId) => {
    const dishToDelete = state.dishes.find(d => d.id === dishId);
    if (!dishToDelete) return;
    if (confirm(`¿Estás seguro de que quieres eliminar el plato "${dishToDelete.name}"?`)) {
        try {
            await deleteDish(dishId);
            alert('Plato eliminado con éxito.');
            await loadDishesAndRender(); 
        } catch (error) {
            alert(`Error al eliminar: ${error.message}`);
        }
    }
};

const handleFormSubmit = async (event) => {
    event.preventDefault();
    const saveBtn = document.getElementById('save-dish-btn');
    saveBtn.disabled = true;
    saveBtn.textContent = 'Guardando...';
    const dishId = document.getElementById('dish-id').value;
    const dishData = {
        name: document.getElementById('dish-name').value,
        description: document.getElementById('dish-description').value,
        price: parseFloat(document.getElementById('dish-price').value),
        category: parseInt(document.getElementById('dish-category').value),
        image: document.getElementById('dish-image').value,
        isActive: document.getElementById('dish-isActive').checked, 
    };
    try {
        if (dishId) {
            await updateDish(dishId, dishData);
            alert('Plato actualizado con éxito.');
        } else {
            const createData = { ...dishData };
            delete createData.isActive; 
            await createDish(createData);
            alert('Plato creado con éxito.');
        }
        modalInstance.hide();
        await loadDishesAndRender(); 
    } catch (error) {
        alert(`Error al guardar: ${error.message}`);
    } finally {
        saveBtn.disabled = false;
        saveBtn.textContent = 'Guardar Cambios';
    }
};

// 5. INICIALIZACIÓN DE LA PÁGINA
export const initDishesPage = async () => {
    try {
        const categories = await getCategories();
        state.categories = categories;
        renderCategoryFilters();
        document.getElementById('dish-active-filter').checked = state.filters.onlyActive;
        await loadDishesAndRender();
        modalInstance = new bootstrap.Modal(document.getElementById('dishFormModal'));
        const debouncedLoadDishes = debounce(loadDishesAndRender, 500);
        setupDishPageFilters(
            (searchTerm) => { 
                state.filters.name = searchTerm;
                debouncedLoadDishes();
            },
            (categoryId) => { 
                state.filters.category = categoryId;
                loadDishesAndRender();
            },
            (isActive) => { 
                state.filters.onlyActive = isActive;
                loadDishesAndRender();
            }
        );

        setupDishPageActions({
            onCreateClick: handleCreateClick,
            onEditClick: handleEditClick,
            onDeleteClick: handleDeleteClick,
            onFormSubmit: handleFormSubmit,
        });

    } catch (error) {
        console.error("Error al inicializar la página:", error);
    }
};