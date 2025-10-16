export const setupOrderCardActions = (container, handleUpdate, handleViewDetails) => {
    container.addEventListener('click', (event) => {
        const moveButton = event.target.closest('.move-item-btn');
        const detailsButton = event.target.closest('.view-details-btn');

        if (moveButton) {
            event.preventDefault();
            const orderNumber = parseInt(moveButton.getAttribute('data-order-number'));
            const itemId = parseInt(moveButton.getAttribute('data-item-id'));
            const nextStatusId = parseInt(moveButton.getAttribute('data-next-status-id'));
            handleUpdate(orderNumber, itemId, nextStatusId); 
        }

        if (detailsButton) {
            const orderNumber = parseInt(detailsButton.getAttribute('data-order-number'));
            handleViewDetails(orderNumber); 
        }
    });
};