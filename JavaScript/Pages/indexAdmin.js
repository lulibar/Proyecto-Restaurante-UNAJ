// 1. IMPORTACIONES
import { getCategories, getDishes, getDishById } from '../APIs/DishApi.js';
import { getDeliveryTypes, createOrder, getOrders, patchOrder } from '../APIs/OrderApi.js';
import { createCategoryButtonsHTML } from '../Components/Shared/renderCategoryButtons.js';
import { createDishCardHTML } from '../Components/Dishes/renderDishCard.js';
import { createOrderItemHTML } from '../Components/Orders/renderOrderItem.js';
import { createDeliveryTypeOptionsHTML } from '../Components/Orders/renderDeliveryTypeOptions.js';
import { createPendingOrderItemHTML } from '../Components/Orders/renderPendingOrderItem.js';
import { createDishDetailsModalContentHTML } from '../Components/Dishes/renderDishDetailsModal.js'; 
import { 
    setupFilterHandlers, 
    setupDishCardActions, 
    setupComandaActions, 
    setupDeliveryActions, 
    setupConfirmButton, 
    setupPendingOrdersModal 
} from '../Handlers/Index/IndexHandler.js';
let comandaOffcanvasInstance = null;

// 2. ESTADO DE LA APLICACIÓN
const state = {
    comanda: [], 
    allDishes: [],
    currentDishes: [], 
    deliveryTypes: [],
    selectedDeliveryType: null, 
    filters: {
        name: '',
        category: null,
        sortByPrice: '',
        onlyActive: true,
    },
    editingOrderNumber: null, 
    pendingOrders: [], 
    originalComandaItems: new Map()
};

// 3. ELEMENTOS DEL DOM
const categoryFiltersContainer = document.getElementById('category-filters');
const dishContainer = document.getElementById('dish-container');
const comandaItemsContainer = document.getElementById('comanda-items');
const comandaTotalElement = document.getElementById('comanda-total');
const confirmarComandaBtn = document.getElementById('confirmar-comanda-btn');
const deliveryTypeContainer = document.getElementById('delivery-type-container'); 
const deliveryAddressContainer = document.getElementById('delivery-address-container'); 
const deliveryAddressInput = document.getElementById('delivery-address'); 
const takeAwayNameContainer = document.getElementById('take-away-name-container');
const takeAwayNameInput = document.getElementById('take-away-name');
const dineInTableContainer = document.getElementById('dine-in-table-container');
const dineInTableInput = document.getElementById('dine-in-table');
const pendingOrdersContainer = document.getElementById('pending-orders-container'); 
const dishDetailsContent = document.getElementById('dish-details-content');

// 4. LÓGICA DE RENDERIZADO
const renderCategoriesFilter = (categories) => {
    categoryFiltersContainer.innerHTML = createCategoryButtonsHTML(categories);
};

const renderDishesView = () => {
    if (state.currentDishes.length === 0) {
        dishContainer.innerHTML = '<div class="col-12"><p class="text-center text-muted mt-5">No se encontraron platos con los filtros aplicados.</p></div>';
        return;
    }
    const dishesByCategory = state.currentDishes.reduce((acc, dish) => {
        const categoryName = dish.category.name;
        if (!acc[categoryName]) acc[categoryName] = [];
        acc[categoryName].push(dish);
        return acc;
    }, {});

    let dishesHTML = '';
    for (const categoryName in dishesByCategory) {
        dishesHTML += `<h2 class="category-section-title">${categoryName}</h2>`;

    dishesHTML += `<div class="row row-cols-1 row-cols-md-3 row-cols-lg-5 g-3 mb-4">`;

    dishesHTML += dishesByCategory[categoryName].map(createDishCardHTML).join('');

    dishesHTML += `</div>`;
    }
    dishContainer.innerHTML = dishesHTML;
};

