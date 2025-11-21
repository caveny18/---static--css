/* ===========================
    MATCH.JS — Kuyana
    Lógica de Match y Búsqueda de Junta
=========================== */

/* -----------------------------
    CONSTANTES Y VARIABLES
----------------------------- */
const deck = document.getElementById("deck");
const btnYes = document.getElementById("btnYes");
const btnNo = document.getElementById("btnNo");
const btnInfo = document.getElementById("btnInfo");
const startJuntaBtn = document.getElementById("startJuntaBtn");
const juntaSelect = document.getElementById("juntaSelect");
const rubroSelect = document.getElementById("rubroSelect");
const montoSelect = document.getElementById("montoSelect");

const juntaSetup = document.getElementById("juntaSetup"); // Añadido
const matchControls = document.getElementById("matchControls");
const matchProgress = document.getElementById("matchProgress");
const juntaCompleteBanner = document.getElementById("juntaCompleteBanner"); // Añadido

const matchModal = document.getElementById("matchModal");
const requestModal = document.getElementById("requestModal");
const juntaCompleteModal = document.getElementById("juntaCompleteModal");
const closeModal = document.getElementById("closeModal");
const closeRequestModal = document.getElementById("closeRequestModal");
const closeJuntaModal = document.getElementById("closeJuntaModal");
const goChat = document.getElementById("goChat");

const JUNTA_TARGET_KEY = "kuyana_junta_target";
const MATCH_KEY = "kuyana_match_list";

let currentProfiles = []; // Para almacenar los perfiles filtrados y disponibles

/* -----------------------------
    DATOS SIMULADOS DE PERSONAS
----------------------------- */
const profiles = [
    {
        name: "María López",
        rubro: "Bodega",
        monto: "300-800",
        img: "https://randomuser.me/api/portraits/women/65.jpg",
        desc: "Emprendedora de Lima con 2 años en su negocio de abarrotes."
    },
    {
        name: "Juan Pérez",
        rubro: "Ferretería",
        monto: "800-1500",
        img: "https://randomuser.me/api/portraits/men/42.jpg",
        desc: "Administrador de ferretería en Piura, busca expandir inventario."
    },
    {
        name: "Rosa Delgado",
        rubro: "Panadería",
        monto: "300-800",
        img: "https://randomuser.me/api/portraits/women/30.jpg",
        desc: "Panadera artesanal en Arequipa. Le encanta el trabajo en equipo."
    },
    {
        name: "Carlos Medina",
        rubro: "Taller",
        monto: "1500+",
        img: "https://randomuser.me/api/portraits/men/33.jpg",
        desc: "Propietario de taller mecánico en Trujillo. Busca socios para invertir."
    },
    {
        name: "Lucía Vargas",
        rubro: "Comercio",
        monto: "800-1500",
        img: "https://randomuser.me/api/portraits/women/40.jpg",
        desc: "Dueña de tienda de ropa en Cusco, desea digitalizar su negocio."
    },
    {
        name: "José Ramírez",
        rubro: "Artesanía",
        monto: "300-800",
        img: "https://randomuser.me/api/portraits/men/50.jpg",
        desc: "Artesano ayacuchano, especialista en cerámica y tallado."
    },
    {
        name: "Ana Flores",
        rubro: "Barbería",
        monto: "800-1500",
        img: "https://randomuser.me/api/portraits/women/8.jpg",
        desc: "Barbera en Huancayo. Busca capital para modernizar su equipo."
    },
    {
        name: "Pedro Salas",
        rubro: "Comercio",
        monto: "1500+",
        img: "https://randomuser.me/api/portraits/men/70.jpg",
        desc: "Distribuidor de productos en el norte. Gran experiencia en ventas."
    }
];

/* -----------------------------
    FUNCIONES DE UTILIDAD
----------------------------- */

/**
 * Muestra tarjetas en el deck basadas en una lista de perfiles.
 * @param {Array<Object>} filtered - Lista de perfiles a mostrar.
 */
function loadProfiles(filtered) {
    deck.innerHTML = "";
    // Invertimos el orden para que la última tarjeta esté arriba (mayor z-index)
    filtered.slice().reverse().forEach((p, i) => { 
        const card = document.createElement("div");
        card.className = "card";
        // Asignamos el z-index para apilarlas correctamente
        card.style.zIndex = filtered.length - i; 
        card.innerHTML = `
            <img src="${p.img}" alt="${p.name}">
            <div class="card-content">
                <h3>${p.name}</h3>
                <p><b>Rubro:</b> ${p.rubro}</p>
                <p><b>Monto:</b> S/ ${p.monto.replace('+', ' o más')}</p>
                <p>${p.desc}</p>
            </div>
        `;
        deck.appendChild(card);
    });
}

/**
 * Aplica los filtros seleccionados a la lista de perfiles.
 * @returns {Array<Object>} Lista de perfiles que cumplen los filtros.
 */
function getFilteredProfiles() {
    const rubro = rubroSelect.value;
    const monto = montoSelect.value;

    return profiles.filter(p => {
        const rubroMatch = rubro === "all" || p.rubro === rubro;
        const montoMatch = monto === "all" || p.monto === monto;
        return rubroMatch && montoMatch;
    });
}

/**
 * Muestra un elemento modal.
 * @param {HTMLElement} modal
 */
function showModal(modal) {
    modal.classList.remove("hidden");
}

