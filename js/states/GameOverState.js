import { drawBackground, THEME, neonStroke } from "../theme.js";
import { saveHighScore, isHighScore } from "../storage/highscores.js";

export default class GameOverState {
  constructor(game) {
    this.game = game;
    this.score = 0;
    this.timer = 0;

    // Variables pour l'input du HighScore
    this.isNewRecord = false;
    this.playerName = "";
    this.inputActive = false;
  }

  enter(finalScore) {
    this.score = finalScore;
    this.timer = 0;
    this.playerName = "";

    // On vide la file d'attente des touches pour éviter les inputs fantômes
    this.game.input.keyQueue = [];

    if (isHighScore(this.score)) {
      this.isNewRecord = true;
      this.inputActive = true;
    } else {
      this.isNewRecord = false;
      this.inputActive = false;
    }
  }

  update(dt) {
    this.timer += dt;
    this.game.starfield.update(dt);

    if (this.inputActive) {
      // Gestion de la saisie du nom
      const queue = this.game.input.keyQueue;
      while (queue.length > 0) {
        const key = queue.shift();

        if (key === "Enter") {
          if (this.playerName.length > 0) {
            saveHighScore(this.playerName, this.score);
            this.inputActive = false;
            this.game.setState("HIGHSCORES");
          }
        } else if (key === "Backspace") {
          this.playerName = this.playerName.slice(0, -1);
        } else if (key.length === 1 && this.playerName.length < 3) {
          // On accepte seulement les lettres et chiffres
          if (/[a-zA-Z0-9]/.test(key)) {
            this.playerName += key.toUpperCase();
          }
        }
      }
    } else {
      // Comportement standard Game Over
      if (this.timer > 1.0 && this.game.input.space) {
        this.game.setState("HIGHSCORES");
      }
    }
  }

  draw(ctx) {
    drawBackground(ctx, this.game.w, this.game.h);
    this.game.starfield.draw(ctx);

    ctx.save();
    ctx.textAlign = "center";

    // Titre
    ctx.shadowBlur = 20;
    const titleColor = this.isNewRecord ? "#ffd700" : "#ff0000"; // Or si record, Rouge sinon
    ctx.shadowColor = titleColor;
    ctx.fillStyle = titleColor;
    ctx.font = "bold 60px Arial";
    ctx.fillText(
      this.isNewRecord ? "NEW HIGH SCORE!" : "GAME OVER",
      this.game.w / 2,
      this.game.h / 2 - 80
    );

    // Score
    ctx.shadowBlur = 10;
    ctx.shadowColor = THEME.text;
    ctx.fillStyle = THEME.text;
    ctx.font = "30px Arial";
    ctx.fillText(
      `SCORE FINAL : ${this.score}`,
      this.game.w / 2,
      this.game.h / 2 - 20
    );

    if (this.inputActive) {
      // UI de Saisie du nom
      ctx.fillStyle = THEME.cyan;
      ctx.font = "20px Arial";
      ctx.shadowColor = THEME.cyan;
      ctx.fillText(
        "ENTER YOUR INITIALS:",
        this.game.w / 2,
        this.game.h / 2 + 40
      );

      // Affichage du nom tapé
      ctx.font = "bold 40px Monospace";
      ctx.fillStyle = "#ffffff";
      ctx.shadowBlur = 15;

      let display = this.playerName;
      // Curseur clignotant
      if (Math.floor(this.timer * 2) % 2 === 0 && this.playerName.length < 3) {
        display += "_";
      }

      ctx.fillText(display, this.game.w / 2, this.game.h / 2 + 100);

      ctx.font = "14px Arial";
      ctx.fillStyle = "rgba(255,255,255,0.6)";
      ctx.shadowBlur = 0;
      ctx.fillText(
        "PRESS ENTER TO CONFIRM",
        this.game.w / 2,
        this.game.h / 2 + 140
      );
    } else {
      // UI standard "Press Space"
      if (this.timer > 1.0) {
        ctx.font = "20px Arial";
        ctx.fillStyle = "#ffffff";
        ctx.globalAlpha = 0.5 + Math.sin(this.timer * 5) * 0.5;
        ctx.fillText("PRESS SPACE", this.game.w / 2, this.game.h / 2 + 80);
      }
    }

    ctx.restore();
  }
}
