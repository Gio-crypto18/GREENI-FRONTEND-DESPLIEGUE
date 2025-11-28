/* ========= CONFIG =========
   AJUSTA SOLO ESTAS CONSTANTES SI SABES EL ENDPOINT EXACTO
*/
const CANDIDATE_ENDPOINTS = [
  'http://localhost:8080/apidiagnostico/predict',
  'http://localhost:8080/apidiagnostico/identify',
  'http://localhost:8080/apidiagnostico',
  // agrega aquí el exacto de tu servicio si lo conoces
];
const CANDIDATE_FILE_FIELDS = ['file','image','photo','picture']; // probamos varios

// Usa proxy DEV temporal para evitar CORS SIN tocar el back (desactívalo en producción)
const USE_DEV_PROXY = false; 
const DEV_PROXY = 'https://thingproxy.freeboard.io/fetch/'; // o 'https://cors.isomorphic-git.org/'

const FETCH_TIMEOUT_MS = 20000;

/* ========= ELEMENTOS ========= */
const $ = (s,sc=document)=>sc.querySelector(s);
const els = {
  file: $('#file-input'),
  dz: $('#drop-zone'),
  previewWrap: $('#preview-wrap'),
  previewImg: $('#preview-img'),
  btnChange: $('#btn-change'),
  btnAnalyze: $('#btn-analyze'),
  error: $('#diag-error'),
  loading: $('#diag-loading'),
  results: $('#results'),
  empty: $('#empty-results'),
  mainId: $('#main-identification'),
  taxonomy: $('#taxonomy-block'),
  desc: $('#description-block'),
  imgs: $('#images-block'),
  others: $('#others-block'),
  treat: $('#treatments-block'),
};

