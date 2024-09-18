import { login } from '../auth.js';

export default function LoginForm() {
    const form = document.createElement('form');
    form.innerHTML = `
        <h2>Login</h2>
        <input type="email" placeholder="Email" id="email" required>
        <input type="password" placeholder="Password" id="password" required>
        <button type="submit">Login</button>
    `;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = form.querySelector('#email').value;
        const password = form.querySelector('#password').value;
        const success = await login(email, password);
        if (success) {
            window.location.href = '/profile';
        } else {
            alert('Login failed');
        }
    });

    return form;
}