const renderComandaView = () => { 
    const comandaItemCountSpan = document.getElementById('comanda-item-count');
    const itemCount = state.comanda.reduce((sum, item) => sum + item.quantity, 0); 
    if (comandaItemCountSpan) comandaItemCountSpan.textContent = itemCount; 
    if (state.comanda.length === 0) {
        comandaItemsContainer.innerHTML = '<p class="text-muted text-center">Aún no has agregado platos.</p>';
        comandaTotalElement.textContent = '$0.00';
        confirmarComandaBtn.disabled = true;
        return;
    }
    comandaItemsContainer.innerHTML = state.comanda.map(createOrderItemHTML).join('');
    const total = state.comanda.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    comandaTotalElement.textContent = `$${total.toFixed(2)}`;
    confirmarComandaBtn.disabled = false;
};

const renderDeliveryOptions = () => {
    deliveryTypeContainer.innerHTML = createDeliveryTypeOptionsHTML(state.deliveryTypes);
};

const renderPendingOrders = () => {
    if (state.pendingOrders.length === 0) {
        pendingOrdersContainer.innerHTML = '<p class="text-center">No hay órdenes pendientes para modificar.</p>';
        return;
    }
    pendingOrdersContainer.innerHTML = `<div class="list-group">${state.pendingOrders.map(createPendingOrderItemHTML).join('')}</div>`;
};

// 5. LÓGICA DE LA APLICACIÓN (Callbacks y Acciones)
const addDishToComanda = (dishId) => {
    const isFirstItem = state.comanda.length === 0;
    const existingItem = state.comanda.find(item => item.id === dishId);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        const dishToAdd = state.allDishes.find(dish => dish.id === dishId); 
        if (dishToAdd) {
            state.comanda.push({ 
                id: dishToAdd.id, 
                name: dishToAdd.name, 
                price: dishToAdd.price, 
                quantity: 1,
                notes: '' 
            });
        }
    }
    renderComandaView();
    if (isFirstItem && comandaOffcanvasInstance) {
    comandaOffcanvasInstance.show();
    }
};

const updateComandaQuantity = (dishId, action) => {
    const itemIndex = state.comanda.findIndex(item => item.id === dishId);
    if (itemIndex === -1) return;

    if (action === 'increase') {
        state.comanda[itemIndex].quantity++;
    } else if (action === 'decrease') {
        if (state.comanda[itemIndex].quantity > 0) {
            state.comanda[itemIndex].quantity--;
    }   }
    renderComandaView();
};

const updateComandaItemNotes = (dishId, notes) => {
    const item = state.comanda.find(item => item.id === dishId);
    if (item) {
        item.notes = notes;
    }
};

const loadPendingOrdersIntoModal = async () => {
    try {
        pendingOrdersContainer.innerHTML = '<p>Cargando órdenes...</p>';
        const ordersFromApi = await getOrders({ statusId: 1 }); 
        state.pendingOrders = ordersFromApi;
        renderPendingOrders();
    } catch (error) {
        console.error('Error al cargar órdenes pendientes:', error);
        pendingOrdersContainer.innerHTML = '<p class="text-danger">No se pudieron cargar las órdenes.</p>';
    }
};

const loadOrderForEditing = (orderNumber) => {
    const orderToEdit = state.pendingOrders.find(o => o.orderNumber === orderNumber);
    if (!orderToEdit) return;

    state.editingOrderNumber = orderToEdit.orderNumber;
    state.originalComandaItems.clear();

    state.comanda = orderToEdit.items
        .filter(item => item.status.id !== 5) 
        .map(item => {
            const fullDishDetails = state.allDishes.find(dish => dish.id === item.dish.id);
            const comandaItem = {
                id: item.dish.id,
                name: item.dish.name,
                price: fullDishDetails ? fullDishDetails.price : 0,
                quantity: item.quantity,
                notes: item.notes || ''
            };
            state.originalComandaItems.set(comandaItem.id, { ...comandaItem });
            return comandaItem;
        });
    
    state.selectedDeliveryType = orderToEdit.deliveryType;
    
    renderComandaView();
    updateDeliveryTypeUI(orderToEdit.deliveryType, orderToEdit.deliveryTo || ''); 

    const modalEl = document.getElementById('pendingOrdersModal');
    const modalInstance = bootstrap.Modal.getInstance(modalEl);
    if(modalInstance) modalInstance.hide();
    if (comandaOffcanvasInstance) {comandaOffcanvasInstance.show();}
};

