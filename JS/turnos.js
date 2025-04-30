// turnos.js
// -------------------------------
// Simulador de turnos para Eliseo | Entrega 1

// 1. Variables y arrays
const turnosDisponibles = ["08:00", "10:00", "11:00", "13:00"];
const turnosReservados = ["09:00", "12:00"];
const listaDeTurnos = []; // turnos reservados en esta sesión

// 2. Función para mostrar turnos disponibles
function mostrarTurnos() {
  console.log("✅ TURNOS DISPONIBLES:");
  turnosDisponibles.forEach((hora, i) => {
    console.log(`${i + 1}. ${hora}`);
  });
}

// 3. Función para reservar turno
function reservarTurno() {
  mostrarTurnos();
  let seleccion = prompt("🕒 Ingresá la hora exacta que querés reservar:");
  if (turnosDisponibles.includes(seleccion)) {
    const nombre = prompt("👤 Ingresá tu nombre:");
    const actividad = prompt("🏐 Actividad (entrenamiento / voley / funcional):");

    const confirmar = confirm(`¿Confirmás reservar el turno ${seleccion} para ${actividad}?`);
    if (confirmar) {
      turnosDisponibles.splice(turnosDisponibles.indexOf(seleccion), 1);
      turnosReservados.push(seleccion);
      listaDeTurnos.push({ nombre, hora: seleccion, actividad });

      alert(`✅ Turno confirmado para ${nombre} a las ${seleccion} (${actividad}).`);
    } else {
      alert("❌ Turno no reservado.");
    }
  } else {
    alert("⛔ La hora ingresada no está disponible.");
  }
}

// 4. Función para mostrar todos los turnos confirmados
function mostrarReservas() {
  console.log("📋 LISTA DE TURNOS CONFIRMADOS:");
  if (listaDeTurnos.length === 0) {
    console.log("No hay turnos aún.");
  } else {
    listaDeTurnos.forEach((turno, i) => {
      console.log(`${i + 1}. ${turno.nombre} - ${turno.hora} - ${turno.actividad}`);
    });
  }
}

// 5. Función principal (menú)
function iniciarSimulador() {
  alert("Bienvenido al Simulador de Turnos de Eliseo.");

  let continuar = true;

  while (continuar) {
    const opcion = prompt(
      "¿Qué acción querés realizar?\n1. Ver turnos disponibles\n2. Reservar un turno\n3. Ver reservas\n4. Salir"
    );

    switch (opcion) {
      case "1":
        mostrarTurnos();
        break;
      case "2":
        reservarTurno();
        break;
      case "3":
        mostrarReservas();
        break;
      case "4":
        continuar = false;
        alert("Gracias por usar el simulador. ¡Hasta pronto!");
        break;
      default:
        alert("Opción no válida.");
    }
  }
}

// NO se ejecuta automáticamente para evitar bloqueos ⚠️

