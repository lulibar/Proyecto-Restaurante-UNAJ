export const initializePanelHandlers = (container, onItemUpdate, onShowDetails, onCancelItem ) => {
    container.addEventListener('click', (event) => {
        const target = event.target; 
        const moveButton = event.target.closest('.move-item-btn');
        if (moveButton) {
            event.preventDefault();
            const { orderNumber, itemId, nextStatusId } = moveButton.dataset;
            onItemUpdate(parseInt(orderNumber), parseInt(itemId), parseInt(nextStatusId));
            return; 
        }

        const detailsButton = event.target.closest('.view-details-btn');
        if (detailsButton) {
            const { orderNumber } = detailsButton.dataset;
            onShowDetails(parseInt(orderNumber));
        }
        const cancelItemButton = target.closest('.cancel-item-btn');
        if (cancelItemButton) {
            const { orderNumber, itemId } = cancelItemButton.dataset; 
            
            if (typeof onCancelItem === 'function') { 
                onCancelItem(parseInt(orderNumber), parseInt(itemId));
            } else {
                console.error("Error: onCancelItem no es una función!"); // Mensaje si falla
            }
        }
    });
};