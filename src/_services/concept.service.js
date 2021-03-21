//import config from 'config';
import { fetchWrapper } from '../_helpers/fetch-wrapper';

//const baseUrl = `${config.apiUrl}/concepts`;
const baseUrl = 'https://7gi9ssm24e.execute-api.us-east-2.amazonaws.com/latest/concept';

export const conceptService = {
    getAll,
    getById,
    create,
    update,
    delete: _delete
};

function getAll() {
    return fetchWrapper.get(baseUrl);
}

function getById(id) {
    return fetchWrapper.get(`${baseUrl}/${id}`);
}

function create(params) {
    return fetchWrapper.post(baseUrl, params);
}

function update(id, params) {
    return fetchWrapper.put(`${baseUrl}/${id}`, params);
}

// prefixed with underscored because delete is a reserved word in javascript
function _delete(id) {
    return fetchWrapper.delete(`${baseUrl}/${id}`);
}
