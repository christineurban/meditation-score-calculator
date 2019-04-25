function makeAPICall(url, options = {}, skipDefaults) {
  if (!skipDefaults) {
    options.accept = options.accept || 'application/json';
    options.body = typeof options.body === 'string' ? options.body : JSON.stringify(options.body);
    options.credentials = options.credentials || 'same-origin';
    options.headers = options.headers || {};
    options.headers['Content-Type'] = options.headers['Content-Type'] || 'application/json';
  }

  return fetch(url, options)
    .then(checkStatus)
    .then(parseJSON)
    .catch(logError);
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else if (response.status === 403) {
    // Forbidden status, the user is not logged in
    window.location = '/';
  } else {
    const error = new Error(`HTTP Error ${response.statusText}`);

    error.status = response.statusText;
    error.response = response;
    throw error;
  }
}

function parseJSON(response) {
  if (response.headers.get('content-type').includes('json')) {
    return response.json();
  }

  return response;
}

function logError(error) {
  console.error(error);
  throw error;
}

const Client = { fetch: makeAPICall };

export default Client;
