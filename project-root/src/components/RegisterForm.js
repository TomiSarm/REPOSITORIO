import { register } from '../auth.js';

export default function RegisterForm() {
    const form = document.createElement('form');
    form.innerHTML = `
        <h2>Register</h2>
        <input type="text" placeholder="First Name" id="firstName" required>
        <input type="text" placeholder="Last Name" id="lastName" required>
        <input type="email" placeholder="Email" id="email" required>
        <input type="password" placeholder="Password" id="password" required>
        <button type="submit">Register</button>
    `;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const firstName = form.querySelector('#firstName').value;
        const lastName = form.querySelector('#lastName').value;
        const email = form.querySelector('#email').value;
        const password = form.querySelector('#password').value;
        const success = await register(firstName, lastName, email, password);
        if (success) {
            window.location.href = '/login';
        } else {
            alert('Registration failed');
        }
    });

    return form;
}