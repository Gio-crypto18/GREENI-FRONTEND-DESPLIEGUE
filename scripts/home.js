document.addEventListener('DOMContentLoaded', () => {
    let currentUser = null;
    
    const sampleTasks = [
        { id: 1, icon: 'fa-tint', text: 'Regar Monstera Deliciosa', completed: true },
        { id: 2, icon: 'fa-leaf', text: 'Fertilizar Suculentas', completed: false },
        { id: 3, icon: 'fa-cut', text: 'Podar el Rosal', completed: true },
    ];

    const samplePlants = [
        { name: 'Monstera', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOXeWfFNwG6YUup06W69disC2MSGqUTPHVeA&s', status: 'healthy' },
        { name: 'Suculenta', image: 'https://veryplants.com/cdn/shop/articles/Exotic-succulent-plants..jpg?v=1706711966', status: 'healthy' },
        { name: 'Ficus', image: 'https://planterista.com/wp-content/uploads/2015/04/Ficus_benjamina_featured.webp', status: 'needs_attention' },
        { name: 'Hortensias', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6Y0LjLsZnQ5f28ub5c4webhsgEGWhNNR6nA&s', status: 'needs_water' },
    ];

    const initHomePage = () => {
        currentUser = getUserData();
        if (!currentUser) return;

        populateWelcomeMessage(currentUser);
        renderTasks();
        renderPlants();
        setupEventListeners();
    };

    const getUserData = () => {
        const userDataJSON = sessionStorage.getItem('currentUser');
        if (!userDataJSON) {
            window.location.href = 'login.html';
            return null;
        }
        return JSON.parse(userDataJSON);
    };

    const populateWelcomeMessage = (user) => {
        const welcomeMessage = document.getElementById('welcome-message');
        if (welcomeMessage) {
            const userName = user.name.split(' ')[0]; 
            welcomeMessage.textContent = `Buenos días, ${userName}`;
        }
    };

    const renderTasks = () => {
        const taskList = document.getElementById('task-list');
        if (!taskList) return;
        taskList.innerHTML = '';

        if (sampleTasks.length === 0) {
            taskList.innerHTML = '<p class="empty-state">¡No tienes tareas para hoy!</p>';
            return;
        }

        sampleTasks.forEach(task => {
            const taskItem = document.createElement('li');
            taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
            taskItem.innerHTML = `
                <i class="fas ${task.icon} task-icon"></i>
                <span class="task-info">${task.text}</span>
                <input type="checkbox" class="task-checkbox" data-task-id="${task.id}" ${task.completed ? 'checked' : ''}>
            `;
            taskList.appendChild(taskItem);
        });
    };

    const renderPlants = () => {
        const plantGallery = document.getElementById('plant-gallery');
        if (!plantGallery) return;
        plantGallery.innerHTML = ''; 

        samplePlants.forEach(plant => {
            const plantCard = document.createElement('div');
            plantCard.className = 'plant-card';
            plantCard.innerHTML = `
                <div class="plant-card-img" style="background-image: url('${plant.image}')">
                    <div class="plant-status"></div>
                </div>
                <span class="plant-card-name">${plant.name}</span>
            `;
            plantGallery.appendChild(plantCard);
        });
    };
    const setupEventListeners = () => {
        const taskList = document.getElementById('task-list');
        if (taskList) {
            taskList.addEventListener('change', (event) => {
                if (event.target.classList.contains('task-checkbox')) {
                    const listItem = event.target.closest('.task-item');
                    listItem.classList.toggle('completed');
                }
            });
        }
    };

    initHomePage();
});

// ====== HOME: lógica de botones Añadir planta / Diagnosticar ======
document.addEventListener('DOMContentLoaded', () => {
  const addBtn   = document.getElementById('btn-add-plant');
  const diagBtn  = document.getElementById('btn-diagnose');
  const fileInp  = document.getElementById('add-plant-file');

  // Helpers para estado de "mis plantas" (guardadas en localStorage)
  function getPlants() {
    try { return JSON.parse(localStorage.getItem('myPlants') || '[]'); }
    catch { return []; }
  }
  function setPlants(arr) {
    localStorage.setItem('myPlants', JSON.stringify(arr || []));
  }
  function hasPlants() { return getPlants().length > 0; }

  // Click en "Diagnosticar planta"
  if (diagBtn) {
    diagBtn.addEventListener('click', () => {
      if (!hasPlants()) {
        alert('Primero debe añadir una planta');
        return;
      }
      // Ya hay plantas -> navegar al diagnóstico
      window.location.href = 'diagnostic.html';
    });
  }
});

// ====== HOME COLUMNA DERECHA ======
const PLANTS_KEY = "myPlants";          
const REM_KEY    = "myReminders";       

const getPlants = () => JSON.parse(localStorage.getItem(PLANTS_KEY) || "[]");
const getRems = () => {
  const a = localStorage.getItem("myReminders");
  const b = localStorage.getItem("reminders");
  try { return JSON.parse(a || b || "[]"); } catch { return []; }
};

// ✅ Consejo del día
(function tipOfDay(){
  const tips = [
    "Riega temprano para evitar evaporación y hongos.",
    "Revisa el drenaje de tus macetas: evita encharcamientos.",
    "Gira tu planta semanalmente para un crecimiento uniforme.",
    "Limpia el polvo de las hojas para mejorar la fotosíntesis.",
    "Evita fertilizar en pleno verano si hace mucho calor.",
    "Usa agua a temperatura ambiente, no muy fría ni caliente."
  ];
  const el = document.getElementById("tip-of-day");
  if (!el) return;
  const today = new Date();
  const idx = (today.getFullYear() + today.getMonth() + today.getDate()) % tips.length;
  el.textContent = tips[idx];
})();

// ✅ Planta destacada (mapea distintos formatos de objeto)
// === PLANTAS: lectura tolerante y render destacado ===
(function featuredPlant(){
  const card   = document.getElementById("featured-plant-card");
  const img    = document.getElementById("fp-image");
  const nameEl = document.getElementById("fp-name");
  const descEl = document.getElementById("fp-desc");
  const linkEl = document.getElementById("fp-link");
  if (!card || !img || !nameEl || !descEl) return;

  // Lee con tolerancia a claves usadas en otras vistas
  function readPlants() {
    const cands = ["myPlants", "plants", "misPlantas"];
    for (const k of cands) {
      try {
        const raw = localStorage.getItem(k);
        if (raw) {
          const arr = JSON.parse(raw);
          if (Array.isArray(arr) && arr.length) return arr;
        }
      } catch {}
    }
    return [];
  }

  // Normaliza un objeto planta con distintos nombres de campos
  function norm(p){
    return {
      nombre: p.nombre ?? p.name ?? p.titulo ?? "Mi planta",
      descripcion: p.descripcion ?? p.description ?? p.desc ?? "",
      imagen: p.imagen ?? p.image ?? p.photo ?? p.imageUrl ?? p.imagenUrl ?? ""
    };
  }

  const plants = readPlants();

  if (!plants.length) {
    // estado vacío
    img.src = "https://placehold.co/800x300?text=A%C3%BAn+no+registras+plantas";
    nameEl.textContent = "Aún no registras plantas";
    descEl.textContent = "Añade una para verla aquí como destacada.";
    if (linkEl) { linkEl.textContent = "Añadir ahora"; linkEl.href = "plantas.html#add"; }
    card.style.display = "";
    return;
  }

  // usa la última añadida (o cambia aquí la lógica)
  const p = norm(plants[plants.length - 1]);
  img.src = p.imagen || "https://placehold.co/800x300?text=Planta";
  nameEl.textContent = p.nombre;
  descEl.textContent = p.descripcion || "—";
  if (linkEl) { linkEl.textContent = "Ver todas mis plantas"; linkEl.href = "plantas.html"; }

  card.style.display = "";
})();



// ✅ Estado del jardín
(function gardenStats(){
  const ul = document.getElementById("garden-stats");
  if (!ul) return;
  const plants = getPlants();

  const total = plants.length;
  const necesitanRiego = Math.max(0, Math.floor(total / 3));
  const enTratamiento  = Math.max(0, Math.floor(total / 5));

  ul.innerHTML = `
    <li><strong>Total de plantas:</strong> ${total}</li>
    <li><strong>Necesitan riego:</strong> ${necesitanRiego}</li>
    <li><strong>Bajo tratamiento:</strong> ${enTratamiento}</li>
  `;
})();

// ✅ Próximos recordatorios
(function upcomingReminders(){
  const ul = document.getElementById("upcoming-reminders");
  if (!ul) return;

  let items = JSON.parse(localStorage.getItem("myReminders") || "[]");

  // Si no hay ninguno, no muestra nada
  if (!items.length) {
    ul.innerHTML = `<li class="muted">Sin recordatorios registrados</li>`;
    return;
  }

  // Mostrar los 3 más próximos
  items = items
    .filter(r => r.date)
    .sort((a,b)=> new Date(a.date) - new Date(b.date))
    .slice(0,3);

  const fmt = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString("es-PE", { day:"2-digit", month:"short" }) +
           " " + d.toLocaleTimeString("es-PE", { hour:"2-digit", minute:"2-digit" });
  };

  ul.innerHTML = items.map(r => `
    <li><strong>${r.title}</strong> — ${fmt(r.date)}</li>
  `).join("");
})();



