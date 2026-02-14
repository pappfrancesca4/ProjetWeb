import { defineListeners, inputStates } from "./ecouteurs.js";
import { loadAssets } from "./assetLoader.js";
import Starfield from "./fx/Starfield.js";

import MenuState from "./states/MenuState.js";
import StoryState from "./states/StoryState.js";
import PlayState from "./states/PlayState.js";
import GameOverState from "./states/GameOverState.js";
import HighScoresState from "./states/HighScoresState.js";

let canvas, ctx, game;

class Game {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.w = canvas.width;
    this.h = canvas.height;

    this.input = inputStates;
    this.starfield = new Starfield(this.w, this.h, 160);

    this.states = {
      MENU: new MenuState(this),
      STORY: new StoryState(this),
      PLAY: new PlayState(this),
      GAMEOVER: new GameOverState(this),
      HIGHSCORES: new HighScoresState(this),
    };

    this.stateName = "MENU";
    this.last = performance.now();
  }

  setState(name, param) {
    this.stateName = name;
    const st = this.states[this.stateName];
    if (st && typeof st.enter === "function") st.enter(param);
  }

  loop = (t) => {
    const dt = (t - this.last) / 1000;
    this.last = t;

    const st = this.states[this.stateName];
    st.update(dt);
    st.draw(this.ctx);

    this.input.mouseClicked = false;

    requestAnimationFrame(this.loop);
  };
}

async function init() {
  canvas = document.querySelector("#monCanvas");
  ctx = canvas.getContext("2d");

  defineListeners(canvas);

  await loadAssets();

  game = new Game(canvas, ctx);

  window.game = game;

  window.goto = (levelNum) => {
    const idx = levelNum - 1;
    if (idx >= 0) {
      console.log(`🚀 Téléportation vers le niveau ${levelNum}...`);
      game.setState("PLAY", idx);
    } else {
      console.warn("Usage : goto(1) pour le niveau 1, goto(2) pour le 2, etc.");
    }
  };

  window.god = (forcedState) => {
    const playState = game.states.PLAY;
    if (!playState.player) {
      console.warn(
        "⚠️ Lance une partie d'abord ! (Le joueur n'existe pas encore)"
      );
      return;
    }

    if (forcedState !== undefined) {
      playState.player.godMode = forcedState;
    } else {
      playState.player.godMode = !playState.player.godMode;
    }

    if (playState.player.godMode) {
      console.log(
        "%c 🛡️ GOD MODE ACTIVATED ",
        "background: #FFD700; color: #000; font-weight: bold; padding: 4px;"
      );
    } else {
      console.log(
        "%c ❌ GOD MODE DEACTIVATED ",
        "background: #333; color: #FFF; padding: 4px;"
      );
    }
  };

  console.log(
    "%c 🔧 CHEATS : Tape goto(x) pour changer de niveau ou god() pour l'invincibilité.",
    "background: #222; color: #bada55; font-size:12px;"
  );

  requestAnimationFrame(game.loop);
}

window.onload = init;
