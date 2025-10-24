export const createStatusFilterOptionsHTML = (statuses) => {
    return statuses.map(status => `<option value="${status.id}">${status.name}</option>`).join('');
};