const resetPage = () => {
    state.comanda = [];
    state.selectedDeliveryType = null;
    state.editingOrderNumber = null;
    deliveryAddressInput.value = '';
    takeAwayNameInput.value = ''; 
    dineInTableInput.value = '';
    renderComandaView();
    const firstRadio = deliveryTypeContainer.querySelector('input[type="radio"]');
    if(firstRadio) firstRadio.checked = false; 
    updateDeliveryTypeUI(null); 
    console.log("Página reseteada");
};

const updateDeliveryTypeUI = (selectedType, detailValue = '') => {
    deliveryAddressContainer.style.display = 'none';
    takeAwayNameContainer.style.display = 'none'; 
    dineInTableContainer.style.display = 'none';

    const deliveryRadioButtons = document.querySelectorAll('input[name="deliveryType"]');
    deliveryRadioButtons.forEach(radio => {
        radio.checked = selectedType && parseInt(radio.value) === selectedType.id;
    });

    if (!selectedType) return; 

    const deliveryTypeName = selectedType.name.toLowerCase();
    if (deliveryTypeName === 'delivery') {
        deliveryAddressContainer.style.display = 'block';
        deliveryAddressInput.value = detailValue;
    } else if (deliveryTypeName === 'take away') { 
        takeAwayNameContainer.style.display = 'block';
        takeAwayNameInput.value = detailValue;
    } else if (deliveryTypeName === 'dine-in') { 
        dineInTableContainer.style.display = 'block';
        dineInTableInput.value = detailValue;
    }
};

const handleConfirmOrder = async () => {
    if (state.comanda.length === 0) return alert('La comanda está vacía.');
    if (!state.selectedDeliveryType) return alert('Selecciona un tipo de entrega.');

    const deliveryTypeName = state.selectedDeliveryType.name.toLowerCase();
    let deliveryDetail = ""; 

    if (deliveryTypeName === 'delivery') {
        deliveryDetail = deliveryAddressInput.value.trim();
        if (!deliveryDetail) return alert('Ingresa la dirección de entrega.');
    } else if (deliveryTypeName === 'take away') {
        deliveryDetail = takeAwayNameInput.value.trim();
        if (!deliveryDetail) return alert('Ingresa el nombre de quien retira.');
    } else if (deliveryTypeName === 'dine-in') {
        deliveryDetail = dineInTableInput.value.trim();
        if (!deliveryDetail) return alert('Ingresa el número de mesa.');
    }

    confirmarComandaBtn.disabled = true;
    confirmarComandaBtn.textContent = 'Enviando...';

    try {
        const orderData = {
            items: state.comanda.map(item => ({ id: item.id, quantity: item.quantity, notes: item.notes })),
            delivery: { id: state.selectedDeliveryType.id, to: deliveryDetail },
            notes: "" 
        };

        let result;
        if (state.editingOrderNumber) {
            const itemsPayload = [];
            state.originalComandaItems.forEach((originalItem, dishId) => {
                const currentItem = state.comanda.find(item => item.id === dishId);
                
                if (currentItem && currentItem.quantity > 0) {
                    itemsPayload.push({ 
                        id: currentItem.id, 
                        quantity: currentItem.quantity, 
                        notes: currentItem.notes 
                    });
                } else if (currentItem && currentItem.quantity <= 0) {
                    itemsPayload.push({ 
                        id: currentItem.id, 
                        quantity: 0, 
                        notes: currentItem.notes 
                    });
                }
                
                else if (!currentItem) {
                    itemsPayload.push({
                        id: dishId,
                        quantity: 0,
                        notes: originalItem.notes 
                    });
                }
            });
            const updatePayload = { items: itemsPayload }; 
            result = await patchOrder(state.editingOrderNumber, updatePayload);
            alert(`¡Orden #${result.orderNumber} actualizada con éxito!`);
        }
            else {
            const createData = {
                items: state.comanda.map(item => ({ id: item.id, quantity: item.quantity, notes: item.notes })),
                delivery: { id: state.selectedDeliveryType.id, to: deliveryDetail },
                notes: "" 
            };
            result = await createOrder(createData);
            alert(`¡Orden #${result.orderNumber} creada con éxito!`);
        }
        resetPage(); 
    } catch (error) {
        console.error("Error al confirmar orden:", error);
        alert(`Error al procesar la orden: ${error.message}`);
    } finally {
        confirmarComandaBtn.disabled = false;
        confirmarComandaBtn.textContent = 'Confirmar y Enviar a Cocina';
    }
};