const show = el => el && (el.hidden = false);
const hide = el => el && (el.hidden = true);
const setText = (el, t) => { if(el){ el.innerHTML=''; el.textContent = t; } };
const setHTML = (el, h) => { if(el) el.innerHTML = h; };
const escapeHtml = s => String(s ?? '').replace(/[&<>"']/g, m=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;' }[m]));
const escapeAttr = s => String(s ?? '').replace(/"/g,'&quot;');
const pct = n => (n==null ? '—' : `${(Number(n)*100).toFixed(1)}%`);

let selectedFile = null;

/* ========= INIT ========= */
window.addEventListener('DOMContentLoaded', () => {
  if (window.renderSidebar) renderSidebar('Diagnóstico');
  setupDnD();
  els.btnChange.addEventListener('click', () => els.file.click());
  els.btnAnalyze.addEventListener('click', onAnalyze);
  els.file.addEventListener('change', onFileSelected);
});

/* ========= DnD & FILE ========= */
function setupDnD(){
  ['dragenter','dragover'].forEach(ev =>
    els.dz.addEventListener(ev, e => { e.preventDefault(); e.stopPropagation(); els.dz.classList.add('dragging'); })
  );
  ['dragleave','drop'].forEach(ev =>
    els.dz.addEventListener(ev, e => { e.preventDefault(); e.stopPropagation(); els.dz.classList.remove('dragging'); })
  );
  els.dz.addEventListener('drop', e => {
    const f = e.dataTransfer?.files?.[0];
    if (f) loadPreview(f);
  });
  els.dz.addEventListener('click', ()=> els.file.click());
}
function onFileSelected(e){
  const f = e.target.files?.[0];
  if (f) loadPreview(f);
}
function loadPreview(file){
  selectedFile = file;
  hide(els.error);
  const r = new FileReader();
  r.onload = () => { els.previewImg.src = r.result; show(els.previewWrap); els.btnAnalyze.disabled = false; };
  r.onerror = () => showError('No se pudo leer la imagen.');
  r.readAsDataURL(file);
}

/* ========= ANALYZE (con endpoints/fields de respaldo) ========= */
async function onAnalyze(){
  if (!selectedFile) return showError('Selecciona una imagen');

  hide(els.error); show(els.loading);
  els.btnAnalyze.disabled = true;

  try {
    const json = await tryAllEndpoints(selectedFile);
    const model = normalizeResponse(json);
    renderResults(model);
  } catch(err){
    showError(err?.message || 'Error al diagnosticar: Failed to fetch');
  } finally {
    hide(els.loading);
    els.btnAnalyze.disabled = false;
  }
}

async function tryAllEndpoints(file){
  let lastErr = null;
  for (const url of CANDIDATE_ENDPOINTS) {
    for (const field of CANDIDATE_FILE_FIELDS) {
      try {
        const fd = new FormData();
        fd.append(field, file);

        const controller = new AbortController();
        const to = setTimeout(()=>controller.abort(), FETCH_TIMEOUT_MS);
        const target = USE_DEV_PROXY ? (DEV_PROXY + url) : url;

        const res = await fetch(target, { method:'POST', body:fd, signal:controller.signal });
        clearTimeout(to);

        // CORS puede disparar TypeError (fallo de red) => cae al catch
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        return json;
      } catch(e){
        lastErr = e;
        // intenta siguiente combinación…
      }
    }
  }
  throw new Error(`No se pudo contactar con la API (${lastErr?.message || 'Failed to fetch'}). Revisa CORS/endpoint/puerto.`);
}

/* ========= NORMALIZACIÓN ========= */
function normalizeResponse(data){
  // Tu formato apidiagnostico (según lo que pegaste)
  if (data?.identification) {
    const main = {
      type: 'identification',
      name: data.identification.name,
      scientificName: data.identification.scientificName,
      confidence: data.identification.confidence,
      description: data.description || '',
      taxonomy: data.taxonomy || null,
      images: data.media?.images?.map(i => ({url:i.url})) || [],
      suggestions: (data.otherSuggestions||[]).map(s => ({
        name:s.name, scientificName:s.scientificName, confidence:s.confidence
      }))
    };
    const treatments = suggestTreatmentsFromLabels([main.name, ...(main.suggestions||[]).map(s=>s.name)]);
    return {...main, treatments};
  }

  // { predictions: [ {label, confidence}, ... ] }
  if (Array.isArray(data?.predictions)) {
    const top = data.predictions[0] || {label:'Diagnóstico', confidence:0};
    const suggestions = data.predictions.slice(1,6).map(p => ({
      name: p.label, scientificName: '', confidence: pct(p.confidence)
    }));
    const treatments = suggestTreatmentsFromLabels([top.label, ...suggestions.map(s=>s.name)]);
    return {
      type:'diagnosis',
      name: top.label,
      scientificName: '',
      confidence: pct(top.confidence),
      description: '',
      taxonomy: null,
      images: [],
      suggestions,
      treatments
    };
  }

  // Fallback
  return {
    type:'raw',
    name:'Resultado',
    scientificName:'',
    confidence:'—',
    description:'',
    taxonomy:null,
    images:[],
    suggestions:[],
    treatments:genericCare(), // al menos algo útil
    raw: JSON.stringify(data,null,2)
  };
}

/* ========= RENDER ========= */
function renderResults(model){
  hide(els.empty); show(els.results);

  const sci = model.scientificName ? `
    <div><span class="sci-line">Nombre científico:</span> <span class="sci-text">${escapeHtml(model.scientificName)}</span></div>
  ` : '';

  setHTML(els.mainId, `
    <div class="fade-in">
      <span class="confidence">Confianza: ${escapeHtml(model.confidence || '—')}</span>
      <h4>${escapeHtml(model.name)}</h4>
      ${sci}
    </div>
  `);

  if (model.taxonomy) {
    const {family, genus, order, class:clazz} = model.taxonomy;
    setHTML(els.taxonomy, `
      <h5>🧬 Taxonomía</h5>
      <ul class="kv">
        ${family? `<li><strong>Familia:</strong> ${escapeHtml(family)}</li>`:''}
        ${genus?  `<li><strong>Género:</strong> ${escapeHtml(genus)}</li>`:''}
        ${order?  `<li><strong>Orden:</strong> ${escapeHtml(order)}</li>`:''}
        ${clazz?  `<li><strong>Clase:</strong> ${escapeHtml(clazz)}</li>`:''}
      </ul>
    `);
    show(els.taxonomy);
  } else hide(els.taxonomy);

  if (model.description) {
    setHTML(els.desc, `<h5>📖 Descripción</h5><p>${escapeHtml(model.description)}</p>`);
    show(els.desc);
  } else hide(els.desc);

  if (model.images?.length){
    setHTML(els.imgs, `
      <h5>🖼️ Imágenes similares</h5>
      <div class="gallery">
        ${model.images.map(i=>`<img src="${escapeAttr(i.url)}" alt="${escapeAttr(model.name)}"/>`).join('')}
      </div>
    `);
    show(els.imgs);
  } else hide(els.imgs);

  if (model.suggestions?.length){
    setHTML(els.others, `
      <h5>🔍 Otras posibles identificaciones</h5>
      <div>
        ${model.suggestions.map(s=>`
          <span class="badge">${escapeHtml(s.name)} ${s.confidence?`· ${escapeHtml(s.confidence)}`:''}</span>
        `).join('')}
      </div>
    `);
    show(els.others);
  } else hide(els.others);

  // TRATAMIENTOS: siempre mostramos algo (explícito o genérico)
  const treatments = (model.treatments && model.treatments.length) ? model.treatments : genericCare();
  setHTML(els.treat, `
    <h5>🧪 Tratamiento recomendado</h5>
    <ul class="treat-list">
      ${treatments.map(t=>`<li class="treat-item">${escapeHtml(t)}</li>`).join('')}
    </ul>
  `);
  show(els.treat);
}

/* ========= Sugerencias de tratamiento (ES ampliado) ========= */
function suggestTreatmentsFromLabels(labels=[]){
  const text = (labels.join(' ') || '').toLowerCase();

  const rules = [
    // Hongos
    { k:['oidio','mildiu','mildiú','mancha','roya','antracnosis','botrytis','moho','alternaria','leaf spot','blight'],
      t:[
        'Retira hojas afectadas y desinfecta tijeras.',
        'Mejora ventilación y evita mojar hojas al regar.',
        'Aplica fungicida (triazoles o cúpricos) cada 7–10 días.'
      ]},
    // Pudriciones
    { k:['pudrición','root rot','phytophthora','fusarium','pudricion','pudrición radicular'],
      t:[
        'Reduce el riego y verifica drenaje inmediatamente.',
        'Cambia a sustrato aireado; poda raíces blandas/negras.',
        'Fungicida sistémico para raíces (fosetil-Al) según etiqueta.'
      ]},
    // Plagas
    { k:['cochinilla','pulgón','trips','araña roja','ácaro','mosca blanca','whitefly','aphid','mite','thrip'],
      t:[
        'Limpia hojas con agua jabonosa/alcohol puntual.',
        'Jabón potásico o neem 2–3 veces/semana.',
        'Si persiste, insecticida específico (abamectina/imidacloprid).'
      ]},
    // Deficiencias
    { k:['clorosis','deficiencia','deficiency','iron','nitrogen','magnesium'],
      t:[
        'Ajusta pH del sustrato a 6.0–6.8.',
        'Fertiliza con NPK balanceado + microelementos (quelatos).',
        'Revisa calendario de abonado acorde a la especie.'
      ]},
    // Orquídeas
    { k:['orquídea','orchid','phalaenopsis','cattleya','dendrobium'],
      t:[
        'Riego por inmersión 1–2/semana; excelente drenaje.',
        'Sustrato de corteza/arcilla; evitar encharcamientos.',
        'Luz indirecta intensa y humedad 50–70%.'
      ]},
  ];

  const out = [];
  rules.forEach(r => { if (r.k.some(key => text.includes(key))) out.push(...r.t); });
  return [...new Set(out)];
}

function genericCare(){
  return [
    'Aísla la planta si sospechas enfermedad.',
    'Riego moderado y drenaje correcto; evita encharcamientos.',
    'Luz indirecta brillante; limpia hojas y revisa plagas.',
  ];
}

/* ========= ERRORES ========= */
function showError(msg){
  setText(els.error, msg);
  show(els.error);
}
