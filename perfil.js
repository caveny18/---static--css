document.addEventListener("DOMContentLoaded", () => {
  const apodo = localStorage.getItem("apodo") || "@Usuario";
  const rubro = localStorage.getItem("rubro") || "No especificado";
  const experiencia = localStorage.getItem("experiencia") || "No indicada";
  const ubicacion = localStorage.getItem("ubicacion") || "Desconocida";
  const celular = localStorage.getItem("celular") || "No registrado";
  const email = localStorage.getItem("email") || "No registrado";

  document.getElementById("apodoDisplay").textContent = apodo;
  document.getElementById("rubroDisplay").textContent = rubro;
  document.getElementById("experienciaDisplay").textContent = experiencia;
  document.getElementById("ubicacionDisplay").textContent = ubicacion;
  document.getElementById("celularDisplay").textContent = celular;
  document.getElementById("emailDisplay").textContent = email;

  const btnVista = document.getElementById("btnVista");
  const perfilCard = document.getElementById("perfilCard");

  btnVista.addEventListener("click", () => {
    perfilCard.classList.toggle("public-view");

    if (perfilCard.classList.contains("public-view")) {
      btnVista.textContent = "🔒 Volver a mi vista";
      document.querySelector(".perfil-contacto").style.display = "none";
      document.querySelector(".verificado").style.display = "inline-block";
    } else {
      btnVista.textContent = "👁 Vista pública";
      document.querySelector(".perfil-contacto").style.display = "block";
    }
  });

  document.getElementById("fotoInput").addEventListener("change", e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      document.getElementById("fotoPerfil").src = ev.target.result;
      localStorage.setItem("fotoPerfil", ev.target.result);
    };
    reader.readAsDataURL(file);
  });

  const savedPhoto = localStorage.getItem("fotoPerfil");
  if (savedPhoto) document.getElementById("fotoPerfil").src = savedPhoto;
});
