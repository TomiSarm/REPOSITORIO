import { isAuthenticated } from '../auth.js';

export default function ProtectedRoute(component) {
    if (!isAuthenticated()) {
        window.location.href = '/login';
        return null;
    }
    return component();
}