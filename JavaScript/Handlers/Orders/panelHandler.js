export const initializePanelHandlers = (container, onItemUpdate, onShowDetails) => {
    container.addEventListener('click', (event) => {
        const moveButton = event.target.closest('.move-item-btn');
        if (moveButton) {
            event.preventDefault();
            const { orderNumber, itemId, nextStatusId } = moveButton.dataset;
            // Llama a la función que le pasó el 'director'
            onItemUpdate(parseInt(orderNumber), parseInt(itemId), parseInt(nextStatusId));
            return; // Termina para no procesar otros botones
        }

        const detailsButton = event.target.closest('.view-details-btn');
        if (detailsButton) {
            const { orderNumber } = detailsButton.dataset;
            // Llama a la función que le pasó el 'director'
            onShowDetails(parseInt(orderNumber));
        }
    });
};