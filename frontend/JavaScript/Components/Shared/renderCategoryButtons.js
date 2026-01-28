export const createCategoryButtonsHTML = (categories) => {
    let buttonsHTML = '<button class="btn btn-secondary active me-2 mb-2" data-category-id="all">Todas</button>'; 
    buttonsHTML += categories.map(category => 
        `<button class="btn btn-outline-secondary me-2 mb-2" data-category-id="${category.id}">${category.name}</button>`
    ).join('');
    return buttonsHTML;
};