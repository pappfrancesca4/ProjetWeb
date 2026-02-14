import { THEME } from "../theme.js";

export default class MovingPlatform {
  constructor(x, y, w, h, minX, maxX) {
    this.x = x; 
    this.y = y + 20; 
    this.w = w; 
    this.h = 8;
    this.minX = minX;
    this.maxX = maxX;
    this.vx = 90;
    this.dx = 0;
    this.timer = 0;
    this.isOneWay = true;
  }

  update(dt) {
    this.timer += dt;
    const prevX = this.x;
    
    this.x += this.vx * dt;
    
    if (this.x < this.minX) { 
        this.x = this.minX; 
        this.vx *= -1; 
    }
    if (this.x > this.maxX) { 
        this.x = this.maxX; 
        this.vx *= -1; 
    }

    this.dx = this.x - prevX;
  }

  draw(ctx, cameraX) {
    ctx.save();
    ctx.translate(Math.round(this.x - cameraX), Math.round(this.y));

    ctx.shadowBlur = 10;
    ctx.shadowColor = THEME.level.platformBorder;
    ctx.fillStyle = THEME.level.platformBorder;
    ctx.fillRect(0, 0, this.w, this.h);

    ctx.fillStyle = "#ffffff";
    ctx.shadowBlur = 15;
    ctx.shadowColor = "#ffffff";
    ctx.globalAlpha = 0.8 + Math.sin(this.timer * 5) * 0.2;
    ctx.fillRect(0, 0, this.w, 2);

    ctx.globalAlpha = 1.0;
    ctx.fillStyle = THEME.cyan;
    ctx.shadowColor = THEME.cyan;
    
    const engineX = this.vx > 0 ? 0 : this.w;
    ctx.beginPath();
    ctx.arc(engineX, this.h / 2, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}