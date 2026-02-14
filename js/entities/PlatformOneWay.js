import { THEME } from "../theme.js";

export default class PlatformOneWay {
  constructor(x, y, w) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = 10;
  }

  draw(ctx, cameraX) {
    ctx.save();
    ctx.translate(this.x - cameraX, this.y);

    ctx.fillStyle = THEME.level.platform;
    ctx.fillRect(0, 0, this.w, 4);

    ctx.shadowBlur = 10;
    ctx.shadowColor = THEME.cyan;
    ctx.fillStyle = THEME.cyan;
    ctx.fillRect(0, 0, this.w, 2);

    ctx.globalAlpha = 0.3;
    ctx.fillStyle = THEME.cyan;
    for (let i = 0; i < this.w; i += 16) {
      ctx.fillRect(i, 2, 2, 6);
    }

    ctx.restore();
  }
}
