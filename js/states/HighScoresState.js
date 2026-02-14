import { drawBackground, THEME } from "../theme.js";
import { getHighScores } from "../storage/highscores.js";

export default class HighScoresState {
  constructor(game) {
    this.game = game;
    this.scores = [];
  }

  enter() {
    this.scores = getHighScores();
  }

  update(dt) {
    this.game.starfield.update(dt);

    if (this.game.input.space) {
      this.game.setState("MENU");
    }
  }

  draw(ctx) {
    const w = this.game.w;
    const h = this.game.h;

    drawBackground(ctx, w, h);
    this.game.starfield.draw(ctx);

    ctx.save();
    ctx.textAlign = "center";

    ctx.shadowBlur = 15;
    ctx.shadowColor = THEME.magenta;
    ctx.fillStyle = THEME.magenta;
    ctx.font = "bold 40px Arial";
    ctx.fillText("HALL OF FAME", w / 2, 80);

    ctx.font = "20px Monospace";
    ctx.textAlign = "left";

    const startY = 150;
    const lineHeight = 35;
    const boxX = w / 2 - 150;

    ctx.fillStyle = THEME.cyan;
    ctx.shadowBlur = 5;
    ctx.shadowColor = THEME.cyan;
    ctx.fillText("RANK   NAME    SCORE", boxX, startY - 20);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(boxX, startY - 10, 300, 2);

    this.scores.forEach((entry, index) => {
      const y = startY + 20 + index * lineHeight;

      if (index === 0) ctx.fillStyle = "#ffd700";
      else if (index === 1) ctx.fillStyle = "#c0c0c0";
      else if (index === 2) ctx.fillStyle = "#cd7f32";
      else ctx.fillStyle = "#ffffff";

      ctx.shadowBlur = 0;

      const rank = (index + 1).toString().padStart(2, "0");
      const name = entry.name.padEnd(5, " ");
      const score = entry.score.toString().padStart(6, "0");

      ctx.fillText(`${rank}     ${name}   ${score}`, boxX, y);
    });

    if (this.scores.length === 0) {
      ctx.fillStyle = "rgba(255,255,255,0.5)";
      ctx.textAlign = "center";
      ctx.fillText("NO DATA YET", w / 2, h / 2);
    }

    ctx.textAlign = "center";
    ctx.fillStyle = THEME.text;
    ctx.font = "16px Arial";
    ctx.shadowBlur = 5;
    ctx.shadowColor = THEME.text;
    ctx.fillText("PRESS SPACE TO MENU", w / 2, h - 50);

    ctx.restore();
  }
}