/**
 * Oculta un elemento modal.
 * @param {HTMLElement} modal
 */
function hideModal(modal) {
    modal.classList.add("hidden");
}

/* -----------------------------
    FLUJO DE BÚSQUEDA DE JUNTA
----------------------------- */

startJuntaBtn.addEventListener("click", () => {
    const size = parseInt(juntaSelect.value);
    
    // 1. Validación
    if (!size || size === 0) {
        alert("¡Alto! Por favor, selecciona el tamaño de tu junta.");
        return;
    }

    // 2. Inicialización
    localStorage.setItem(JUNTA_TARGET_KEY, size);
    localStorage.setItem(MATCH_KEY, JSON.stringify([]));

    // 3. Cargar perfiles
    currentProfiles = getFilteredProfiles();
    loadProfiles(currentProfiles);

    if (currentProfiles.length === 0) {
        alert("No se encontraron perfiles con los filtros seleccionados. Intenta con 'Todos'.");
        return;
    }

    // 4. Actualizar UI
    matchProgress.textContent = `Buscando miembros para tu junta de ${size} personas... (0/${size} miembros)`;
    juntaSetup.classList.add("hidden");
    matchControls.classList.remove("hidden");
    juntaCompleteBanner.classList.add("hidden");
});

/* -----------------------------
    BOTONES DE CONTROL (SWIPE)
----------------------------- */

/**
 * Procesa la acción de deslizar (swipe) una tarjeta.
 * @param {boolean} isYes - true para "Sí" (Match), false para "No" (Descartar).
 */
function processSwipe(isYes) {
    const cards = document.querySelectorAll(".card");
    if (cards.length === 0) return;

    // La última tarjeta en el DOM es la que está visible
    const top = cards[cards.length - 1]; 
    const profileElement = currentProfiles.pop(); // Sacamos el perfil de la lista disponible

    // 1. Animación y remoción de la tarjeta
    top.style.transform = isYes 
        ? "translateX(100%) rotate(15deg)" 
        : "translateX(-100%) rotate(-15deg)";
    top.style.opacity = 0;
    setTimeout(() => top.remove(), 300);

    // 2. Lógica de Match
    if (isYes) {
        const name = profileElement.name;
        addToMatch(name);
        // Mostrar modal de match inmediatamente
        document.getElementById("matchText").textContent = `¡Has hecho match con ${name}! 🎉`;
        showModal(matchModal); 
    }
    
    // 3. Lógica de Fin de Búsqueda (si no hay más tarjetas)
    if (cards.length === 1) { // Si solo queda la tarjeta que se está eliminando
        // Simplemente actualizamos el progreso, si no ha completado la junta.
        const matches = JSON.parse(localStorage.getItem(MATCH_KEY)) || [];
        const juntaTarget = parseInt(localStorage.getItem(JUNTA_TARGET_KEY));
        
        if (matches.length < juntaTarget) {
             matchProgress.textContent = `No hay más perfiles con tus filtros. Intenta con filtros más amplios o espera nuevos usuarios.`;
        }
    }
}

btnYes.addEventListener("click", () => processSwipe(true));
btnNo.addEventListener("click", () => processSwipe(false));

btnInfo.addEventListener("click", () => {
    alert("Kuyana Match: Desliza el corazón (❤️) para enviar una solicitud de match, o la 'X' (❌) para pasar al siguiente.");
});

/* -----------------------------
    MATCHES Y JUNTA COMPLETA
----------------------------- */

/**
 * Añade un nombre a la lista de matches y verifica si la junta está completa.
 * @param {string} name - Nombre del perfil con el que se hizo match.
 */
function addToMatch(name) {
    const juntaTarget = parseInt(localStorage.getItem(JUNTA_TARGET_KEY));
    let matches = JSON.parse(localStorage.getItem(MATCH_KEY)) || [];

    // Solo se cuenta como match si no está ya en la lista (evita duplicados si se llama 2 veces)
    if (!matches.includes(name)) {
        matches.push(name);
        localStorage.setItem(MATCH_KEY, JSON.stringify(matches));
    }
    
    // Actualizar barra de progreso
    matchProgress.textContent = `Buscando miembros para tu junta de ${juntaTarget} personas... (${matches.length}/${juntaTarget} miembros)`;


    if (matches.length === juntaTarget) {
        // La junta está completa
        juntaCompleteBanner.classList.remove("hidden");
        // Asegúrate de que el modal de match esté cerrado antes de mostrar el de junta completa
        setTimeout(() => {
            hideModal(matchModal); 
            showModal(juntaCompleteModal);
        }, 300); 
    }
}

/* -----------------------------
    MANEJO DE MODALES
----------------------------- */

closeModal.onclick = () => hideModal(matchModal);
closeRequestModal.onclick = () => hideModal(requestModal);

goChat.onclick = () => {
    hideModal(matchModal);
    // Simulación: Al hacer click en "Ir al Chat", se confirma la solicitud enviada.
    document.getElementById("requestText").textContent = `Hemos enviado una solicitud de contacto a la persona. Cuando acepte, te avisaremos.`;
    showModal(requestModal);
};

closeJuntaModal.onclick = () => {
    hideModal(juntaCompleteModal);

    // Limpiar datos de la junta
    localStorage.removeItem(JUNTA_TARGET_KEY);
    localStorage.removeItem(MATCH_KEY);

    // Reiniciar la vista
    location.reload();
};