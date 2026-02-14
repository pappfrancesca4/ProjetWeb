import ObjetGraphique from "./ObjetGraphique.js";
import { assets } from "../assetLoader.js";
import { THEME, neonStroke } from "../theme.js";

export default class Bullet extends ObjetGraphique {
  constructor(x, y, dir = 1, isEnemy = false) {
    super(x, y);
    this.w = 16 * 5;
    this.h = 16 * 4;
    this.isEnemy = isEnemy;

    // Vitesse légèrement réduite pour les ennemis
    const speed = isEnemy ? 350 : 520;
    this.vx = speed * dir;
  }

  getHitbox() {
    return { x: this.x, y: this.y, w: this.w, h: this.h };
  }

  update(dt) {
    this.x += this.vx * dt;
    if (this.x < -200 || this.x > 5000) this.dead = true;
  }

  draw(ctx, cameraX) {
    const img = this.isEnemy ? assets.bulletEnemy : assets.bulletPlayer;

    ctx.save();
    ctx.translate(this.x - cameraX, this.y);

    if (img && img.complete && img.naturalWidth > 0) {
      ctx.drawImage(img, 0, 0, this.w, this.h);
    } else {
      // FALLBACK DE SÉCURITÉ : Si l'image ne charge pas, on dessine un rectangle
      const color = this.isEnemy ? "#ff0000" : THEME.cyan;

      // Lueur néon
      ctx.shadowBlur = 15;
      ctx.shadowColor = color;

      // Remplissage semi-transparent
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.8;
      ctx.fillRect(0, 0, this.w, this.h);

      // Contour solide
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2;
      ctx.strokeRect(0, 0, this.w, this.h);
    }

    ctx.restore();
  }
}
