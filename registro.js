const provincias = [
  "Lima","Arequipa","Cusco","Piura","Trujillo","Ica","Tacna","Puno",
  "Junín","Ayacucho","Lambayeque","La Libertad","Ancash","Loreto","Ucayali"
];

const lista = document.getElementById("listaProvincias");
provincias.forEach(p => {
  const option = document.createElement("option");
  option.value = p;
  lista.appendChild(option);
});

document.getElementById("registroForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const usuario = {
    nombreCompleto: nombreCompleto.value.trim(),
    email: email.value.trim(),
    password: password.value.trim(),
    celular: celular.value.trim(),
    pais: pais.value,
    provincia: provincia.value.trim(),
    rol: rol.value.trim(),
    nombreNegocio: nombreNegocio.value.trim(),
    dni: dni.value.trim()
  };

  if (usuario.password.length < 8) {
    alert("La contraseña debe tener mínimo 8 caracteres.");
    return;
  }

  localStorage.setItem("usuarioKuyana", JSON.stringify(usuario));

  alert("Registro completado con éxito 🎉");
  window.location.href = "perfil.html";
});

document.getElementById("registroForm").addEventListener("submit", function (e) {
  e.preventDefault(); // evita que recargue la página
  
  // Aquí podrías validar o guardar datos (si tuvieras backend)

  // Redirigir al perfil
  window.location.href = "perfil.html";
});
