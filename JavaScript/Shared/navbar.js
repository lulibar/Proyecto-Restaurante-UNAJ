
const renderNavbar = (containerId = 'navbar-container') => {
    const navbarContainer = document.getElementById(containerId);
    if (!navbarContainer) {
        console.error(`No se encontró el contenedor con id "${containerId}" para la navbar.`);
        return;
    }

    const currentPage = window.location.pathname;
    
    const isIndex = currentPage.endsWith('/') || currentPage.endsWith('index.html');
    const isPanel = currentPage.endsWith('panel.html');
    const isDishes = currentPage.endsWith('dishes.html'); 
    const isReports = currentPage.endsWith('historial.html');

    // Plantilla HTML de la navbar de Bootstrap
    navbarContainer.innerHTML = `
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
            <div class="container-fluid">
                <a class="navbar-brand" href="#">
                    <i class="fa-solid fa-utensils"></i> El Mejor Sabor
                </a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav ms-auto">
                        <li class="nav-item">
                            <a class="nav-link ${isIndex ? 'active' : ''}" href="../html/index.html">Crear Comanda</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link ${isPanel ? 'active' : ''}" href="../html/panel.html">Panel de Órdenes</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link ${isDishes ? 'active' : ''}" href="../html/dishes.html">Gestionar Platos</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link ${isReports ? 'active' : ''}" href="../html/historial.html">Historial de ordenes</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    `;
};

export default renderNavbar;