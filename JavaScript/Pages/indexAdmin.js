// Importaciones de APIs y módulos compartidos
import renderNavbar from '../Shared/navbar.js';
import { getCategories, getDishes } from '../APIs/DishApi.js';
import { getDeliveryTypes, createOrder, getOrders, patchOrder } from '../APIs/OrderApi.js';

// Importaciones de nuestros nuevos módulos
import { renderCategories, renderDishes, renderComanda, renderDeliveryTypes, renderPendingOrdersModal, renderDishDetailsModal } from '../Components/renderIndex.js';
import { setupFilterHandlers, setupDishActions, setupComandaActions, setupDeliveryActions, setupConfirmButton, setupNotesHandler, setupPendingOrdersModal } from '../Handlers/IndexHandler.js';

// --- ESTADO DE LA APLICACIÓN ---

const state = {
    comanda: [],
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
    originalComanda: []
};

// --- ELEMENTOS DEL DOM ---
const categoryFiltersContainer = document.getElementById('category-filters');
const dishContainer = document.getElementById('dish-container');
const comandaItemsContainer = document.getElementById('comanda-items');
const comandaTotalElement = document.getElementById('comanda-total');
const confirmarComandaBtn = document.getElementById('confirmar-comanda-btn');
const deliveryTypeContainer = document.getElementById('delivery-type-container'); 
const deliveryAddressContainer = document.getElementById('delivery-address-container'); 
const deliveryAddressInput = document.getElementById('delivery-address'); 
const pendingOrdersContainer = document.getElementById('pending-orders-container'); 
const dishDetailsContent = document.getElementById('dish-details-content');
const takeAwayNameContainer = document.getElementById('take-away-name-container');
const takeAwayNameInput = document.getElementById('take-away-name');
const dineInTableContainer = document.getElementById('dine-in-table-container');
const dineInTableInput = document.getElementById('dine-in-table');

// --- LÓGICA DE LA APLICACIÓN ---

const addDishToComanda = (dishId) => {
    const existingItem = state.comanda.find(item => item.id === dishId);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        const dishToAdd = state.currentDishes.find(dish => dish.id === dishId);
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
    renderComanda(state.comanda, comandaItemsContainer, comandaTotalElement, confirmarComandaBtn);
};

const updateComandaItemNotes = (dishId, notes) => {
    const itemIndex = state.comanda.findIndex(item => item.id === dishId);
    if (itemIndex !== -1) {
        state.comanda[itemIndex].notes = notes;
    }
};

const updateComandaQuantity = (dishId, action) => {
    const itemIndex = state.comanda.findIndex(item => item.id === dishId);
    if (itemIndex === -1) return;

    if (action === 'increase') {
        state.comanda[itemIndex].quantity++;
    } else if (action === 'decrease') {
        state.comanda[itemIndex].quantity--;
        if (state.comanda[itemIndex].quantity === 0) {
            state.comanda.splice(itemIndex, 1);
        }
    }
    renderComanda(state.comanda, comandaItemsContainer, comandaTotalElement, confirmarComandaBtn);
};

const loadPendingOrdersIntoModal = async () => {
    try {
        pendingOrdersContainer.innerHTML = '<p>Cargando órdenes...</p>';
        console.log("Pidiendo lista FRESCA de órdenes pendientes...");

        const ordersFromApi = await getOrders({ status: 1 });
        
        const pendingOnly = ordersFromApi.filter(order => order.status.id === 1);

        state.pendingOrders = pendingOnly;
        renderPendingOrdersModal(state.pendingOrders, pendingOrdersContainer);

    } catch (error) {
        console.error('Error al cargar órdenes pendientes:', error);
        pendingOrdersContainer.innerHTML = '<p class="text-danger">No se pudieron cargar las órdenes.</p>';
    }
};

const loadOrderForEditing = (orderNumber) => {
    const orderToEdit = state.pendingOrders.find(o => o.orderNumber === orderNumber);
    if (!orderToEdit) return;

    state.editingOrderNumber = orderToEdit.orderNumber;
    
    const loadedComanda = orderToEdit.items.map(item => {
        const fullDishDetails = state.currentDishes.find(dish => dish.id === item.dish.id);
        return {
            id: item.dish.id,
            name: item.dish.name,
            price: fullDishDetails ? fullDishDetails.price : 0,
            quantity: item.quantity,
            notes: item.notes || ''
        };
    });
    
    state.comanda = JSON.parse(JSON.stringify(loadedComanda)); 
    state.originalComanda = JSON.parse(JSON.stringify(loadedComanda)); 

    state.selectedDeliveryType = orderToEdit.deliveryType;
    
    renderComanda(state.comanda, comandaItemsContainer, comandaTotalElement, confirmarComandaBtn);
    updateDeliveryTypeUI(orderToEdit.deliveryType, orderToEdit.deliveryTo || '');

    const modalInstance = bootstrap.Modal.getInstance(document.getElementById('pendingOrdersModal'));
    modalInstance.hide();
};
const resetPage = () => {
    state.comanda = [];
    state.selectedDeliveryType = null;
    deliveryAddressInput.value = '';
    takeAwayNameInput.value = ''; 
    dineInTableInput.value = '';
    renderComanda(state.comanda, comandaItemsContainer, comandaTotalElement, confirmarComandaBtn);
    renderDeliveryTypes(state.deliveryTypes, deliveryTypeContainer);
    deliveryAddressContainer.style.display = 'none';
    takeAwayNameContainer.style.display = 'none'; 
    dineInTableContainer.style.display = 'none';
    state.editingOrderNumber = null;
};

