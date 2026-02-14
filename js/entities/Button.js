import { THEME, neonStroke } from "../theme.js";

export default class Button {
  constructor(x, y) {
    this.x = x; this.y = y;
    this.w = 30; this.h = 14;
    this.isOn = false;
  }

  draw(ctx, cameraX) {
    ctx.save();
    ctx.translate(this.x - cameraX, this.y);

    neonStroke(ctx, this.isOn ? THEME.cyan : THEME.magenta, 12, 2);
    ctx.strokeRect(0, 0, this.w, this.h);

    ctx.restore();
  }
}
