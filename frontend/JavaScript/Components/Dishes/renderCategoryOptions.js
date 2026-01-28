export const createCategoryOptionsHTML = (categories) => {
    return categories.map(cat => `<option value="${cat.id}">${cat.name}</option>`).join('');
};