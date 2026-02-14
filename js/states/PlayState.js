import Player from "../entities/Player.js";
import Bullet from "../entities/Bullet.js";
import { rectsOverlap } from "../utils/collisionUtils.js";
import { drawBackground, THEME } from "../theme.js";
import { LEVELS } from "../levels/levels.js";
import { buildLevel } from "../levels/levelBuilder.js";

export default class PlayState {
  constructor(game) {
    this.game = game;
    this.score = 0;
    this.lives = 3;
    this.levelTime = 0;
  }

  enter(levelIndex) {
    this.levelIndex = levelIndex ?? 0;

    if (this.levelIndex === 0) {
      this.score = 0;
      this.lives = 3;
    }

    this.loadLevel();
  }

  loadLevel() {
    this.level = LEVELS[this.levelIndex];
    const built = buildLevel(this.level);

    this.tiles = built.tiles;
    this.oneWayPlatforms = built.oneWayPlatforms;
    this.solids = built.solids;
    this.enemies = built.enemies;
    this.hazards = built.hazards;
    this.door = built.door;
    this.movingPlatforms = built.movingPlatforms;
    this.buttons = built.buttons;
    this.gates = built.gates;

    this.player = new Player(built.playerSpawn.x, built.playerSpawn.y);

    this.levelTime = 0;

    this.bullets = [];

    this.cameraX = 0;

    this.worldW = this.level.map[0].length * 64;
    this.worldH = this.level.map.length * 64;

    this.spawn = { x: built.playerSpawn.x, y: built.playerSpawn.y };
  }

  update(dt) {
    if (this.lives <= 0) return;

    this.levelTime += dt;

    this.game.starfield.update(dt);
    const i = this.game.input;

    this.movingPlatforms.forEach((p) => p.update(dt));

    for (const s of this.solids) {
      if (s.ref && !s.isGate) {
        s.x = s.ref.x;
        s.y = s.ref.y;
        s.w = s.ref.w;
        s.h = s.ref.h;
        s.dx = s.ref.dx || 0;
        s.isOneWay = s.ref.isOneWay || false;
      }
    }

    this.player.update(dt, i, this.solids);

    const ph = this.player.getHitbox();

    for (const b of this.buttons) {
      if (rectsOverlap(ph.x, ph.y, ph.w, ph.h, b.x, b.y, b.w, b.h)) {
        b.isOn = true;
      }
    }

    const anyOn = this.buttons.some((b) => b.isOn);
    if (anyOn) {
      this.gates.forEach((g) => (g.open = true));
      this.solids = this.solids.filter((s) => !s.isGate);
    }

    if (i.space && this.player.canShoot()) {
      const dir = this.player.facing;
      const spawnX = this.player.x + (dir === 1 ? 30 : -10);
      const spawnY = this.player.y + 20;

      // Balle du joueur (isEnemy = false par défaut)
      this.bullets.push(new Bullet(spawnX, spawnY, dir, false));
      this.player.didShoot();
    }

    this.bullets.forEach((b) => b.update(dt));
    this.bullets = this.bullets.filter((b) => !b.dead);

    // Mise à jour des ennemis avec passage du joueur et du niveau pour l'IA de tir
    this.enemies.forEach((e) => {
      // e.update retourne une balle si l'ennemi tire, sinon null
      const enemyBullet = e.update(dt, this.player, this.levelIndex);
      if (enemyBullet) {
        this.bullets.push(enemyBullet);
      }
    });
    this.enemies = this.enemies.filter((e) => !e.dead);

    // Gestion des collisions des balles
    for (const b of this.bullets) {
      const bb = b.getHitbox();

      if (b.isEnemy) {
        // Cas 1 : Balle ennemie vs Joueur
        if (rectsOverlap(bb.x, bb.y, bb.w, bb.h, ph.x, ph.y, ph.w, ph.h)) {
          b.dead = true;
          if (this.player.hit()) {
            this.lives--;
            if (this.lives <= 0) {
              this.lives = 0;
              this.game.setState("GAMEOVER", this.score);
              return;
            }
          }
        }
      } else {
        // Cas 2 : Balle joueur vs Ennemis
        for (const e of this.enemies) {
          const eb = e.getHitbox();
          if (rectsOverlap(bb.x, bb.y, bb.w, bb.h, eb.x, eb.y, eb.w, eb.h)) {
            b.dead = true;
            e.hit();
            this.score += 100;
          }
        }
      }
    }

    for (const h of this.hazards) {
      if (rectsOverlap(ph.x, ph.y, ph.w, ph.h, h.x, h.y, h.w, h.h)) {
        if (this.player.hit()) {
          this.lives--;
          if (this.lives <= 0) {
            this.lives = 0;
            this.game.setState("GAMEOVER", this.score);
            return;
          }
        }
      }
    }

    for (const e of this.enemies) {
      const eb = e.getHitbox();
      if (rectsOverlap(ph.x, ph.y, ph.w, ph.h, eb.x, eb.y, eb.w, eb.h)) {
        if (this.player.hit()) {
          this.lives--;
          if (this.lives <= 0) {
            this.lives = 0;
            this.game.setState("GAMEOVER", this.score);
            return;
          }
        }
      }
    }

    if (this.door) {
      if (
        rectsOverlap(
          ph.x,
          ph.y,
          ph.w,
          ph.h,
          this.door.x,
          this.door.y,
          this.door.w,
          this.door.h
        )
      ) {
        this.score += 500;

        const timeBonus = Math.max(0, Math.floor((120 - this.levelTime) * 10));
        this.score += timeBonus;

        this.levelIndex++;
        if (this.levelIndex >= LEVELS.length) {
          this.game.setState("GAMEOVER", this.score);
        } else {
          this.game.setState("STORY", this.levelIndex);
        }
        return;
      }
    }

    const lookAhead = this.player.facing * 120;
    const targetX =
      this.player.x + this.player.w / 2 - this.game.w / 2 + lookAhead;

    const nextCamX = this.cameraX + (targetX - this.cameraX) * 0.08;
    if (nextCamX > this.cameraX) {
      this.cameraX = nextCamX;
    }

    if (this.player.x < this.cameraX) {
      this.player.x = this.cameraX;
    }

    const maxCam = Math.max(0, this.worldW - this.game.w);
    if (this.cameraX > maxCam) this.cameraX = maxCam;

    if (this.player.y > this.worldH + 300) {
      this.lives--;
      if (this.lives <= 0) {
        this.lives = 0;
        this.game.setState("GAMEOVER", this.score);
        return;
      }
      this.player.x = this.spawn.x;
      this.player.y = this.spawn.y;
      this.player.vx = 0;
      this.player.vy = 0;
      this.cameraX = 0;
    }
  }

