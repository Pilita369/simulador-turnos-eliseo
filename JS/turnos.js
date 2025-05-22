document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formTurno");
  const frecuenciaInput = document.getElementById("frecuencia");
  const dinamico = document.getElementById("turnos-dinamicos");
  const tablaTurnos = document.getElementById("tabla-turnos");

  let turnos = JSON.parse(localStorage.getItem("turnos")) || [];

  const dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
  const horas = ["07:00", "08:00", "09:00", "10:00"];

  // === Generador de campos dinámicos reutilizable ===
  function generarCampos(frecuencia) {
    dinamico.innerHTML = "";

    for (let i = 1; i <= frecuencia; i++) {
      const div = document.createElement("div");
      div.classList.add("grupo-turno");

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

    if (!nombre || (frecuencia !== 2 && frecuencia !== 3)) {
      alert("Completá tus datos correctamente.");
      return;
    }

    // Eliminamos primero los turnos del mismo nombre
    turnos = turnos.filter(t => t.nombre !== nombre);

    const nuevos = [];
    for (let i = 1; i <= frecuencia; i++) {
      const dia = form[`dia${i}`].value;
      const hora = form[`hora${i}`].value;

      const ocupados = turnos.filter(t => t.dia === dia && t.hora === hora);
      if (ocupados.length >= 2) {
        alert(`El turno ${dia} ${hora} está lleno.`);
        return;
      }

      nuevos.push({ nombre, dia, hora });
    }

    turnos = [...turnos, ...nuevos];
    localStorage.setItem("turnos", JSON.stringify(turnos));
    form.reset();
    dinamico.innerHTML = "";
    generarTabla();
  });

  function generarTabla() {
    tablaTurnos.innerHTML = "";
    const tabla = document.createElement("table");
    const thead = document.createElement("thead");
    const header = document.createElement("tr");
    header.innerHTML = "<th>Hora / Día</th>" + dias.map(d => `<th>${d}</th>`).join("");
    thead.appendChild(header);

    const tbody = document.createElement("tbody");
    horas.forEach(h => {
      const fila = document.createElement("tr");
      fila.innerHTML = `<th>${h}</th>`;
      dias.forEach(d => {
        const celda = document.createElement("td");
        const inscritos = turnos.filter(t => t.dia === d && t.hora === h);

        let contenido = `<strong>${inscritos.length}/2</strong>`;

        if (inscritos.length > 0) {
          contenido += inscritos.map(t => {
            return `
              <div>
                🧍 ${t.nombre}
                <button onclick="eliminarTurno('${t.dia}', '${t.hora}', '${t.nombre}')" style="color:black;font-weight:bold;background:none;border:none;cursor:pointer;">✖</button>
              </div>
            `;
          }).join("");
        } else {
          contenido += "<div style='opacity:0.4;'>Disponible</div>";
        }

        celda.innerHTML = contenido;
        celda.className = inscritos.length >= 2 ? "ocupado" : "disponible";
        fila.appendChild(celda);
      });
      tbody.appendChild(fila);
    });

    tabla.appendChild(thead);
    tabla.appendChild(tbody);
    tablaTurnos.appendChild(tabla);
  }

  window.eliminarTurno = (dia, hora, nombre) => {
    turnos = turnos.filter(t => !(t.dia === dia && t.hora === hora && t.nombre === nombre));
    localStorage.setItem("turnos", JSON.stringify(turnos));
    generarTabla();
  };

  const btnReiniciar = document.getElementById("reiniciarTurnos");
  if (btnReiniciar) {
    btnReiniciar.addEventListener("click", () => {
      if (confirm("¿Estás seguro de que querés borrar todos los turnos?")) {
        localStorage.removeItem("turnos");
        turnos = [];
        generarTabla();
        alert("Turnero reiniciado.");
      }
    });
  }

  generarTabla();
});
