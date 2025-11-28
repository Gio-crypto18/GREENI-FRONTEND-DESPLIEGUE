const KEY_SESSION_USER = "currentUser";
const LS_USERS   = "greeni_users";
const LS_CURRID  = "greeni_current_user_id";

const $  = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => [...r.querySelectorAll(s)];

function setFeedback(sel, msg, kind="ok") {
  const el = $(sel);
  if (!el) return;
  el.textContent = msg;
  el.classList.remove("ok","err");
  el.classList.add(kind);
  setTimeout(() => { el.textContent=""; el.classList.remove("ok","err"); }, 2500);
}

function getCurrentUserOrRedirect() {
  const raw = sessionStorage.getItem(KEY_SESSION_USER);
  if (!raw) { window.location.href = "login.html"; return null; }
  try { return JSON.parse(raw); }
  catch { window.location.href = "login.html"; return null; }
}

function loadUsers(){ return JSON.parse(localStorage.getItem(LS_USERS) || '[]'); }
function saveUsers(list){ localStorage.setItem(LS_USERS, JSON.stringify(list)); }
function getCurrentUserId(){ return localStorage.getItem(LS_CURRID); }

// --- purga de claves legacy (solo por seguridad cuando abras perfil)
(function clearLegacyAvatars(){
  const kill = [];
  for (let i=0;i<localStorage.length;i++){
    const k = localStorage.key(i);
    if (!k) continue;
    if (k.startsWith('avatar_') || k === 'profileAvatarDataUrl') kill.push(k);
  }
  kill.forEach(k => localStorage.removeItem(k));
  sessionStorage.removeItem('profileAvatarDataUrl');
})();

let currentUser = null;
let initialProfile = null;

document.addEventListener("DOMContentLoaded", () => {
  currentUser = getCurrentUserOrRedirect();
  if (!currentUser) return;

  bindTabs();
  bindAvatar();
  bindProfileForm();
  bindPasswordForm();
  bindNotificationsForm();

  renderFromUser(currentUser);
});

// ----------- Render / Avatar -----------

function renderAvatarFromModel(){
  const prev = $("#avatar-preview");
  if (!prev) return;
  prev.innerHTML = "";

  if (currentUser?.avatar){
    const img = new Image();
    img.src = currentUser.avatar;
    img.style.width = "100%";
    img.style.height = "100%";
    img.style.objectFit = "cover";
    prev.appendChild(img);
  }else{
    const initials = (currentUser.name || currentUser.fullName || "U")
      .split(" ").filter(Boolean).slice(0,2).map(w=>w[0]?.toUpperCase()).join("") || "U";
    const span = document.createElement("span");
    span.id = "avatar-initials";
    span.textContent = initials;
    prev.appendChild(span);
  }
}

function renderFromUser(user) {
  // Header
  $("#profile-name-header").textContent  = user.name || user.fullName || "—";
  $("#profile-email-header").textContent = user.email || "—";

  const role = (user.role || "plantlover").toLowerCase();
  const rb = $("#role-badge");
  if (rb) {
    rb.textContent =
      role === "admin"      ? "Admin" :
      role === "cientifico" ? "Científico" :
                              "Plant Lover";
    rb.className = "role-badge " +
      (role === "admin"      ? "role-admin" :
       role === "cientifico" ? "role-cientifico" : "role-plantlover");
  }

  // Avatar desde el modelo canónico
  renderAvatarFromModel();

  // Form perfil
  const joined = user.joinedAt ? new Date(user.joinedAt) : new Date();
  $("#userId").value   = user.userId || user.id || "—";
  $("#joinedAt").value = joined.toLocaleString("es-PE");
  $("#fullName").value = user.name || user.fullName || "";
  $("#email").value    = user.email || "";
  $("#status").value   = user.status || "Activo";
  $("#bio").value      = user.bio || "";

  const roleSel = $("#role");
  if (roleSel) {
    roleSel.value = role;
    const isAdmin = role === "admin"; // solo admin puede cambiar rol
    roleSel.disabled = !isAdmin;
    const rh = $("#role-help");
    if (rh) {
      rh.textContent = isAdmin
        ? "Puedes cambiar el rol de esta cuenta (solo admin)."
        : "Tu rol fue definido al registrarte.";
    }
  }

  // snapshot/botón
  initialProfile = takeProfileSnapshot();
  toggleSaveButton(false);
}

