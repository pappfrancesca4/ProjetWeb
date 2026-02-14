export const inputStates = {
  mousePos: { x: 0, y: 0 },
  mouseClicked: false,
  mousedown: false,
  left: false,
  right: false,
  up: false,
  down: false,
  space: false,
  h: false,
  // Ajout de la file d'attente pour la saisie de texte
  keyQueue: [],
};

export function defineListeners(canvas) {
  window.addEventListener("keydown", (e) => {
    // Capture pour la saisie de texte (Lettres, Chiffres, Backspace, Enter)
    if (e.key.length === 1 || e.key === "Backspace" || e.key === "Enter") {
      inputStates.keyQueue.push(e.key);
    }

    switch (e.key) {
      case "ArrowLeft":
        inputStates.left = true;
        break;
      case "ArrowRight":
        inputStates.right = true;
        break;
      case "ArrowUp":
        inputStates.up = true;
        break;
      case "ArrowDown":
        inputStates.down = true;
        break;
      case " ":
        inputStates.space = true;
        break;
      case "h":
      case "H":
        inputStates.h = true;
        break;
    }
  });

  window.addEventListener("keyup", (e) => {
    switch (e.key) {
      case "ArrowLeft":
        inputStates.left = false;
        break;
      case "ArrowRight":
        inputStates.right = false;
        break;
      case "ArrowUp":
        inputStates.up = false;
        break;
      case "ArrowDown":
        inputStates.down = false;
        break;
      case " ":
        inputStates.space = false;
        break;
      case "h":
      case "H":
        inputStates.h = false;
        break;
    }
  });

  canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    inputStates.mousePos = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  });

  canvas.addEventListener("mousedown", () => {
    inputStates.mousedown = true;
    inputStates.mouseClicked = true;
  });

  canvas.addEventListener("mouseup", () => {
    inputStates.mousedown = false;
  });
}
