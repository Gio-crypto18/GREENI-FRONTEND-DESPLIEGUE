document.addEventListener('DOMContentLoaded', async () => {
    const registerForm = document.getElementById('registerForm');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const errorMessage = document.getElementById('error-message');
    const submitButton = document.querySelector('.btn-register');
    const API_URL = 'https://6862d10a96f0cc4e34bb10c3.mockapi.io/api/v1/users';

    registerForm.addEventListener('submit', async (event) => {
        event.preventDefault(); 
        submitButton.disabled = true;
        submitButton.textContent = 'Registrando...';
        errorMessage.textContent = '';
        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        if (!name || !email || !password || !confirmPassword) {
            showError('Todos los campos son obligatorios.');
            return;
        }
        if (password.length < 8) {
            showError('La contraseña debe tener al menos 8 caracteres.');
            return;
        }
        if (password !== confirmPassword) {
            showError('Las contraseñas no coinciden.');
            return;
        }

        try {
            console.log(`Verificando email: ${email}`);
            const checkResponse = await fetch(API_URL);
            if (!checkResponse.ok) throw new Error('Error al verificar el email.');       
            const allUsers = await checkResponse.json();
            console.log('Todos los usuarios:', allUsers);
            const existingUser = allUsers.find(user => user.email === email);
            console.log('Usuario encontrado con ese email:', existingUser);

            if (existingUser) {
                showError('Este correo electrónico ya está registrado.');
                return;
            }
            const newUser = { 
                name, 
                email, 
                password
            };
            console.log('Creando nuevo usuario con los siguientes datos:', newUser);

            const createResponse = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newUser),
            });

            if (!createResponse.ok) {
                const errorText = await createResponse.text();
                console.error('Error de MockAPI:', errorText);
                throw new Error(`No se pudo crear la cuenta en la API: ${createResponse.status}`);
            }
            
            const createdUser = await createResponse.json();
            console.log('Usuario creado exitosamente:', createdUser);

            alert('¡Cuenta creada con éxito! Serás redirigido para iniciar sesión.');
            window.location.href = 'login.html';

        } catch (error) {
            console.error('Error en el proceso de registro:', error);
            showError(`Ocurrió un error: ${error.message}`);
        }
    });

    function showError(message) {
        errorMessage.textContent = message;
        submitButton.disabled = false;
        submitButton.textContent = 'Crear Cuenta';
    }

    const role = document.getElementById("reg-role").value;
// ...
    const newUser = {
    userId   : crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    username, fullName, email,
    status   : "Activo",
    joinedAt : new Date().toISOString(),
    bio      : "",
    avatar   : "",
    role, // <--- guarda el rol elegido
    notifications: { reminders:true, interactions:true, friends:true, newsletter:false },
    passwordHash: await sha256(password)
};
upsertUser(newUser);
setCurrentUserId(newUser.userId);
// después de validar el formulario de registro…
const USERS_KEY='greeni_users', CURRENT_KEY='greeni_current_user_id';
const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');

const user = {
  userId   : crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
  username : regUsername,        // del formulario
  fullName : regFullName,        // del formulario
  email    : regEmail,
  status   : "Activo",
  joinedAt : new Date().toISOString(),
  bio      : "",
  avatar   : "",
  role     : regRole,            // del <select> (plantlover/cientifico/admin)
  notifications: {reminders:true,interactions:true,friends:true,newsletter:false},
  passwordHash: await sha256(regPassword)
};

users.push(user);
localStorage.setItem(USERS_KEY, JSON.stringify(users));
localStorage.setItem(CURRENT_KEY, user.userId);
window.location.href = "perfil.html";


});