  draw(ctx) {
    const g = this.game;

    drawBackground(ctx, g.w, g.h);
    g.starfield.draw(ctx);

    this.tiles.forEach((t) => t.draw(ctx, this.cameraX));
    this.oneWayPlatforms.forEach((p) => p.draw(ctx, this.cameraX));
    this.hazards.forEach((h) => h.draw(ctx, this.cameraX));
    if (this.door) this.door.draw(ctx, this.cameraX);

    this.enemies.forEach((e) => e.draw(ctx, this.cameraX));
    this.bullets.forEach((b) => b.draw(ctx, this.cameraX));
    this.player.draw(ctx, this.cameraX);

    this.movingPlatforms.forEach((p) => p.draw(ctx, this.cameraX));
    this.buttons.forEach((b) => b.draw(ctx, this.cameraX));
    this.gates.forEach((g) => g.draw(ctx, this.cameraX));

    ctx.save();
    ctx.fillStyle = THEME.text;
    ctx.font = "bold 16px Arial";
    ctx.shadowBlur = 4;
    ctx.shadowColor = THEME.cyan;

    ctx.fillText(`SCORE: ${this.score.toString().padStart(6, "0")}`, 20, 30);

    ctx.fillStyle = this.lives === 1 ? "#ff0000" : THEME.text;
    ctx.shadowColor = this.lives === 1 ? "#ff0000" : THEME.cyan;
    ctx.fillText(`VIES: ${this.lives}`, 20, 55);

    const timeStr = this.levelTime.toFixed(1);
    ctx.fillStyle = THEME.magenta;
    ctx.shadowColor = THEME.magenta;
    ctx.fillText(`TIME: ${timeStr}s`, g.w - 120, 30);

    ctx.fillStyle = THEME.text;
    ctx.shadowColor = THEME.cyan;
    ctx.fillText(`LVL: ${this.levelIndex + 1}/${LEVELS.length}`, g.w - 120, 55);

    ctx.restore();
  }
}
