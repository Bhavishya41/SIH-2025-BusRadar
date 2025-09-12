const API_URL = 'http://localhost:8000/api'; // Adjust if your backend URL is different

export const findRoutes = async (from, to) => {
    const response = await fetch(`${API_URL}/routes/find?from=${from}&to=${to}`);
    if (!response.ok) {
        throw new Error('Failed to find routes');
    }
    return response.json();
};

export const getActiveBuses = async (routeId) => {
    const response = await fetch(`${API_URL}/buses/route/${routeId}`);
    if (!response.ok) {
        throw new Error('Failed to get active buses');
    }
    return response.json();
};

export const getBusDetails = async (busId) => {
    const response = await fetch(`${API_URL}/buses/${busId}`);
    if (!response.ok) {
        throw new Error('Failed to get bus details');
    }
    return response.json();
};