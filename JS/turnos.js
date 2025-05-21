const form = document.getElementById("formTurno");
const frecuenciaInput = document.getElementById("frecuencia");
const dinamico = document.getElementById("turnos-dinamicos");
const tablaTurnos = document.getElementById("tabla-turnos");

let turnos = JSON.parse(localStorage.getItem("turnos")) || [];

const dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
const horas = ["07:00", "08:00", "09:00", "10:00"];

function generarCampos(frecuencia) {
  dinamico.innerHTML = ""; // Limpiamos primero

  for (let i = 1; i <= frecuencia; i++) {
    const div = document.createElement("div");
    div.classList.add("grupo-turno");

    // Día
    const labelDia = document.createElement("label");
    labelDia.textContent = `Día ${i}:`;
    const selectDia = document.createElement("select");
    selectDia.name = `dia${i}`;
    dias.forEach(d => {
      const opt = document.createElement("option");
      opt.value = d;
      opt.textContent = d;
      selectDia.appendChild(opt);
    });

    // Hora
    const labelHora = document.createElement("label");
    labelHora.textContent = `Hora ${i}:`;
    const selectHora = document.createElement("select");
    selectHora.name = `hora${i}`;
    horas.forEach(h => {
      const opt = document.createElement("option");
      opt.value = h;
      opt.textContent = `${h} - ${parseInt(h) + 1}:00`;
      selectHora.appendChild(opt);
    });

    // Agregar al form
    div.appendChild(labelDia);
    div.appendChild(selectDia);
    div.appendChild(labelHora);
    div.appendChild(selectHora);
    dinamico.appendChild(div);
  }
}

frecuenciaInput.addEventListener("change", () => {
  const cantidad = parseInt(frecuenciaInput.value);
  if (cantidad === 2 || cantidad === 3) {
    generarCampos(cantidad);
  }
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const nombre = document.getElementById("nombre").value.trim();
  const frecuencia = parseInt(frecuenciaInput.value);

  if (!nombre || !frecuencia) return alert("Completa todos los campos");

  let nuevosTurnos = [];

  for (let i = 1; i <= frecuencia; i++) {
    const dia = form[`dia${i}`].value;
    const hora = form[`hora${i}`].value;

    const turnoRepetido = turnos.filter(t => t.dia === dia && t.hora === hora);

    if (turnoRepetido.length >= 2) {
      alert(`El turno del ${dia} a las ${hora} ya está completo.`);
      return;
    }

    nuevosTurnos.push({ nombre, dia, hora });
  }

  // Guardar y actualizar
  turnos = [...turnos, ...nuevosTurnos];
  localStorage.setItem("turnos", JSON.stringify(turnos));
  form.reset();
  dinamico.innerHTML = "";
  generarTabla();
});

// Genera la tabla visual de turnos ocupados
function generarTabla() {
  const tabla = document.createElement("table");
  const thead = document.createElement("thead");
  const tbody = document.createElement("tbody");

  // Encabezado
  const header = document.createElement("tr");
  header.innerHTML = "<th>Hora / Día</th>";
  dias.forEach(d => {
    const th = document.createElement("th");
    th.textContent = d;
    header.appendChild(th);
  });
  thead.appendChild(header);

  // Cuerpo
  horas.forEach(hora => {
    const fila = document.createElement("tr");
    const thHora = document.createElement("th");
    thHora.textContent = hora;
    fila.appendChild(thHora);

    dias.forEach(dia => {
      const td = document.createElement("td");

      const ocupados = turnos.filter(t => t.dia === dia && t.hora === hora);
      td.textContent = ocupados.length > 0 ? `${ocupados.length} 🧍` : "";
      td.className = ocupados.length >= 2 ? "ocupado" : "disponible";

      fila.appendChild(td);
    });

    tbody.appendChild(fila);
  });

  tabla.appendChild(thead);
  tabla.appendChild(tbody);

  tablaTurnos.innerHTML = ""; // Limpiar tabla anterior
  tablaTurnos.appendChild(tabla);
}

// Mostrar tabla al cargar
generarTabla();
