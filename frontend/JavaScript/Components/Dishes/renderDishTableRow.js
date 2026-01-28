export const createDishTableRowHTML = (dish) => {
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
    `;
};