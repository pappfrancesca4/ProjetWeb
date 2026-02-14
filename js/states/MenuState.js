import { THEME, drawBackground } from "../theme.js";

export default class MenuState {
  constructor(game) {
    this.game = game;
    this.timer = 0;
  }

  enter() {
    this.timer = 0;
  }

  update(dt) {
    this.timer += dt;
    this.game.starfield.update(dt);

    if (this.game.input.space) {
      this.game.setState("STORY", 0);
    }

    if (this.game.input.h) {
      this.game.setState("HIGHSCORES");
    }
  }

  draw(ctx) {
    const w = this.game.w;
    const h = this.game.h;

    drawBackground(ctx, w, h);
    this.game.starfield.draw(ctx);

    ctx.save();
    ctx.textAlign = "center";

    const pulse = 10 + Math.sin(this.timer * 2) * 5;
    ctx.shadowBlur = pulse;
    ctx.shadowColor = THEME.cyan;
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 60px Arial";
    ctx.fillText("NEON LAB ESCAPE", w / 2, h / 3);

    ctx.shadowBlur = 0;
    ctx.fillStyle = THEME.text;
    ctx.font = "20px Arial";
    ctx.fillText("L'évasion commence maintenant", w / 2, h / 3 + 40);

    if (Math.floor(this.timer * 2) % 2 === 0) {
      ctx.fillStyle = THEME.magenta;
      ctx.shadowBlur = 10;
      ctx.shadowColor = THEME.magenta;
      ctx.font = "bold 24px Arial";
      ctx.fillText("PRESS SPACE TO START", w / 2, h / 2 + 50);
    }

    ctx.shadowBlur = 5;
    ctx.shadowColor = THEME.cyan;
    ctx.fillStyle = THEME.cyan;
    ctx.font = "bold 18px Arial";
    ctx.fillText("[ Press 'H' for High Scores ]", w / 2, h / 2 + 100);

    ctx.shadowBlur = 0;
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.font = "16px Arial";
    ctx.fillText(
      "Flèches : Bouger  |  Espace : Tirer/Valider  |  Bas : Glisser",
      w / 2,
      h - 50
    );

    ctx.restore();
  }
}
