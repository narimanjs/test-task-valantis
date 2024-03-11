import md5 from 'crypto-js/md5';

const BASE_URL = 'https://api.valantis.store:41000/';
const PASSWORD = 'Valantis';

// Функция для генерации значения X-Auth
function generateXAuth() {
  const date = new Date();
  const timestamp =
    date.getUTCFullYear().toString() +
    (date.getUTCMonth() + 1).toString().padStart(2, '0') +
    date.getUTCDate().toString().padStart(2, '0');

  const authString = `${PASSWORD}_${timestamp}`;
  const hash = md5(authString);
  return hash.toString();
}

// Универсальная функция для выполнения POST-запросов к API
function postRequest(action, params = {}) {
  const headers = new Headers({
    'Content-Type': 'application/json',
    'X-Auth': generateXAuth(),
  });

  return fetch(BASE_URL, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify({ action, params }),
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      if (data.result) {
        return data.result;
      } else {
        throw new Error('No result from API');
      }
    })
    .catch(error => console.error('API error:', error));
}
// Функции для взаимодействия с конкретными методами API
export const getIds = params => postRequest('get_ids', params);
export const getItems = async params => {
  return postRequest('get_items', { ids: params.ids });
};
export const getFields = params => postRequest('get_fields', params);
export const filterItems = params => postRequest('filter', params);
