import renderNavbar from '../Shared/navbar.js';
import { getDishes, getCategories, createDish, updateDish, deleteDish, getDishById } from '../APIs/DishApi.js';
import { renderDishesTable, renderCategoryFilterOptions, renderDishFormModal } from '../Components/renderDishes.js';
import { setupDishPageFilters, setupDishPageActions } from '../Handlers/dishesHandler.js';

// --- ESTADO DE LA PÁGINA ---
const state = {
    dishes: [],
    categories: [],
    filters: {
        name: '',
        category: '',
        onlyActive: '', 
    }
};
let modalInstance = null;

// --- ELEMENTOS DEL DOM ---
const dishesTableBody = document.getElementById('dishes-table-body');
const categoryFilterSelect = document.getElementById('dish-category-filter');

// --- LÓGICA DE LA APLICACIÓN ---

const applyFiltersAndRender = async () => {
    try {
        dishesTableBody.innerHTML = '<tr><td colspan="6" class="text-center">Buscando...</td></tr>';
        
        const searchTerm = state.filters.name.trim();
        let dishes = [];

        if (isUUID(searchTerm)) {
            console.log("Detectado formato UUID, buscando por ID...");
            const dish = await getDishById(searchTerm);
            if (dish) {
                dishes = [dish]; 
            }
        } else {
            console.log("Buscando por nombre y otros filtros...");
            const activeFilters = {};
            if (searchTerm) activeFilters.name = searchTerm;
            if (state.filters.category) activeFilters.category = state.filters.category;
            if (state.filters.onlyActive === 'true') activeFilters.onlyActive = true;
            
            dishes = await getDishes(activeFilters);
        }

        state.dishes = dishes;
        renderDishesTable(state.dishes, dishesTableBody);
        
    } catch (error) {
        console.error("Error al aplicar filtros:", error);
        dishesTableBody.innerHTML = '<tr><td colspan="6" class="text-danger text-center">Error al cargar los platos.</td></tr>';
    }
};

const handleCreateClick = () => {
    renderDishFormModal(null, state.categories);
    modalInstance.show();
};

const handleEditClick = (dishId) => {
    const dishToEdit = state.dishes.find(d => d.id === dishId);
    if (dishToEdit) {
        renderDishFormModal(dishToEdit, state.categories);
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
            await applyFiltersAndRender(); 
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
        await applyFiltersAndRender(); 
    } catch (error) {
        alert(`Error al guardar: ${error.message}`);
    } finally {
        saveBtn.disabled = false;
        saveBtn.textContent = 'Guardar Cambios';
    }
};

const isUUID = (str) => {
    const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    return uuidRegex.test(str);
};


// --- INICIALIZACIÓN ---
const initializePage = async () => {
    try {
        const [dishes, categories] = await Promise.all([
            getDishes({ onlyActive: true }), 
            getCategories()
        ]);
        state.dishes = dishes;
        state.categories = categories;

        renderDishesTable(state.dishes, dishesTableBody);
        renderCategoryFilterOptions(state.categories, categoryFilterSelect);

        document.getElementById('dish-active-filter').checked = true;
        
        setupDishPageFilters(state, applyFiltersAndRender);
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

document.addEventListener('DOMContentLoaded', () => {
    renderNavbar();
    modalInstance = new bootstrap.Modal(document.getElementById('dishFormModal'));
    initializePage();
});