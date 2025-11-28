// ===== Greeni MAIN: Sidebar + Sesión canónica en localStorage =====
document.addEventListener('DOMContentLoaded', () => {
  const USERS_KEY   = 'greeni_users';
  const CURRENT_KEY = 'greeni_current_user_id';
  const AUTH_KEY      = 'greeni_auth_user';           // espejo para otros módulos (calendario, etc.)
  const SESSION_KEY   = 'currentUser';  

   // ---- utils
  const $ = (s, r=document) => r.querySelector(s);

  const loadUsers  = () => JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  const saveUsers  = (list) => localStorage.setItem(USERS_KEY, JSON.stringify(list));
  const getCurId   = () => localStorage.getItem(CURRENT_KEY);
  const setCurId   = (id) => localStorage.setItem(CURRENT_KEY, id);
  const findUser   = (id) => loadUsers().find(u => u.userId === id);
  const byEmail    = (email) => loadUsers().find(u => u.email?.toLowerCase() === email?.toLowerCase());

  function reflectAuth(userOrNull){
    if (!userOrNull){
      localStorage.removeItem(AUTH_KEY);
      return;
    }
    const { userId:id, fullName:name, email, role, joinedAt, status, bio, avatar, notifications } = userOrNull;
    localStorage.setItem(AUTH_KEY, JSON.stringify({
      id, name, email, role, joinedAt, status, bio, avatar, notifications
    }));
  }

  // ---- purga de claves LEGACY de avatar (una vez por carga)
  (function purgeOldAvatarKeys(){
    const kill = [];
    for (let i=0;i<localStorage.length;i++){
      const k = localStorage.key(i);
      if (!k) continue;
      if (k.startsWith('avatar_') || k === 'profileAvatarDataUrl') kill.push(k);
    }
    kill.forEach(k => localStorage.removeItem(k));
    sessionStorage.removeItem('profileAvatarDataUrl');
  })();

  function ensureCanonicalUser() {
    // 1) CURRENT_KEY válido
    const curId = getCurId();
    if (curId){
      const u = findUser(curId);
      if (u){
        reflectAuth(u);
        return u;
      }
    }

    // 2) ¿llegó desde login/registro?
    let ss = null;
    try { ss = JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null'); } catch {}

    if (ss?.email){
      // ¿ya existe por email?
      const existing = byEmail(ss.email);
      if (existing){
        setCurId(existing.userId);
        // opcional: refrescar data editable con lo de session si viene algo nuevo
        reflectAuth(existing);
        // Asegurar espejo mínimo en session para pantallas que dependan de él
        sessionStorage.setItem(SESSION_KEY, JSON.stringify({
          userId: existing.userId,
          name: existing.fullName,
          email: existing.email,
          role: existing.role,
          joinedAt: existing.joinedAt,
          status: existing.status,
          bio: existing.bio,
          avatar: existing.avatar,
          notifications: existing.notifications,
          passwordHash: existing.passwordHash
        }));
        return existing;
      }

      // No existe: crearlo con los datos del login
      const now = new Date().toISOString();
      const newUser = {
        userId   : crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
        username : (ss.email.split('@')[0] || 'usuario.greeni'),
        fullName : ss.name  || (ss.email.split('@')[0]) || 'Usuario',
        email    : ss.email,
        status   : 'Activo',
        joinedAt : ss.joinedAt || now,
        bio      : '',
        avatar   : '',
        role     : ss.role || 'plantlover',
        notifications: { reminders:true, interactions:true, friends:true, newsletter:false },
        passwordHash: ss.passwordHash || ''
      };
      const users = loadUsers();
      users.push(newUser);
      saveUsers(users);
      setCurId(newUser.userId);
      reflectAuth(newUser);
      sessionStorage.setItem(SESSION_KEY, JSON.stringify({
        userId: newUser.userId,
        name: newUser.fullName,
        email: newUser.email,
        role: newUser.role,
        joinedAt: newUser.joinedAt,
        status: newUser.status,
        bio: newUser.bio,
        avatar: newUser.avatar,
        notifications: newUser.notifications,
        passwordHash: newUser.passwordHash
      }));
      return newUser;
    }

    // 3) Nada: demo
    const now = new Date().toISOString();
    const demo = {
      userId   : crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      username : 'usuario.greeni',
      fullName : 'Usuario',
      email    : 'usuario@greeni.com',
      status   : 'Activo',
      joinedAt : now,
      bio      : '',
      avatar   : '',
      role     : 'plantlover',
      notifications: { reminders:true, interactions:true, friends:true, newsletter:false },
      passwordHash: ''
    };
    const users = loadUsers();
    users.push(demo);
    saveUsers(users);
    setCurId(demo.userId);
    reflectAuth(demo);
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({
      userId: demo.userId,
      name: demo.fullName,
      email: demo.email,
      role: demo.role,
      joinedAt: demo.joinedAt,
      status: demo.status,
      bio: demo.bio,
      avatar: demo.avatar,
      notifications: demo.notifications,
      passwordHash: demo.passwordHash
    }));
    return demo;
  }

  // -------- Sidebar --------
  async function loadSidebar() {
    const host = document.getElementById('sidebar-container');
    if (!host) return;

    try {
      const res = await fetch('sidebar.html', { cache: 'no-store' });
      if (!res.ok) throw new Error('No se pudo cargar el sidebar');
      host.innerHTML = await res.text();

      populateUserProfile();    // inicial
      setActiveLink();          // link activo
      handleMenuToggle();
      handleLogout();

      // Rehidratar si cambia el usuario en otra pestaña o por login
      window.addEventListener('greeni-user-updated', populateUserProfile);
      window.addEventListener('storage', (e) => {
        if ([USERS_KEY, CURRENT_KEY, AUTH_KEY].includes(e.key)) {
          populateUserProfile();
        }
      });

    } catch (err) {
      console.error('Sidebar:', err);
      host.innerHTML = '<p>Error al cargar el menú.</p>';
    }
  }

  function populateUserProfile() {
    const u = ensureCanonicalUser();

    const ava  = document.getElementById('user-avatar');
    const name = document.getElementById('user-name');
    const mail = document.getElementById('user-email');

    if (name) name.textContent = u.fullName || u.username || 'Usuario';
    if (mail) mail.textContent = u.email || 'usuario@greeni.com';

    // limpia <img> heredados
    document.querySelectorAll('#user-avatar img').forEach(n => n.remove());

    if (ava){
      if (u.avatar){
        ava.style.backgroundImage = `url('${u.avatar}')`;
        ava.style.backgroundSize = 'cover';
        ava.style.backgroundPosition = 'center';
        ava.textContent = '';
      } else {
        ava.style.backgroundImage = '';
        const initials = (u.fullName || u.username || 'U')
          .split(' ').filter(Boolean).slice(0,2).map(w=>w[0]?.toUpperCase()).join('') || 'U';
        ava.textContent = initials;
      }
    }

    // borra claves legacy
    localStorage.removeItem('profileAvatarDataUrl');
    sessionStorage.removeItem('profileAvatarDataUrl');
  }

  function setActiveLink() {
    const list = document.querySelectorAll('#nav-links a');
    const file = window.location.pathname.split('/').pop();
    list.forEach(a => {
      if (a.getAttribute('href') === file) a.classList.add('active');
    });
  }

  function handleMenuToggle() {
    const menuBtn = document.getElementById('menu-toggle');
    if (menuBtn) menuBtn.addEventListener('click', () => {
      document.body.classList.toggle('sidebar-open');
    });
  }

  function handleLogout() {
    const logoutButton = document.getElementById('logout-btn');
    if (!logoutButton) return;
    logoutButton.addEventListener('click', (e) => {
      e.preventDefault();
      // limpiar sesión coherentemente
      sessionStorage.removeItem(SESSION_KEY);
      localStorage.removeItem(CURRENT_KEY);
      localStorage.removeItem(AUTH_KEY);
      // (opcional) NO borramos greeni_users para permitir re-login del mismo browser
      window.location.href = 'login.html';
    });
  }

  loadSidebar();
});