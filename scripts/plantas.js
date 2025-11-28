(() => {
  const USERS_KEY = 'greeni_users';
  const CURRENT_KEY = 'greeni_current_user_id';
  const $ = (s, r = document) => r.querySelector(s);

  // --- sesión / storage
  const getCurrentUser = () => {
    const id = localStorage.getItem(CURRENT_KEY);
    if (!id) return null;
    const list = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    return list.find(u => u.userId === id) || null;
  };
  const keyForPlants = (uid) => `greeni_plants_${uid}`;
  const loadPlants  = (uid) => JSON.parse(localStorage.getItem(keyForPlants(uid)) || '[]');
  const savePlants  = (uid, arr) => localStorage.setItem(keyForPlants(uid), JSON.stringify(arr));

  // --- estado
  let user = null;
  let plants = [];
  let editingId = null;
  let uploadedDataUrl = '';

  // --- refs UI
  const drop = $('#drop-area');
  const pick = $('#file-input');
  const imgPreview = $('#plant-preview');
  const nameInput = $('#plant-name');
  const descInput = $('#plant-desc');
  const saveBtn   = $('#save-plant');
  const clearBtn  = $('#clear-plant');
  const listWrap  = $('#plants-list');
  const emptyBox  = $('#empty-state');
  const speciesSection = $('#species-section');
  const speciesList    = $('#species-list');

  // ============================================================
  // 1) Heurística por TEXTO (rápida)
  // ============================================================
  const SPECIES_MAP = [
    { rx: /\bmonstera\b/i,                 sci: 'Monstera deliciosa' },
    { rx: /\borqu[ií]dea|orchid/i,        sci: 'Orchidaceae (Orquídea)' },
    { rx: /\bficus\b/i,                    sci: 'Ficus elastica' },
    { rx: /\bsansevieria|lengua\s+de\s+suegra/i, sci: 'Sansevieria trifasciata' },
    { rx: /\baloe\b/i,                     sci: 'Aloe vera' },
    { rx: /\brosa|rose\b/i,                sci: 'Rosa spp.' },
    { rx: /\bgirasol|sunflower\b/i,        sci: 'Helianthus (Girasol)' },
    { rx: /\bcactus|cact[áa]ceas/i,        sci: 'Cactaceae (Cactus)' },
  ];
  function speciesFromText(txt) {
    if (!txt) return null;
    for (const r of SPECIES_MAP) if (r.rx.test(txt)) return r.sci;
    return null;
  }

  // ============================================================
  // 2) “Visión” con CANVAS (simulador de IA por color dominante)
  // ============================================================
  async function speciesFromImageColor(dataUrl) {
    if (!dataUrl) return null;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    const loaded = new Promise(res => { img.onload = res; img.onerror = () => res(); });
    img.src = dataUrl;
    await loaded;

    const w = 80, h = 80;
    const canvas = document.createElement('canvas');
    canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, w, h);
    const { data } = ctx.getImageData(0, 0, w, h);

    // promedio HSV
    let sumH = 0, sumS = 0, sumV = 0, n = 0;
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i] / 255, g = data[i+1]/255, b = data[i+2]/255;
      const max = Math.max(r,g,b), min = Math.min(r,g,b);
      const v = max;
      const d = max - min;
      const s = max === 0 ? 0 : d / max;
      let hval = 0;
      if (d !== 0) {
        if (max === r) hval = ((g-b)/d) % 6;
        else if (max === g) hval = (b-r)/d + 2;
        else hval = (r-g)/d + 4;
        hval *= 60; if (hval < 0) hval += 360;
      }
      sumH += hval; sumS += s; sumV += v; n++;
    }
    const H = sumH / n, S = sumS / n, V = sumV / n;

    // reglas (ajústalas a tu gusto)
    if (S > 0.45 && V > 0.35) {
      if (H >= 345 || H < 20)  return 'Rosa spp.';                      // rojo
      if (H >= 20  && H < 55)  return 'Helianthus (Girasol)';          // amarillo/naranja
      if (H >= 280 && H < 335) return 'Orchidaceae (Orquídea)';        // magenta/violeta
    }
    if (H >= 60 && H < 180 && S < 0.35 && V < 0.6) return 'Cactaceae (Cactus)'; // verde apagado
    if (H >= 60 && H < 180 && S >= 0.35)          return 'Monstera deliciosa';   // verde vivo

    return null;
  }

  // ============================================================
  // 3) Detección combinada (texto + color)
  // ============================================================
  async function simulateDetectSpecies({ imageDataUrl, name, desc }) {
    // prioriza texto si coincide
    const byText = speciesFromText(`${name || ''} ${desc || ''}`);
    if (byText) return byText;

    // intenta por color
    const byColor = await speciesFromImageColor(imageDataUrl);
    return byColor || 'Especie no identificada (por ahora)';
  }

  // ============================================================
  // Uploader
  // ============================================================
  function bindUploader() {
    if (!drop || !pick) return;
    ['dragenter','dragover'].forEach(evt => {
      drop.addEventListener(evt, e => { e.preventDefault(); drop.classList.add('dragging'); });
    });
    ['dragleave','drop'].forEach(evt => {
      drop.addEventListener(evt, e => { e.preventDefault(); drop.classList.remove('dragging'); });
    });
    drop.addEventListener('drop', e => {
      const f = e.dataTransfer?.files?.[0]; if (f) readImage(f);
    });
    drop.addEventListener('click', () => pick.click());
    pick.addEventListener('change', () => {
      const f = pick.files?.[0]; if (f) readImage(f);
    });
  }
  function readImage(file) {
    const ok = ['image/png','image/jpeg','image/webp'];
    if (!ok.includes(file.type)) return toast('Solo PNG/JPG/WEBP','err');
    if (file.size > 5*1024*1024)  return toast('Máx 5MB','err');
    const rd = new FileReader();
    rd.onload = () => {
      uploadedDataUrl = rd.result;
      imgPreview.src = uploadedDataUrl;
      imgPreview.style.display = 'block';
    };
    rd.readAsDataURL(file);
  }

  // ============================================================
  // Render tarjetas + especies
  // ============================================================
  function renderSpecies() {
    speciesList.innerHTML = '';
    if (!plants.length) { speciesSection.style.display = 'none'; return; }
    speciesSection.style.display = 'block';

    const bag = new Map();
    plants.forEach(p => {
      const label = p.speciesGuess || 'Especie no identificada (por ahora)';
      bag.set(label, (bag.get(label) || 0) + 1);
    });

    [...bag.entries()].forEach(([name, count]) => {
      const chip = document.createElement('div');
      chip.className = 'species-chip';
      chip.innerHTML = `<i class="fa-solid fa-leaf"></i> ${name} <span class="qty">×${count}</span>`;
      speciesList.append(chip);
    });
  }

  function renderList() {
    listWrap.innerHTML = '';
    if (!plants.length) {
      emptyBox.style.display = 'block';
      renderSpecies();
      return;
    }
    emptyBox.style.display = 'none';

    plants.forEach(p => {
      const card = document.createElement('div');
      card.className = 'plant-card';

      const thumb = document.createElement('div');
      thumb.className = 'plant-thumb';
      if (p.image) thumb.style.backgroundImage = `url('${p.image}')`;

      const body = document.createElement('div');
      body.className = 'plant-body';

      const title = document.createElement('h4');
      title.className = 'plant-title';
      title.textContent = p.name || '(Sin nombre)';

      const pName = document.createElement('p');
      pName.className = 'plant-desc';
      pName.innerHTML = `<strong>Nombre:</strong> ${p.name || '—'}`;

      const pDesc = document.createElement('p');
      pDesc.className = 'plant-desc';
      pDesc.innerHTML = `<strong>Descripción:</strong> ${p.desc || '—'}`;

      body.append(title, pName, pDesc);

      const actions = document.createElement('div');
      actions.className = 'actions';

      const bEdit = document.createElement('button');
      bEdit.className = 'btn xsm';  // tu CSS ya lo deja verde
      bEdit.textContent = 'Editar';
      bEdit.addEventListener('click', () => startEdit(p.id));

      const bDel = document.createElement('button');
      bDel.className = 'btn xsm danger';
      bDel.textContent = 'Eliminar';
      bDel.addEventListener('click', () => removePlant(p.id));

      actions.append(bEdit, bDel);
      card.append(thumb, body, actions);
      listWrap.append(card);
    });

    renderSpecies();
  }

  // ============================================================
  // CRUD
  // ============================================================
  async function savePlant(e) {
    e.preventDefault();
    const name = nameInput.value.trim();
    const desc = descInput.value.trim();
    if (!uploadedDataUrl && !editingId) return toast('Sube una foto','err');
    if (!name) return toast('Escribe un nombre','err');

    // si estamos editando, usamos la imagen nueva si existe
    let imgToUse = uploadedDataUrl;
    if (editingId && !imgToUse) {
      const old = plants.find(p => p.id === editingId);
      imgToUse = old?.image || '';
    }

    // “detección” simulada
    const speciesGuess = await simulateDetectSpecies({
      imageDataUrl: imgToUse,
      name, desc
    });

    if (editingId) {
      plants = plants.map(p =>
        p.id === editingId ? { ...p, name, desc, image: imgToUse, speciesGuess } : p
      );
      toast('Planta actualizada','ok');
    } else {
      const id = crypto.randomUUID ? crypto.randomUUID() : String(Date.now());
      plants.unshift({ id, name, desc, image: imgToUse, speciesGuess, createdAt: Date.now() });
      toast('Planta guardada','ok');
    }
    savePlants(user.userId, plants);
    clearForm();
    renderList();
  }

  function startEdit(id) {
    const p = plants.find(x => x.id === id);
    if (!p) return;
    editingId = id;
    uploadedDataUrl = ''; // espera nueva imagen (si la hay)
    imgPreview.style.display = 'none';
    imgPreview.src = '';
    nameInput.value = p.name || '';
    descInput.value = p.desc || '';
    saveBtn.textContent = 'Actualizar';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function removePlant(id) {
    if (!confirm('¿Eliminar esta planta?')) return;
    plants = plants.filter(p => p.id !== id);
    savePlants(user.userId, plants);
    renderList();
  }

  function clearForm() {
    editingId = null;
    uploadedDataUrl = '';
    imgPreview.style.display = 'none';
    imgPreview.src = '';
    nameInput.value = '';
    descInput.value = '';
    pick.value = '';
    saveBtn.textContent = 'Guardar';
  }

  function toast(msg, kind='ok') {
    const el = $('#plants-feedback');
    if (!el) return alert(msg);
    el.textContent = msg;
    el.className = `feedback ${kind}`;
    setTimeout(() => { el.textContent=''; el.className='feedback'; }, 2000);
  }

  // ============================================================
  // init
  // ============================================================
  document.addEventListener('DOMContentLoaded', () => {
    user = getCurrentUser();
    if (!user) { window.location.href = 'login.html'; return; }
    plants = loadPlants(user.userId);

    bindUploader();
    $('#plant-form')?.addEventListener('submit', savePlant);
    clearBtn?.addEventListener('click', (e)=>{ e.preventDefault(); clearForm(); });

    renderList();
  });
})();
