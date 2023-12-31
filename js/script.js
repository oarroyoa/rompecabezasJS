/**
 * @typedef {Object} PiezaRompecabezas
 * @property {HTMLDivElement} pieza - La pieza del rompecabezas.
 * @property {string} id - El identificador de la pieza.
 * @property {boolean} draggable - Indica si la pieza es arrastrable.
 */

/**
 * Maneja el inicio del arrastre de una pieza en el tablero.
 * @param {DragEvent} evento - El evento de arrastre.
 */
function manejarInicioArrastre(evento) {
  evento.dataTransfer.setData("text/plain", evento.target.style.backgroundImage);
  evento.dataTransfer.setData("text/id", evento.target.id);
  evento.target.classList.add("siendo-arrastrado");
}

/**
* Maneja el evento de arrastre sobre una pieza en el tablero.
* @param {DragEvent} evento - El evento de arrastre.
*/
function manejarArrastreSobre(evento) {
  evento.preventDefault();
}

/**
* Maneja el evento de soltar una pieza en el tablero.
* @param {DragEvent} evento - El evento de soltar.
*/
function manejarSoltar(evento) {
  evento.preventDefault();
  const data = evento.dataTransfer.getData("text/plain");
  const id = evento.dataTransfer.getData("text/id");
  const objetivo = evento.target;

  if (objetivo.classList.contains("pieza-rompecabezas") && !objetivo.style.backgroundImage) {
      const piezaArrastrada = document.querySelector(".siendo-arrastrado");

      // Limpiar la posición anterior
      const posicionAnterior = document.getElementById(id);
      if (posicionAnterior) {
          posicionAnterior.style.backgroundImage = "";
      }

      // Restaurar en la nueva posición
      objetivo.style.backgroundImage = data;

      // Ocultar el div del aside correspondiente
      const asidePiezaId = `pieza${parseInt(data.match(/\d+/)[0])}`;
      const asidePieza = document.getElementById(asidePiezaId);
      if (asidePieza) {
          asidePieza.classList.add("oculto");
      }

      // Verificar si la pieza está en la posición correcta
      const posicionCorrecta = verificarPosicionCorrecta(objetivo.id, data);
      if (posicionCorrecta) {
          objetivo.draggable = false; // Deshabilitar el arrastre
          objetivo.removeEventListener("dblclick", manejarDobleClic); // Deshabilitar el doble clic para rotación
      }

      // Verificar si todas las piezas están en la posición correcta
      verificarTodasLasPiezasCorrectas();
  }

  // Limpiar la clase "siendo-arrastrado" incluso si la pieza no se soltó en una posición válida
  const piezaArrastrada = document.querySelector(".siendo-arrastrado");
  if (piezaArrastrada) {
      piezaArrastrada.classList.remove("siendo-arrastrado");
  }
}

/**
* Maneja el inicio del arrastre de una pieza en el aside.
* @param {DragEvent} evento - El evento de arrastre.
*/
function manejarInicioArrastreAside(evento) {
  evento.dataTransfer.setData("text/plain", evento.target.style.backgroundImage);
  evento.dataTransfer.setData("text/id", evento.target.id);
}

/**
* Maneja el evento de arrastre sobre una pieza en el aside.
* @param {DragEvent} evento - El evento de arrastre.
*/
function manejarArrastreSobreAside(evento) {
  evento.preventDefault();
}

/**
* Maneja el evento de soltar una pieza en el aside.
* @param {DragEvent} evento - El evento de soltar.
*/
function manejarSoltarAside(evento) {
  evento.preventDefault();
  const data = evento.dataTransfer.getData("text/plain");
  const id = evento.dataTransfer.getData("text/id");
  const objetivo = evento.target;

  if (objetivo.classList.contains("contenedor-pieza") && !objetivo.style.backgroundImage) {
      objetivo.style.backgroundImage = data;
      objetivo.classList.add("oculto");

      // Limpiar la posición anterior en el aside
      const anteriorPosicionAside = document.getElementById(id);
      if (anteriorPosicionAside) {
          anteriorPosicionAside.style.backgroundImage = "";
          anteriorPosicionAside.classList.remove("oculto");
      }
  }
}

/**
* Maneja el doble clic en una pieza para rotarla.
* @param {MouseEvent} evento - El evento de doble clic.
*/
function manejarDobleClic(evento) {
  const valorRotacion = parseFloat(evento.target.style.transform.replace("rotate(", "").replace("deg)", "")) || 0;
  evento.target.style.transform = `rotate(${valorRotacion + 90}deg)`;
}

/**
* Verifica si la pieza está en la posición correcta.
* @param {string} idPosicion - El identificador de la posición.
* @param {string} datosPieza - La información de la pieza.
* @returns {boolean} - True si está en la posición correcta, false en caso contrario.
*/
function verificarPosicionCorrecta(idPosicion, datosPieza) {
  const idPosicionCorrecta = `div${parseInt(datosPieza.match(/\d+/)[0])}`;
  return idPosicion === idPosicionCorrecta;
}

/**
* Verifica si todas las piezas están en la posición correcta.
*/
function verificarTodasLasPiezasCorrectas() {
  const todasLasPiezas = document.querySelectorAll(".pieza-rompecabezas");
  const todasCorrectas = Array.from(todasLasPiezas).every((pieza) => !pieza.draggable);
  if (todasCorrectas) {
      alert("¡Felicidades! Has completado el rompecabezas.");
  }
}

/**
* Inicializa el rompecabezas cuando el DOM está completamente cargado.
*/
document.addEventListener("DOMContentLoaded", function () {
  const contenedorRompecabezas = document.getElementById("contenedor-rompecabezas");
  const contenedorPiezas = document.getElementById("contenedor-piezas");

  // Crear piezas del rompecabezas en el tablero
  for (let i = 1; i <= 16; i++) {
      const pieza = document.createElement("div");
      pieza.className = "pieza-rompecabezas";
      pieza.draggable = true;
      pieza.id = `div${i}`; // Asignar identificadores específicos a los divs del tablero

      // Configurar eventos de arrastrar y soltar en el tablero
      pieza.addEventListener("dragstart", manejarInicioArrastre);
      pieza.addEventListener("dragover", manejarArrastreSobre);
      pieza.addEventListener("drop", manejarSoltar);

      // Configurar eventos de doble clic para rotación
      pieza.addEventListener("dblclick", manejarDobleClic);

      contenedorRompecabezas.appendChild(pieza);
  }

  // Crear piezas adicionales en el contenedor de piezas
  for (let i = 1; i <= 16; i++) {
      const pieza = document.createElement("div");
      pieza.className = "contenedor-pieza";
      pieza.draggable = true;
      pieza.id = `pieza${i}`; // Asignar identificadores específicos a los divs del aside

      // Configurar el fondo de la pieza con la imagen correspondiente
      pieza.style.backgroundImage = `url('img/pieza${i}.png')`;

      // Configurar eventos de arrastrar y soltar en el aside
      pieza.addEventListener("dragstart", manejarInicioArrastreAside);
      pieza.addEventListener("dragover", manejarArrastreSobreAside);
      pieza.addEventListener("drop", manejarSoltarAside);

      // Configurar eventos de doble clic para rotación
      pieza.addEventListener("dblclick", manejarDobleClic);

      contenedorPiezas.appendChild(pieza);
  }
});
