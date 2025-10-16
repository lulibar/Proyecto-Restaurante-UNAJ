export const createColumnHTML = (status) => {
    return `
        <div class="col-md-3">
            <div class="card bg-light h-100">
                <div class="card-header text-center">
                    <h5 class="card-title mb-0">${status.name}</h5>
                </div>
                <div class="card-body" id="status-col-${status.id}" data-status-id="${status.id}">
                    </div>
            </div>
        </div>
    `;
};