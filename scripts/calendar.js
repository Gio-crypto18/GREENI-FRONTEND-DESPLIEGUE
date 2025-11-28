// ===== Calendario / Recordatorios - Greeni (con ESTADOS y aislamiento por usuario) =====
const REM_KEY = "myReminders";
const USER_ID_KEY = "greeni_user_id";        // Fallback si no hay auth real
const USER_SEEN_KEY = "greeni_users_seen";   // Para marcar usuarios "nuevos"

// Helpers de DOM
const $  = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => [...root.querySelectorAll(sel)];

// ---------- Identidad de usuario ----------
function getOrCreateFallbackUserId(){
  let id = localStorage.getItem(USER_ID_KEY);
  if (!id) {
    id = (crypto.randomUUID ? crypto.randomUUID() : `guest-${Date.now()}`);
    localStorage.setItem(USER_ID_KEY, id);
  }
  return id;
}

/**
 * Si has guardado al usuario autenticado, colócalo como JSON en:
 * localStorage.greeni_auth_user = JSON.stringify({ id: "123" })  // o { email: "user@x.com" }
 * Este valor tendrá prioridad como userId.
 */
function getCurrentUserId(){
  try {
    const auth = JSON.parse(localStorage.getItem("greeni_auth_user") || "null");
    if (auth && (auth.id || auth.email)) {
      return String(auth.id || auth.email).toLowerCase();
    }
  } catch(_) {}
  return getOrCreateFallbackUserId();
}

function remKeyFor(userId){ return `${REM_KEY}:${userId}`; }

function markUserAsSeen(userId){
  const seen = new Set(JSON.parse(localStorage.getItem(USER_SEEN_KEY) || "[]"));
  if (!seen.has(userId)) {
    // Usuario nuevo: asegurar que no tenga recordatorios
    localStorage.setItem(remKeyFor(userId), "[]");
    seen.add(userId);
    localStorage.setItem(USER_SEEN_KEY, JSON.stringify([...seen]));
  }
}

const CURRENT_USER_ID = getCurrentUserId();
markUserAsSeen(CURRENT_USER_ID);

// Persistencia por usuario
const getReminders  = () => JSON.parse(localStorage.getItem(remKeyFor(CURRENT_USER_ID)) || "[]");
const saveReminders = (items) => localStorage.setItem(remKeyFor(CURRENT_USER_ID), JSON.stringify(items));

// Utiles
const uid = () => crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random());
const escapeHTML = (s="") => s.replace(/[&<>"']/g, c => ({
  "&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"
}[c]));
const toLocalInputValue = (iso) => {
  const d = new Date(iso);
  const pad = n => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};
const fmtDate = (iso) => new Date(iso).toLocaleString("es-PE", {
  year:"numeric", month:"long", day:"2-digit", hour:"2-digit", minute:"2-digit"
});
const labelStatus = (k) => k === "completed" ? "Completado" : (k === "overdue" ? "Vencido" : "Pendiente");

let calendar = null; // instancia de FullCalendar

document.addEventListener("DOMContentLoaded", () => {
  initCalendar();
  bindUI();
  renderList();
});

// ---------- UI ----------
function bindUI(){
  $("#btn-open-reminder")?.addEventListener("click", () => openNewModal());
  $("#modal-close")?.addEventListener("click", closeModal);
  $("#btn-cancel")?.addEventListener("click", closeModal);
  $("#reminder-form")?.addEventListener("submit", onSubmit);
  $("#btn-clear-reminders")?.addEventListener("click", clearAll);
  $("#reminder-search")?.addEventListener("input", renderList);
  $("#reminder-status-filter")?.addEventListener("change", renderList);
}

function openNewModal(dateIso=null){
  $("#modal-title").textContent = "Nuevo Recordatorio";
  $("#rem-id").value = "";
  $("#rem-title").value = "";
  $("#rem-type").value = "Otro";
  $("#rem-status").value = "pending";
  const base = dateIso ? new Date(dateIso) : new Date();
  $("#rem-datetime").value = toLocalInputValue(base.toISOString());
  showModal(true);
}

function openEditModal(rem){
  $("#modal-title").textContent = "Editar Recordatorio";
  $("#rem-id").value = rem.id;
  $("#rem-title").value = rem.title;
  $("#rem-type").value = rem.type || "Otro";
  $("#rem-status").value = rem.status || "pending";
  $("#rem-datetime").value = toLocalInputValue(rem.date);
  showModal(true);
}

function showModal(show){
  const m = $("#reminder-modal");
  if (!m) return;
  m.classList.toggle("show", !!show);
  m.setAttribute("aria-hidden", show ? "false" : "true");
}
function closeModal(){ showModal(false); }

