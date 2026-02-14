import { THEME, neonStroke } from "../theme.js";

export default class Gate {
  constructor(x, y) {
    this.x = x; this.y = y;
    this.w = 48; this.h = 96;
    this.open = false;
  }

  draw(ctx, cameraX) {
    if (this.open) return;

    ctx.save();
    ctx.translate(this.x - cameraX, this.y);
    neonStroke(ctx, THEME.magenta, 18, 3);
    ctx.strokeRect(0, 0, this.w, this.h);
    ctx.restore();
  }
}
