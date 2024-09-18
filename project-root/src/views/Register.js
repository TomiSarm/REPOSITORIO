import RegisterForm from '../components/RegisterForm.js';

export default function Register() {
    const div = document.createElement('div');
    div.appendChild(RegisterForm());
    return div;
}