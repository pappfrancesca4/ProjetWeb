import ObjetGraphique from "./ObjetGraphique.js";
import Bullet from "./Bullet.js";
import { THEME } from "../theme.js";

export default class Enemy extends ObjetGraphique {
  constructor(x, y, type = "ground") {
    super(x, y);
    this.w = 40;
    this.h = 40;
    this.type = type;

    this.vx = 90;
    this.vy = 0;
    this.hp = 1;
    this.dead = false;

    this.timer = 0;
    this.flashTime = 0;

    this.patrolDist = 0;
    this.maxPatrol = 180;
    this.facing = 1;

    // Gestion du tir
    this.shootTimer = 0;
    // On initialise un délai aléatoire pour éviter que tous les ennemis tirent exactement en même temps au spawn
    this.shootCooldown = 2.0 + Math.random();
  }

  getHitbox() {
    return { x: this.x + 4, y: this.y + 4, w: this.w - 8, h: this.h - 8 };
  }

  hit() {
    this.hp--;
    this.flashTime = 0.2;
    if (this.hp <= 0) {
      this.dead = true;
      return true;
    }
    return false;
  }

  // Update retourne désormais une Balle (ou null)
  update(dt, player, levelIndex = 0) {
    this.timer += dt;
    if (this.flashTime > 0) this.flashTime -= dt;

    // ---- Mouvement ----
    if (this.type === "ground") {
      this.x += this.vx * dt;
      this.patrolDist += Math.abs(this.vx * dt);

      if (this.patrolDist >= this.maxPatrol) {
        this.vx *= -1;
        this.patrolDist = 0;
        this.facing *= -1;
      }
    } else {
      this.y += Math.sin(this.timer * 3) * 30 * dt;
    }

    // ---- Logique de Tir (IA) ----
    if (this.shootTimer > 0) {
      this.shootTimer -= dt;
    } else {
      // 1. Calcul de la distance avec le joueur
      const dx = player.x - this.x;
      const dy = player.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // 2. Conditions pour tirer :
      // - Le joueur est à moins de 400 pixels (portée)
      // - L'ennemi est à peu près au même niveau vertical (à 60px près)
      // - L'ennemi regarde dans la direction du joueur (signe de dx == signe de facing)
      const isFacingPlayer =
        (this.facing === 1 && dx > 0) || (this.facing === -1 && dx < 0);

      if (dist < 400 && Math.abs(dy) < 60 && isFacingPlayer) {
        // 3. Difficulté progressive
        // Niveau 0 : ~3.5s de délai
        // Niveau 5 : ~1.5s de délai
        // Formule : Base - (niveau * facteur), avec un minimum de 1 seconde
        const baseCooldown = 3.5;
        const difficultyMod = levelIndex * 0.4;
        const nextCd = Math.max(1.0, baseCooldown - difficultyMod);

        this.shootTimer = nextCd + Math.random() * 0.5; // Un peu d'aléatoire

        // Création de la balle (x, y, dir, isEnemy=true)
        const spawnX = this.facing === 1 ? this.x + this.w : this.x - 32;
        return new Bullet(spawnX, this.y + 10, this.facing, true);
      }
    }

    return null;
  }

  draw(ctx, cameraX) {
    const cx = this.x - cameraX + this.w / 2;
    const cy = this.y + this.h / 2;

    const bob = Math.sin(this.timer * 4) * 3;

    ctx.save();
    ctx.translate(cx, cy + bob);

    if (this.flashTime > 0) {
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(0, 0, 20, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      return;
    }

    ctx.fillStyle = "rgba(0,0,0,0.3)";
    ctx.beginPath();
    ctx.ellipse(0, 25 - bob, 15 - bob * 0.5, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.scale(this.facing, 1);

    const cBody = "#222";
    const cArmor = "#555";
    const cGlow = "#ff0044";

    ctx.fillStyle = cBody;
    ctx.beginPath();
    ctx.moveTo(-12, -10);
    ctx.lineTo(12, -10);
    ctx.lineTo(18, 0);
    ctx.lineTo(12, 10);
    ctx.lineTo(-12, 10);
    ctx.lineTo(-18, 0);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = cArmor;
    ctx.beginPath();
    ctx.moveTo(-8, -14);
    ctx.lineTo(8, -14);
    ctx.lineTo(14, -6);
    ctx.lineTo(-14, -6);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(-8, 14);
    ctx.lineTo(8, 14);
    ctx.lineTo(12, 6);
    ctx.lineTo(-12, 6);
    ctx.fill();

    ctx.shadowBlur = 10;
    ctx.shadowColor = cGlow;
    ctx.fillStyle = "#330000";
    ctx.fillRect(-10, -3, 20, 6);

    const eyeX = Math.sin(this.timer * 3) * 6;
    ctx.fillStyle = cGlow;
    ctx.fillRect(eyeX - 2, -3, 4, 6);
    ctx.shadowBlur = 0;

    ctx.fillStyle = "#ffaa00";
    ctx.globalAlpha = 0.6 + Math.sin(this.timer * 20) * 0.4;
    const flicker = Math.random() * 2;
    ctx.beginPath();
    ctx.moveTo(-10, 10);
    ctx.lineTo(-14, 18 + flicker);
    ctx.lineTo(-6, 18 + flicker);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(10, 10);
    ctx.lineTo(6, 18 + flicker);
    ctx.lineTo(14, 18 + flicker);
    ctx.fill();

    ctx.restore();
  }
}