const applyFiltersAndRenderDishes = async () => {
    try {
        dishContainer.innerHTML = '<p class="text-center text-muted mt-5">Buscando platos...</p>';
        
        const activeFilters = {};
        if (state.filters.name) activeFilters.name = state.filters.name;
        if (state.filters.category) activeFilters.category = state.filters.category;
        if (state.filters.sortByPrice) activeFilters.sortByPrice = state.filters.sortByPrice;
        activeFilters.onlyActive = state.filters.onlyActive; 
        
        const dishes = await getDishes(activeFilters);
        state.currentDishes = dishes; 
        renderDishesView(); 
    } catch (error) {
        console.error('Error al aplicar filtros:', error);
        dishContainer.innerHTML = `<p class="text-danger text-center mt-5">Error al cargar los platos.</p>`;
    }
};

const showDishDetails = async (dishId) => { 
    let dish = state.currentDishes.find(d => d.id === dishId);
    if (!dish) { 
        try {
            dish = await getDishById(dishId);
        } catch (error) {
            console.error("Error buscando detalle de plato:", error);
        }
    }
    dishDetailsContent.innerHTML = createDishDetailsModalContentHTML(dish);
};

// 6. INICIALIZACIÓN DE LA PÁGINA
export const initIndexPage = async () => {
    try {
        const [categories, dishes, fetchedDeliveryTypes] = await Promise.all([ 
            getCategories(), 
            getDishes({ onlyActive: true }), 
            getDeliveryTypes() 
        ]);

        state.allDishes = dishes; 
        state.currentDishes = dishes; 
        state.deliveryTypes = fetchedDeliveryTypes;

        renderCategoriesFilter(categories);
        renderDishesView();
        renderComandaView();
        renderDeliveryOptions();
        
        setupFilterHandlers((changedFilter) => {
            Object.assign(state.filters, changedFilter); 
            applyFiltersAndRenderDishes(); 
        });

        setupDishCardActions(dishContainer, addDishToComanda, showDishDetails);
        setupComandaActions(comandaItemsContainer, updateComandaQuantity, updateComandaItemNotes);
        setupDeliveryActions(deliveryTypeContainer, (selectedId, selectedName) => {
            state.selectedDeliveryType = { id: selectedId, name: selectedName };
            updateDeliveryTypeUI(state.selectedDeliveryType); 
        });
        setupConfirmButton(confirmarComandaBtn, handleConfirmOrder);
        setupPendingOrdersModal(pendingOrdersContainer, loadOrderForEditing);

        const offcanvasElement = document.getElementById('comandaOffcanvas');
        if (offcanvasElement) {
        comandaOffcanvasInstance = new bootstrap.Offcanvas(offcanvasElement);
        }
        const pendingOrdersModalEl = document.getElementById('pendingOrdersModal');
        if (pendingOrdersModalEl) {
            pendingOrdersModalEl.addEventListener('show.bs.modal', loadPendingOrdersIntoModal);
        }
        
    } catch (error) {
        console.error('Error al inicializar la página:', error);
        dishContainer.innerHTML = `<p class="text-danger text-center mt-5">Error fatal al cargar la página.</p>`;
    }
};