// ---------- CRUD ----------
function onSubmit(e){
  e.preventDefault();
  const id     = $("#rem-id").value.trim();
  const title  = $("#rem-title").value.trim();
  const date   = $("#rem-datetime").value;
  const type   = $("#rem-type").value;
  const status = $("#rem-status").value; // pending | completed

  if (!title || !date){
    alert("Completa el título y la fecha.");
    return;
  }

  const iso = new Date(date).toISOString();
  let items = getReminders();

  if (id){
    items = items.map(r => r.id === id ? {...r, title, date: iso, type, status} : r);
  } else {
    items.push({ id: uid(), title, date: iso, type, status: status || "pending" });
  }

  saveReminders(items);
  closeModal();
  renderList();
  syncCalendar();
}

function clearAll(){
  if (!confirm("¿Eliminar todos los recordatorios?")) return;
  saveReminders([]);
  renderList();
  syncCalendar();
}

function updateStatus(id, newStatus){
  saveReminders(getReminders().map(r => r.id === id ? {...r, status:newStatus} : r));
  renderList();
  syncCalendar();
}

function removeReminder(id){
  saveReminders(getReminders().filter(r => r.id !== id));
  renderList();
  syncCalendar();
}

// ---------- LISTA ----------
function renderList(){
  const list = $("#reminders-list");
  if (!list) return;

  const q = ($("#reminder-search")?.value || "").toLowerCase().trim();
  const filter = $("#reminder-status-filter")?.value || "all";
  const now = new Date();

  let items = getReminders()
    .sort((a,b) => new Date(a.date) - new Date(b.date))
    .map(r => {
      const overdue = (r.status !== "completed") && (new Date(r.date) < now);
      const key = r.status === "completed" ? "completed" : (overdue ? "overdue" : "pending");
      return {...r, _statusKey: key};
    });

  if (q){
    items = items.filter(r =>
      (r.title || "").toLowerCase().includes(q) ||
      (r.type || "").toLowerCase().includes(q)
    );
  }
  if (filter !== "all"){
    items = items.filter(r => r._statusKey === filter);
  }

  if (!items.length){
    list.innerHTML = `<li class="reminder-item"><span class="reminder-meta">No hay recordatorios</span></li>`;
    return;
  }

  list.innerHTML = items.map(rem => `
    <li class="reminder-item ${rem._statusKey === "completed" ? "completed" : ""}" data-id="${rem.id}">
      <div class="reminder-left">
        <input type="checkbox" class="toggle-status" ${rem._statusKey === "completed" ? "checked" : ""} title="Marcar como completado">
        <div class="reminder-icon"><i class="fas fa-leaf"></i></div>
        <div>
          <div class="reminder-title">${escapeHTML(rem.title)}</div>
          <div class="reminder-meta">${fmtDate(rem.date)} • ${escapeHTML(rem.type || "Otro")}</div>
        </div>
      </div>
      <div class="reminder-actions">
        <span class="status-pill ${rem._statusKey}">${labelStatus(rem._statusKey)}</span>
        <button class="icon-btn btn-edit" title="Editar"><i class="fas fa-pen"></i></button>
        <button class="icon-btn btn-del" title="Eliminar"><i class="fas fa-trash"></i></button>
      </div>
    </li>
  `).join("");

  // acciones
  $$(".toggle-status", list).forEach(chk => {
    chk.addEventListener("change", (ev) => {
      const id = ev.currentTarget.closest(".reminder-item")?.dataset.id;
      updateStatus(id, ev.currentTarget.checked ? "completed" : "pending");
    });
  });

  $$(".btn-edit", list).forEach(btn => {
    btn.addEventListener("click", (ev) => {
      const id = ev.currentTarget.closest(".reminder-item")?.dataset.id;
      const rem = getReminders().find(r => r.id === id);
      if (rem) openEditModal(rem);
    });
  });

  $$(".btn-del", list).forEach(btn => {
    btn.addEventListener("click", (ev) => {
      const id = ev.currentTarget.closest(".reminder-item")?.dataset.id;
      if (confirm("¿Eliminar este recordatorio?")) removeReminder(id);
    });
  });
}

// ---------- CALENDARIO ----------
function initCalendar(){
  const el = document.getElementById("care-calendar");
  if (!el || !window.FullCalendar) return;

  calendar = new FullCalendar.Calendar(el, {
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    locale: 'es',
    selectable: true,
    dateClick: (info) => {
      const noon = new Date(info.dateStr + "T12:00:00"); // evita offset
      openNewModal(noon.toISOString());
    },
    eventClick: (info) => {
      const id = info.event.id;
      const rem = getReminders().find(r => r.id === id);
      if (rem) openEditModal(rem);
    },
    events: () => mapEventsForCalendar()
  });
  calendar.render();
}

function mapEventsForCalendar(){
  const now = new Date();
  return getReminders().map(r => {
    const overdue = (r.status !== "completed") && (new Date(r.date) < now);
    const key = r.status === "completed" ? "completed" : (overdue ? "overdue" : "pending");
    const classNames = key === "completed" ? ["event-completed"]
                    : key === "overdue"   ? ["event-overdue"]
                    : [];
    return { id: r.id, title: r.title, start: r.date, classNames };
  });
}

function syncCalendar(){
  if (!calendar) return;
  calendar.removeAllEvents();
  mapEventsForCalendar().forEach(evt => calendar.addEvent(evt));
}
