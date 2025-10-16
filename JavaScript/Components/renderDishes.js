export const renderDishesTable = (dishes, container) => {
    if (dishes.length === 0) {
        container.innerHTML = '<tr><td colspan="6" class="text-center">No se encontraron platos con los filtros aplicados.</td></tr>';
        return;
    }
    const rowsHTML = dishes.map(dish => {
        const imageUrl = (dish.image && dish.image.startsWith('http'))
            ? dish.image
            : 'https://placehold.co/100x70';
        
        return `
        <tr>
            <td>
                <img src="${imageUrl}" alt="${dish.name}" style="width: 100px; height: 70px; object-fit: cover;">
            </td>
            <td>${dish.name}</td>
            <td>${dish.category.name}</td>
            <td>$${dish.price.toFixed(2)}</td>
            <td>
                ${dish.isActive
                    ? '<span class="badge bg-success">Activo</span>'
                    : '<span class="badge bg-danger">Inactivo</span>'}
            </td>
            <td>
                <button class="btn btn-sm btn-outline-primary edit-dish-btn" data-dish-id="${dish.id}">Editar</button>
                <button class="btn btn-sm btn-outline-danger ms-1 delete-dish-btn" data-dish-id="${dish.id}">Eliminar</button>
            </td>
        </tr>
    `}).join('');
    container.innerHTML = rowsHTML;
};

export const renderCategoryFilterOptions = (categories, selectElement) => {
    const optionsHTML = categories.map(cat => `<option value="${cat.id}">${cat.name}</option>`).join('');
    selectElement.innerHTML += optionsHTML;
};

export const renderDishFormModal = (dish, categories) => {
    const modalLabel = document.getElementById('dishFormModalLabel');
    const dishIdInput = document.getElementById('dish-id');
    const categorySelect = document.getElementById('dish-category');
    
    // Poblar el dropdown de categorías
    categorySelect.innerHTML = categories.map(cat => `<option value="${cat.id}">${cat.name}</option>`).join('');
    
    if (dish) {
        modalLabel.textContent = 'Editar Plato';
        dishIdInput.value = dish.id;
        document.getElementById('dish-name').value = dish.name;
        document.getElementById('dish-description').value = dish.description;
        document.getElementById('dish-price').value = dish.price;
        document.getElementById('dish-image').value = dish.image;
        categorySelect.value = dish.category.id;
        document.getElementById('dish-isActive').checked = dish.isActive;
    } else {
        modalLabel.textContent = 'Crear Nuevo Plato';
        document.getElementById('dish-form').reset(); // Limpia el formulario
        dishIdInput.value = '';
    }
};