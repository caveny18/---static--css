// SIMULACIÓN DE DATOS (esto lo reemplazas luego con Firebase)
const participantes = [
  { nombre: "Juan Torres", turno: 1, estado: "pagado" },
  { nombre: "Luisa Méndez", turno: 2, estado: "pendiente" },
  { nombre: "Carlos Rojas", turno: 3, estado: "retrasado" },
  { nombre: "Ana Castillo", turno: 4, estado: "pendiente" }
];

const semanaActual = 2;
const totalSemanas = 8;

// Insertamos progreso
document.getElementById("semanaActual").textContent = semanaActual;
document.getElementById("totalSemanas").textContent = totalSemanas;

document.getElementById("barraProgreso").style.width =
  `${(semanaActual / totalSemanas) * 100}%`;

// Render de participantes
const contenedor = document.getElementById("participantesContainer");

participantes.forEach(p => {

  const card = document.createElement("div");
  card.classList.add("participante-card");

  const info = `
    <div class="participante-info">
      <strong>${p.nombre}</strong>
      <span>Turno #${p.turno}</span>
    </div>

    <span class="estado-tag ${p.estado}">
      ${p.estado}
    </span>
  `;

  card.innerHTML = info;
  contenedor.appendChild(card);
});
