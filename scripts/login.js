document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const errorMessageElement = document.getElementById('login-error-message');
    const submitButton = loginForm.querySelector('button[type="submit"]');

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault(); 
        errorMessageElement.textContent = '';
        submitButton.disabled = true;
        submitButton.textContent = 'Verificando...';

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        if (!email || !password) {
            showError('Por favor, completa todos los campos.');
            return;
        }
        
        await checkUserCredentials(email, password);
    });
    async function checkUserCredentials(email, password) {
        const apiUrl = `https://6862d10a96f0cc4e34bb10c3.mockapi.io/api/v1/users?email=${encodeURIComponent(email)}`;

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error('Hubo un problema al conectar con el servidor.');
            }
            
            const users = await response.json();
            const user = users[0]; 
            if (user && user.password === password) {
                const userData = {
                    name: user.name,
                    email: user.email,
                };
                sessionStorage.setItem('currentUser', JSON.stringify(userData));
                window.location.href = 'home.html';

            } else {
                showError('Correo o contraseña incorrectos. Por favor, inténtalo de nuevo.');
            }

        } catch (error) {
            console.error('Error en el inicio de sesión:', error);
            showError('Ocurrió un error inesperado. Verifica tu conexión.');
        }
    }
    function showError(message) {
        errorMessageElement.textContent = message;
        submitButton.disabled = false;
        submitButton.textContent = 'Iniciar Sesión';
    }
});