import ProtectedRoute from '../components/ProtectedRoute.js';

export default function Profile() {
    return ProtectedRoute(() => {
        const div = document.createElement('div');
        div.innerHTML = `
            <h1>Profile</h1>
            <p>This is your protected profile page.</p>
            <button id="logout">Logout</button>
        `;

        div.querySelector('#logout').addEventListener('click', () => {
            localStorage.removeItem('token');
            window.location.href = '/login';
        });

        return div;
    });
}