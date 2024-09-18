import Home from './views/Home.js';
import Profile from './views/Profile.js';
import Login from './views/Login.js';
import Register from './views/Register.js';

const root = document.getElementById('app');

const routes = {
    '/': Home,
    '/profile': Profile,
    '/login': Login,
    '/register': Register,
};

function navigateTo(path) {
    window.history.pushState({}, path, window.location.origin + path);
    root.innerHTML = '';
    const component = routes[path] || Home;
    root.appendChild(component());
}

window.addEventListener('popstate', () => {
    root.innerHTML = '';
    const component = routes[window.location.pathname] || Home;
    root.appendChild(component());
});

// Initial load
navigateTo(window.location.pathname);

document.body.addEventListener('click', (e) => {
    if (e.target.matches('a')) {
        e.preventDefault();
        navigateTo(e.target.href);
    }
});