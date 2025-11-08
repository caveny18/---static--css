const steps = [
  { question: "¿Cuál es tu nombre?", type: "text", key: "nombre", placeholder: "Escribe tu nombre" },
  { question: "¿Cuál es tu apellido?", type: "text", key: "apellido", placeholder: "Escribe tu apellido" },
  { question: "¿Cómo te gustaría que te vean los demás?", type: "text", key: "apodo", placeholder: "Ej: Doña Mary, El Chato..." },
  { question: "¿De qué país eres?", type: "select", key: "pais", options: ["Perú", "Argentina", "México", "Chile"] },
  { question: "¿En qué provincia te encuentras?", type: "datalist", key: "provincia", dynamic: "provincia" },
  { question: "¿Y tu distrito o zona?", type: "datalist", key: "distrito", dynamic: "distrito" },
  { question: "¿Cuál es tu tipo de negocio?", type: "text", key: "rubro", placeholder: "Ej: Bodega, Barbería, Panadería..." },
  { question: "¿Nombre del negocio? (opcional)", type: "text", key: "nombreNegocio", placeholder: "Escribe el nombre o deja vacío" },
  { question: "¿Cuántos años de experiencia tienes?", type: "text", key: "experiencia", placeholder: "Ej: 5 años" },
  { question: "¿Cuál es tu número de celular?", type: "tel", key: "celular", placeholder: "Ej: +51 999 999 999" },
  { question: "¿Correo electrónico? (opcional)", type: "email", key: "email", placeholder: "correo@ejemplo.com" },
];

const provinciasPeru = [
  "Lima", "Arequipa", "Cusco", "Piura", "Trujillo", "Ica", "Tacna", "Puno",
  "Junín", "Ayacucho", "Lambayeque", "La Libertad", "Ancash", "Loreto", "Ucayali"
];

const distritosPorProvincia = {
  "Lima": ["San Isidro", "Miraflores", "Comas", "Surco", "Callao", "Los Olivos", "San Borja", "La Molina", "Chorrillos"],
  "Arequipa": ["Cercado", "Cayma", "Yanahuara", "Alto Selva Alegre"],
  "Cusco": ["Santiago", "Wanchaq", "San Sebastián", "San Jerónimo"],
  "Piura": ["Castilla", "Veintiséis de Octubre", "Piura Centro"],
  "Trujillo": ["La Esperanza", "Florencia de Mora", "Víctor Larco"],
  // puedes agregar más si deseas
};

let currentStep = 0;
let userData = {};

const stepContainer = document.getElementById("step-container");
const btnNext = document.getElementById("btnNext");
const btnBack = document.getElementById("btnBack");

function showStep() {
  const step = steps[currentStep];
  let inputHTML = "";

  if (step.type === "select") {
    inputHTML = `
      <select id="inputField" required>
        <option value="">Selecciona una opción</option>
        ${step.options.map(opt => `<option value="${opt}">${opt}</option>`).join("")}
      </select>`;
  } 
  else if (step.type === "datalist") {
    inputHTML = `
      <input list="dataList" id="inputField" placeholder="Escribe o selecciona..." required />
      <datalist id="dataList"></datalist>`;
  } 
  else {
    inputHTML = `<input type="${step.type}" id="inputField" placeholder="${step.placeholder || ''}" required />`;
  }

  stepContainer.innerHTML = `<h2>${step.question}</h2>${inputHTML}`;
  btnBack.style.visibility = currentStep === 0 ? "hidden" : "visible";

  // Cargar opciones dinámicas
  if (step.dynamic === "provincia") {
    const pais = userData.pais;
    const dataList = document.getElementById("dataList");
    if (pais === "Perú") provinciasPeru.forEach(p => {
      const opt = document.createElement("option");
      opt.value = p; dataList.appendChild(opt);
    });
  }

  if (step.dynamic === "distrito") {
    const provincia = userData.provincia;
    const dataList = document.getElementById("dataList");
    if (provincia && distritosPorProvincia[provincia]) {
      distritosPorProvincia[provincia].forEach(d => {
        const opt = document.createElement("option");
        opt.value = d; dataList.appendChild(opt);
      });
    }
  }
}

btnNext.addEventListener("click", () => {
  const input = document.getElementById("inputField");
  if (!input.value.trim()) return alert("Por favor completa este paso");
  userData[steps[currentStep].key] = input.value.trim();

  currentStep++;
  if (currentStep < steps.length) showStep();
  else {
    localStorage.setItem("usuarioKuyana", JSON.stringify(userData));
    stepContainer.innerHTML = `
      <h2>✅ ¡Registro completado con éxito!</h2>
      <p>Bienvenido a Kuyana, ${userData.apodo || "usuario"}.</p>`;
    btnNext.textContent = "Ir a mi perfil";
    btnBack.style.display = "none";
    btnNext.onclick = () => window.location.href = "perfil.html";
  }
});

btnBack.addEventListener("click", () => {
  if (currentStep > 0) currentStep--;
  showStep();
});

document.getElementById("goHome").onclick = () => window.location.href = "index.html";

showStep();
