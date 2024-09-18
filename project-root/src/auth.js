export const login = async (email, password) => {
    const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (data.token) {
        localStorage.setItem('token', data.token);
        return true;
    }
    return false;
};

export const register = async (firstName, lastName, email, password) => {
    const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ firstName, lastName, email, password }),
    });
    const data = await response.json();
    if (data.success) {
        return true;
    }
    return false;
};

export const logout = () => {
    localStorage.removeItem('token');
};

export const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    return !!token;
};