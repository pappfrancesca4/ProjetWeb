import ObjetGraphique from "./ObjetGraphique.js";
import { THEME } from "../theme.js";

export default class Door extends ObjetGraphique {
  constructor(x, y) {
    super(x, y);
    this.w = 64;
    this.h = 80;
    this.timer = 0;
  }

  update(dt) {
    this.timer += dt;
  }

  draw(ctx, cameraX) {
    const cx = this.x - cameraX + this.w / 2;
    const cy = this.y + this.h / 2;

    ctx.save();
    ctx.translate(cx, cy);

    const mainColor = "#00ffcc";
    const secondaryColor = "#0088ff";

    ctx.strokeStyle = secondaryColor;
    ctx.lineWidth = 4;
    ctx.shadowBlur = 10;
    ctx.shadowColor = secondaryColor;

    ctx.beginPath();
    ctx.moveTo(-28, 40);
    ctx.lineTo(-28, -30);
    ctx.lineTo(-15, -40);
    ctx.lineTo(15, -40);
    ctx.lineTo(28, -30);
    ctx.lineTo(28, 40);
    ctx.stroke();

    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    ctx.moveTo(-34, 40);
    ctx.lineTo(-34, -32);
    ctx.lineTo(34, -32);
    ctx.lineTo(34, 40);
    ctx.stroke();
    ctx.globalAlpha = 1.0;

    const angle = this.timer;
    ctx.strokeStyle = mainColor;
    ctx.shadowColor = mainColor;
    ctx.lineWidth = 2;

    ctx.save();
    ctx.rotate(angle);
    ctx.beginPath();
    for (let i = 0; i < 4; i++) {
      ctx.rotate(Math.PI / 2);
      ctx.moveTo(10, 0);
      ctx.arc(0, 0, 18, 0, Math.PI / 4);
    }
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.rotate(-angle * 1.5);
    ctx.beginPath();
    ctx.arc(0, 0, 10, 0, Math.PI * 2);
    ctx.setLineDash([2, 4]);
    ctx.stroke();
    ctx.restore();

    ctx.fillStyle = "#ffffff";
    ctx.shadowBlur = 20;
    ctx.shadowColor = "#ffffff";
    ctx.globalAlpha = 0.5 + Math.sin(this.timer * 5) * 0.3;
    ctx.beginPath();
    ctx.arc(0, 0, 6, 0, Math.PI * 2);
    ctx.fill();

    const particlesCount = 5;
    ctx.fillStyle = mainColor;
    ctx.shadowBlur = 0;
    for (let i = 0; i < particlesCount; i++) {
      const offset =
        (this.timer * 2 + i * ((Math.PI * 2) / particlesCount)) % (Math.PI * 2);
      const yP = Math.sin(offset) * 25;
      const xP = Math.cos(offset * 3) * 10;
      const s = Math.abs(Math.sin(offset)) * 2;
      ctx.globalAlpha = (1 - Math.abs(yP) / 30) * 0.8;
      ctx.fillRect(xP, yP, s, s);
    }

    ctx.restore();
  }
}
