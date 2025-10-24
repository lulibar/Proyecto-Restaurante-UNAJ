export const createDeliveryTypeOptionsHTML = (deliveryTypes) => {
    return deliveryTypes.map(type => `
        <div class="form-check">
            <input class="form-check-input delivery-type-radio" type="radio" name="deliveryType" id="deliveryType-${type.id}" value="${type.id}" data-name="${type.name}">
            <label class="form-check-label" for="deliveryType-${type.id}">${type.name}</label>
        </div>
    `).join('');
};