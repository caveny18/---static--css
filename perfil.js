/* ======================
   CONFIGURACIÓN INICIAL
====================== */

const DEFAULT_IMG = "/mnt/data/48a1129e-8540-44c7-9fe4-fceeb053284c.png";

const KEY_PROFILE = "usuarioKuyana";
const KEY_FOTO = "fotoPerfil";
const KEY_GALERIA = "galeriaNegocio";

/* ======================
   SELECTORES AGRUPADOS
====================== */

const $ = (id) => document.getElementById(id);

const fotoPerfil = $("fotoPerfil");
const fotoInput = $("fotoInput");
const inputMultiples = $("inputMultiples");
const galleryEl = $("gallery");
const editInput = $("editInput");

const modal = $("modalEditar");
const btnEditar = $("btnEditar");
const btnGuardar = $("btnGuardar");
const btnCancelar = $("btnCancelar");

/* Display */
const display = {
  apodo: $("apodoDisplay"),
  rubro: $("rubroDisplay"),
  experiencia: $("experienciaDisplay"),
  ubicacion: $("ubicacionDisplay"),
  celular: $("celularDisplay"),
  correo: $("emailDisplay"),
  barraNivel: $("barraNivel"),

  // nuevos campos
  yape: $("yapeDisplay"),
  plin: $("plinDisplay"),
  participacion: $("participacionDisplay")
};

/* Modal */
const inputs = {
  apodo: $("editApodo"),
  rubro: $("editRubro"),
  experiencia: $("editExperiencia"),
  ubicacion: $("editUbicacion"),
  celular: $("editCelular"),
  correo: $("editCorreo")
};

/* Galería */
let gallery = [];
let editIndex = null;

/* ======================
   UTILIDADES
====================== */

function getPerfil() {
  return (
    JSON.parse(localStorage.getItem(KEY_PROFILE)) ||
    JSON.parse(localStorage.getItem("perfilUsuario")) ||
    {}
  );
}

function savePerfil(data) {
  localStorage.setItem(KEY_PROFILE, JSON.stringify(data));
}

function setText(el, val, fallback = "—") {
  el.textContent = val && val.trim() ? val : fallback;
}

/* ======================
   INICIO
====================== */

document.addEventListener("DOMContentLoaded", () => {
  loadProfile();
  loadFoto();
  loadGaleria();

  fotoInput.addEventListener("change", cambiarFotoPerfil);
  inputMultiples.addEventListener("change", subirMultiples);
  galleryEl.addEventListener("click", clickGaleria);

  btnEditar?.addEventListener("click", abrirModal);
  btnCancelar?.addEventListener("click", () => modal.classList.remove("activo"));
  btnGuardar?.addEventListener("click", guardarCambios);
  editInput?.addEventListener("change", reemplazarFoto);
});

/* ======================
   PERFIL
====================== */

function loadProfile() {
  const p = getPerfil();

  setText(display.apodo, p.apodo || p.nombreCompleto || "@Usuario");
  setText(display.rubro, p.rubro || p.nombreNegocio);
  setText(display.experiencia, p.experiencia);
  setText(display.ubicacion, p.ubicacion || p.provincia);
  setText(display.celular, p.celular || p.telefono);
  setText(display.correo, p.email || p.correo);

  // nuevos
  setText(display.yape, p.yape === "si" ? "Sí acepta" : "No");
  setText(display.plin, p.plin === "si" ? "Sí acepta" : "No");
  setText(display.participacion, p.participo === "si" ? "Sí, antes" : "Primera vez");

  // barra nivel
  const nivel = Number(p.nivel) || 3;
  const pct = Math.min(100, Math.max(0, (nivel / 5) * 100));
  display.barraNivel.style.width = pct + "%";

  // llenar modal
  Object.keys(inputs).forEach((k) => (inputs[k].value = p[k] || ""));
}

/* ======================
   FOTO PERFIL
====================== */

function loadFoto() {
  const stored = localStorage.getItem(KEY_FOTO);
  fotoPerfil.src = stored || DEFAULT_IMG;
}

function cambiarFotoPerfil(e) {
  const f = e.target.files?.[0];
  if (!f) return;

  const reader = new FileReader();
  reader.onload = () => {
    fotoPerfil.src = reader.result;
    localStorage.setItem(KEY_FOTO, reader.result);
  };
  reader.readAsDataURL(f);
}

/* ======================
   GALERÍA
====================== */

function loadGaleria() {
  gallery = JSON.parse(localStorage.getItem(KEY_GALERIA)) || [];
  renderGaleria();
}

function renderGaleria() {
  galleryEl.innerHTML = "";

  if (!gallery.length) {
    galleryEl.innerHTML = `<p style="padding:10px; color:#6b8b94">Aún no hay fotos. Sube hasta 4.</p>`;
    return;
  }

  gallery.forEach((src, i) => {
    galleryEl.innerHTML += `
      <div class="gallery-item" data-i="${i}">
        <img src="${src}">
        <button class="delete-btn" data-del="${i}">&times;</button>
        <button class="edit-btn" data-edit="${i}">✎</button>
      </div>
    `;
  });
}

function subirMultiples(e) {
  const files = Array.from(e.target.files || []);
  const espacio = 4 - gallery.length;
  if (espacio <= 0) {
    alert("Máximo 4 fotos.");
    return;
  }

  files.slice(0, espacio).forEach((file) => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      gallery.push(ev.target.result);
      localStorage.setItem(KEY_GALERIA, JSON.stringify(gallery));
      renderGaleria();
    };
    reader.readAsDataURL(file);
  });

  e.target.value = "";
}

function clickGaleria(e) {
  if (e.target.dataset.del !== undefined) {
    eliminarFoto(Number(e.target.dataset.del));
  }
  if (e.target.dataset.edit !== undefined) {
    editIndex = Number(e.target.dataset.edit);
    editInput.click();
  }
}

function eliminarFoto(i) {
  if (!confirm("¿Eliminar esta foto?")) return;
  gallery.splice(i, 1);
  localStorage.setItem(KEY_GALERIA, JSON.stringify(gallery));
  renderGaleria();
}

function reemplazarFoto(e) {
  const file = e.target.files?.[0];
  if (!file || editIndex === null) return;

  const reader = new FileReader();
  reader.onload = () => {
    gallery[editIndex] = reader.result;
    localStorage.setItem(KEY_GALERIA, JSON.stringify(gallery));
    renderGaleria();
    editIndex = null;
  };
  reader.readAsDataURL(file);

  e.target.value = "";
}

/* ======================
   MODAL
====================== */

function abrirModal() {
  const p = getPerfil();
  Object.keys(inputs).forEach((k) => (inputs[k].value = p[k] || ""));
  modal.classList.add("activo");
}

function guardarCambios() {
  const p = getPerfil();

  Object.keys(inputs).forEach((k) => {
    p[k] = inputs[k].value.trim();
  });

  savePerfil(p);
  loadProfile();
  modal.classList.remove("activo");
}

/* ======================
   DEBUG OPCIONAL
====================== */

window._kuyana = {
  reset: () => {
    localStorage.clear();
    location.reload();
  }
};