function takeProfileSnapshot() {
  return {
    name: $("#fullName").value.trim(),
    email: $("#email").value.trim(),
    status: $("#status").value,
    bio: $("#bio").value.trim(),
    role: ($("#role")?.value || (currentUser.role || "plantlover")).toLowerCase()
  };
}

function toggleSaveButton(enabled) {
  $("#save-profile-btn").disabled = !enabled;
}

// ----------- Subida de avatar -----------

function bindAvatar(){
  const input = $("#image-upload");
  const preview = $("#avatar-preview");
  if (!input || !preview) return;

  // permitir click en el círculo
  preview.addEventListener('click', () => input.click());

  input.addEventListener("change", () => {
    const file = input.files?.[0];
    if (!file) return;

    if (!['image/png','image/jpeg'].includes(file.type))
      return setFeedback('#profile-feedback','Solo PNG o JPG.','err');
    if (file.size > 2*1024*1024)
      return setFeedback('#profile-feedback','Máximo 2 MB.','err');

    const r = new FileReader();
    r.onload = () => {
      const base64 = r.result;

      // 1) actualiza el usuario en sesión
      currentUser.avatar = base64;
      sessionStorage.setItem(KEY_SESSION_USER, JSON.stringify(currentUser));

      // 2) actualiza el CANÓNICO greeni_users
      const id   = getCurrentUserId();
      const list = loadUsers();
      const i    = list.findIndex(u => u.userId === id);
      if (i >= 0){
        list[i].avatar = base64;
        saveUsers(list);
      }

      // 3) repinta y avisa al sidebar
      renderAvatarFromModel();
      window.dispatchEvent(new Event('greeni-user-updated'));
      setFeedback('#profile-feedback','Foto actualizada.','ok');
    };
    r.onerror = () => setFeedback('#profile-feedback','No se pudo leer la imagen.','err');
    r.readAsDataURL(file);
  });
}

// ----------- Tabs -----------

function bindTabs() {
  const tabs = $$(".tab-link");
  const secs = $$(".profile-section");
  tabs.forEach(btn => {
    btn.addEventListener("click", () => {
      tabs.forEach(b => b.classList.remove("active"));
      secs.forEach(s => s.classList.remove("active"));
      btn.classList.add("active");
      const id = btn.dataset.section;
      $("#"+id)?.classList.add("active");
    });
  });
}

// ----------- Guardado de Perfil -----------

