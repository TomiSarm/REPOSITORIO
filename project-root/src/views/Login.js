import LoginForm from '../components/LoginForm.js';

export default function Login() {
    const div = document.createElement('div');
    div.appendChild(LoginForm());
    return div;
}