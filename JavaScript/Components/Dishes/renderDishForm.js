export const renderDishForm = (dish, categories) => {
    const modalLabel = document.getElementById('dishFormModalLabel');
    const dishIdInput = document.getElementById('dish-id');
    const categorySelect = document.getElementById('dish-category');
    
    // Poblar el dropdown de categorías
    categorySelect.innerHTML = categories.map(cat => `<option value="${cat.id}">${cat.name}</option>`).join('');
    
    if (dish) {
        // Modo Edición: Rellenar formulario con datos existentes
        modalLabel.textContent = 'Editar Plato';
        dishIdInput.value = dish.id;
        document.getElementById('dish-name').value = dish.name;
        document.getElementById('dish-description').value = dish.description;
        document.getElementById('dish-price').value = dish.price;
        document.getElementById('dish-image').value = dish.image;
        categorySelect.value = dish.category.id;
        document.getElementById('dish-isActive').checked = dish.isActive;
    } else {
        // Modo Creación: Limpiar formulario
        modalLabel.textContent = 'Crear Nuevo Plato';
        document.getElementById('dish-form').reset(); 
        dishIdInput.value = '';
    }
};