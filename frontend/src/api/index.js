const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
    };
};

const handleResponse = async (response) => {
    if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
            // Optional: Handle token expiration
            console.error('Unauthorized request');
        }
        throw new Error('API request failed: ' + response.statusText);
    }
    const text = await response.text();
    return text ? JSON.parse(text) : null;
};

export const api = {
    get: async (endpoint) => {
        const res = await fetch(`/api/${endpoint}`, { headers: getHeaders() });
        return handleResponse(res);
    },
    post: async (endpoint, data) => {
        const res = await fetch(`/api/${endpoint}`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(data)
        });
        return handleResponse(res);
    },
    put: async (endpoint, data) => {
        const res = await fetch(`/api/${endpoint}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(data)
        });
        return handleResponse(res);
    },
    delete: async (endpoint) => {
        const res = await fetch(`/api/${endpoint}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        return handleResponse(res);
    }
};
