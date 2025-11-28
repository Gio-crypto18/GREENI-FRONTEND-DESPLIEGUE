document.addEventListener('DOMContentLoaded', () => {
    const checkEmailSection = document.getElementById('check-email-section');
    const resetPasswordSection = document.getElementById('reset-password-section');
    const checkEmailForm = document.getElementById('checkEmailForm');
    const resetPasswordForm = document.getElementById('resetPasswordForm');
    const emailInput = document.getElementById('email');
    const userIdInput = document.getElementById('userId');
    const newPasswordInput = document.getElementById('new-password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const checkErrorMessage = document.getElementById('check-error-message');
    const resetErrorMessage = document.getElementById('reset-error-message');
    const API_URL = 'https://6862d10a96f0cc4e34bb10c3.mockapi.io/api/v1/users';
    checkEmailForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        checkErrorMessage.textContent = '';
        const email = emailInput.value.trim();

        if (!email) {
            checkErrorMessage.textContent = 'Por favor, ingresa un correo electrónico.';
            return;
        }

        try {
            const response = await fetch(`${API_URL}?email=${encodeURIComponent(email)}`);
            if (!response.ok) throw new Error('Error al conectar con la API.');
            
            const users = await response.json();

            if (users.length > 0) {
                const user = users[0];
                userIdInput.value = user.id;
                checkEmailSection.classList.add('hidden');
                resetPasswordSection.classList.remove('hidden');
            } else {
                checkErrorMessage.textContent = 'No se encontró ninguna cuenta con ese correo.';
            }
        } catch (error) {
            console.error('Error verificando email:', error);
            checkErrorMessage.textContent = 'Ocurrió un error. Inténtalo de nuevo.';
        }
    });
    resetPasswordForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        resetErrorMessage.textContent = '';
        
        const userId = userIdInput.value;
        const newPassword = newPasswordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        if (newPassword.length < 8) {
            resetErrorMessage.textContent = 'La nueva contraseña debe tener al menos 8 caracteres.';
            return;
        }
        if (newPassword !== confirmPassword) {
            resetErrorMessage.textContent = 'Las contraseñas no coinciden.';
            return;
        }

        try {
            const response = await fetch(`${API_URL}/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password: newPassword }),
            });

            if (!response.ok) {
                throw new Error('No se pudo actualizar la contraseña.');
            }
            alert('¡Contraseña actualizada con éxito! Serás redirigido para iniciar sesión.');
            window.location.href = 'login.html'; 

        } catch (error) {
            console.error('Error actualizando la contraseña:', error);
            resetErrorMessage.textContent = 'Ocurrió un error. Inténtalo de nuevo.';
        }
    });
});