function bindProfileForm() {
  // Cambios → habilitar guardar
  ["fullName","email","status","bio","role"].forEach(id => {
    const el = $("#"+id);
    if (!el) return;
    const on = () => {
      const now = takeProfileSnapshot();
      toggleSaveButton(JSON.stringify(now) !== JSON.stringify(initialProfile));
    };
    el.addEventListener("input", on);
    el.addEventListener("change", on);
  });

  $("#btn-new-user")?.addEventListener("click", () => {
    window.location.href = "register.html";
  });

  $("#btn-delete-user")?.addEventListener("click", () => {
    if (!confirm("¿Eliminar tu cuenta y volver a registrarte?")) return;

    // borra avatar del usuario del modelo canónico
    const id   = getCurrentUserId();
    const list = loadUsers();
    const i    = list.findIndex(u => u.userId === id);
    if (i >= 0){
      list.splice(i,1);
      saveUsers(list);
    }
    // limpia sesión
    sessionStorage.removeItem(KEY_SESSION_USER);
    // opcional: limpiar id actual
    localStorage.removeItem(LS_CURRID);

    window.location.href = "register.html";
  });

  $("#profile-form")?.addEventListener("submit", (e) => {
    e.preventDefault();

    const isAdmin = (currentUser.role || "plantlover").toLowerCase() === "admin";

    currentUser.name     = $("#fullName").value.trim();
    currentUser.fullName = currentUser.name;
    currentUser.email    = $("#email").value.trim();
    currentUser.status   = $("#status").value;
    currentUser.bio      = $("#bio").value.trim();
    if (isAdmin && $("#role")) currentUser.role = $("#role").value;

    // session
    sessionStorage.setItem(KEY_SESSION_USER, JSON.stringify(currentUser));

    // canónico
    const id   = getCurrentUserId();
    const list = loadUsers();
    const i    = list.findIndex(u => u.userId === id);
    if (i >= 0){
      list[i] = { ...list[i], ...currentUser };
      saveUsers(list);
      window.dispatchEvent(new Event('greeni-user-updated'));
    }

    renderFromUser(currentUser);
    setFeedback("#profile-feedback","Perfil actualizado correctamente.","ok");
  });
}

// ----------- Seguridad (demo hash) -----------

async function sha256(str) {
  const data = new TextEncoder().encode(str);
  const buf  = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,"0")).join("");
}

function bindPasswordForm() {
  $$(".password-toggle").forEach(icon => {
    icon.addEventListener("click", () => {
      const input = icon.previousElementSibling;
      if (!input) return;
      input.type = input.type === "password" ? "text" : "password";
      icon.classList.toggle("fa-eye-slash");
    });
  });

  $("#password-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const cur  = $("#currentPassword").value;
    const np   = $("#newPassword").value;
    const rep  = $("#confirmPassword").value;

    if (np !== rep)  return setFeedback("#password-feedback","Las contraseñas no coinciden.","err");
    if (np.length<8) return setFeedback("#password-feedback","Mínimo 8 caracteres.","err");

    if (currentUser.passwordHash) {
      const ok = (await sha256(cur)) === currentUser.passwordHash;
      if (!ok) return setFeedback("#password-feedback","La contraseña actual es incorrecta.","err");
    }
    currentUser.passwordHash = await sha256(np);
    sessionStorage.setItem(KEY_SESSION_USER, JSON.stringify(currentUser));

    // canónico
    const id   = getCurrentUserId();
    const list = loadUsers();
    const i    = list.findIndex(u => u.userId === id);
    if (i >= 0){ list[i].passwordHash = currentUser.passwordHash; saveUsers(list); }

    $("#password-form").reset();
    setFeedback("#password-feedback","Contraseña actualizada.","ok");
  });
}

// ----------- Notificaciones -----------

function bindNotificationsForm() {
  const n = currentUser.notifications || {reminders:true,interactions:true,friends:true,newsletter:false};
  $("#n-reminders").checked    = !!n.reminders;
  $("#n-interactions").checked = !!n.interactions;
  $("#n-friends").checked      = !!n.friends;
  $("#n-newsletter").checked   = !!n.newsletter;

  $("#save-notifications")?.addEventListener("click", () => {
    currentUser.notifications = {
      reminders:   $("#n-reminders").checked,
      interactions:$("#n-interactions").checked,
      friends:     $("#n-friends").checked,
      newsletter:  $("#n-newsletter").checked
    };
    sessionStorage.setItem(KEY_SESSION_USER, JSON.stringify(currentUser));

    // canónico
    const id   = getCurrentUserId();
    const list = loadUsers();
    const i    = list.findIndex(u => u.userId === id);
    if (i >= 0){ list[i].notifications = currentUser.notifications; saveUsers(list); }

    setFeedback("#notif-feedback","Notificaciones guardadas.","ok");
  });
}
