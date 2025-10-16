import { renderHomePage } from './JavaScript/Pages/indexAdmin.jsjs';
import { initializeDashboard } from './JavaScript/Pages/panelAdmin.js';


// Este evento se dispara cuando todo el HTML ha sido cargado y procesado por el navegador.
// Es el punto de partida perfecto para nuestra aplicación.
document.addEventListener('DOMContentLoaded', () => {
    console.log('¡El DOM está listo! Iniciando la aplicación.');
    renderHomePage();
    initializeDashboard();

});