const updateDeliveryTypeUI = (selectedType, address = '') => {
    // Busca todos los radio buttons de tipo de entrega
    const deliveryRadioButtons = document.querySelectorAll('input[name="deliveryType"]');
    
    deliveryRadioButtons.forEach(radio => {
        if (parseInt(radio.value) === selectedType.id) {
            radio.checked = true; 
        }
    });

    // Muestra/oculta y rellena el campo de dirección, si aplica
    if (selectedType.name.toLowerCase() === 'delivery') {
        deliveryAddressContainer.style.display = 'block';
        deliveryAddressInput.value = address;
    } else {
        deliveryAddressContainer.style.display = 'none';
        deliveryAddressInput.value = '';
    }
};



const handleConfirmOrder = async () => {
    // Validaciones iniciales
    if (!state.selectedDeliveryType) return alert('Selecciona un tipo de entrega.');
    const deliveryTypeName = state.selectedDeliveryType.name.toLowerCase();
    let deliveryDetail = ""; 

    if (deliveryTypeName === 'delivery') {
        if (!deliveryAddressInput.value.trim()) return alert('Ingresa la dirección de entrega.');
        deliveryDetail = deliveryAddressInput.value;
    } else if (deliveryTypeName === 'take away' || deliveryTypeName === 'retiro en local') {
        if (!takeAwayNameInput.value.trim()) return alert('Ingresa el nombre de quien retira.');
        deliveryDetail = takeAwayNameInput.value;
    } else if (deliveryTypeName === 'dine-in' || deliveryTypeName === 'comida en el local') {
        if (!dineInTableInput.value.trim()) return alert('Ingresa el número de mesa.');
        deliveryDetail = dineInTableInput.value;
    }

    confirmarComandaBtn.disabled = true;
    confirmarComandaBtn.textContent = 'Enviando...';

    try {
        if (state.editingOrderNumber) {
            const updateData = {
                items: state.comanda.map(item => ({
                    id: item.id,
                    quantity: item.quantity,
                    notes: item.notes
                }))
            };

            const result = await patchOrder(state.editingOrderNumber, updateData);
            alert(`¡Orden #${result.orderNumber} actualizada con éxito!`);
            resetPage();

        } else {
            const createData = {
                items: state.comanda.map(item => ({ id: item.id, quantity: item.quantity, notes: item.notes })),
                delivery: { id: state.selectedDeliveryType.id, to: deliveryDetail },
                notes: ""
            };
            const result = await createOrder(createData);
            alert(`¡Orden creada con éxito! Número de orden: ${result.orderNumber}`);
            resetPage();
        }
    } catch (error) {
        if (!error.message.includes("prevented")) {
            alert(`Error al procesar la orden: ${error.message}`);
        }
    } finally {
        confirmarComandaBtn.disabled = false;
        confirmarComandaBtn.textContent = 'Confirmar y Enviar a Cocina';
    }
};


const applyFiltersAndRenderDishes = async () => {
    try {
        dishContainer.innerHTML = '<p class="text-center">Buscando platos...</p>';
        
        const activeFilters = {};
        if (state.filters.name) activeFilters.name = state.filters.name;
        if (state.filters.category) activeFilters.category = state.filters.category;
        if (state.filters.sortByPrice) activeFilters.sortByPrice = state.filters.sortByPrice;
        
        activeFilters.onlyActive = state.filters.onlyActive;
        
        const dishes = await getDishes(activeFilters);
        renderDishes(dishes, dishContainer);
        state.currentDishes = dishes; 
    } catch (error) {
        console.error('Error al aplicar filtros:', error);
        dishContainer.innerHTML = `<p class.name="text-danger text-center">Error al cargar los platos.</p>`;
    }
};

const showDishDetails = (dishId) => {
    const dish = state.currentDishes.find(d => d.id === dishId);
    renderDishDetailsModal(dish, dishDetailsContent);
};


// --- INICIALIZACIÓN DE LA PÁGINA --- 

const initializePage = async () => {
    try {
        const [categories, dishes, fetchedDeliveryTypes] = await Promise.all([ getCategories(), getDishes({ onlyActive: true }), getDeliveryTypes() ]);

        // Llenamos el estado inicial
        state.deliveryTypes = fetchedDeliveryTypes;
        state.currentDishes = dishes;

        // Renderizamos la vista inicial
        renderCategories(categories, categoryFiltersContainer);
        renderDishes(dishes, dishContainer);
        renderComanda(state.comanda, comandaItemsContainer, comandaTotalElement, confirmarComandaBtn);
        renderDeliveryTypes(fetchedDeliveryTypes, deliveryTypeContainer);
        
        // Configuramos todos los manejadores de eventos
        setupDishActions(dishContainer, addDishToComanda, showDishDetails);
        setupComandaActions(comandaItemsContainer, updateComandaQuantity);
        setupDeliveryActions(deliveryTypeContainer, deliveryAddressContainer,takeAwayNameContainer, dineInTableContainer, state);
        setupConfirmButton(confirmarComandaBtn, handleConfirmOrder);
        setupNotesHandler(comandaItemsContainer, updateComandaItemNotes); 
        setupFilterHandlers(state, applyFiltersAndRenderDishes);
        setupPendingOrdersModal(pendingOrdersContainer, loadOrderForEditing);



        
    } catch (error) {
        console.error('Error al inicializar la página:', error);
        dishContainer.innerHTML = `<p class="text-danger text-center">Error al cargar datos.</p>`;
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // 1. Inicializamos la página como siempre
    renderNavbar();
    initializePage();

    const pendingOrdersModal = document.getElementById('pendingOrdersModal');

    if (pendingOrdersModal) {
        
        pendingOrdersModal.addEventListener('show.bs.modal', () => {

            loadPendingOrdersIntoModal();
        });
    }
});