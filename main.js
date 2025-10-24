// main.js
import { initPanelPage } from './JavaScript/Pages/panelAdmin.js';
import { initHistoryPage } from './JavaScript/Pages/historialAdmin.js'; 
import { initDishesPage } from './JavaScript/Pages/dishesAdmin.js'; 
import { initIndexPage } from './JavaScript/Pages/indexAdmin.js'; 
import renderNavbar from './JavaScript/Shared/navbar.js';

document.addEventListener('DOMContentLoaded', () => {
    console.log('main.js: El DOM está listo.');
    renderNavbar(); 

    if (document.getElementById('orders-board-container')) {
        console.log('main.js: Iniciando panelAdmin.js');
        initPanelPage();
    } 
    else if (document.getElementById('reportsTab')) { 
        console.log('main.js: Iniciando historialAdmin.js');
        initHistoryPage();
    }
    else if (document.getElementById('dishes-table-body')) {
        console.log('main.js: Iniciando dishesAdmin.js');
        initDishesPage();
    }
    else if (document.getElementById('dish-container')) { 
        console.log('main.js: Iniciando indexAdmin.js');
        initIndexPage();
    }
});