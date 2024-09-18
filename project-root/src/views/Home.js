export default function Home() {
    const div = document.createElement('div');
    div.innerHTML = `
        <h1>Home</h1>
        <p>Welcome to our app!</p>
    `;
    return div;
}