import ObjetGraphique from "./ObjetGraphique.js";
import { rectsOverlap } from "../utils/collisionUtils.js";
import { THEME } from "../theme.js";

export default class Player extends ObjetGraphique {
  constructor(x, y) {
    super(x, y);

    this.w = 36;
    this.h = 54;

    this.vx = 0;
    this.vy = 0;

    this.speed = 260;
    this.jumpPower = 640;
    this.gravity = 1500;

    this.onGround = false;
    this.platformRiding = null;

    this.isSliding = false;
    this.slideTime = 0;

    this.shootCd = 0;
    this.invTime = 0;

    this.godMode = false;

    this.facing = 1;
    this.animTimer = 0;

    this.coyoteTime = 0;
    this.jumpBuffer = 0;

    this.scarfPoints = [
      { x: 0, y: 0 },
      { x: 0, y: 0 },
      { x: 0, y: 0 },
    ];
  }

  getHitbox() {
    if (this.isSliding) {
      return { x: this.x, y: this.y + 22, w: this.w, h: this.h - 22 };
    }
    return { x: this.x, y: this.y, w: this.w, h: this.h };
  }

  hit() {
    if (this.godMode) return false;

    if (this.invTime > 0) return false;
    this.invTime = 0.6;
    return true;
  }

  canShoot() {
    return this.shootCd <= 0;
  }

  didShoot() {
    // Réduit de 0.25 à 0.15 pour rendre le tir plus réactif
    this.shootCd = 0.15;
  }

  startSlide() {
    if (this.onGround && !this.isSliding) {
      this.isSliding = true;
      this.slideTime = 0.35;
    }
  }

  update(dt, input, solids) {
    this.animTimer += dt;

    if (this.invTime > 0) this.invTime -= dt;
    if (this.shootCd > 0) this.shootCd -= dt;
    if (this.coyoteTime > 0) this.coyoteTime -= dt;
    if (this.jumpBuffer > 0) this.jumpBuffer -= dt;

    if (input.down) this.startSlide();
    if (this.isSliding) {
      this.slideTime -= dt;
      if (this.slideTime <= 0) this.isSliding = false;
    }

    this.vx = 0;
    if (input.left) {
      this.vx = -this.speed;
      this.facing = -1;
    }
    if (input.right) {
      this.vx = this.speed;
      this.facing = 1;
    }

    if (this.platformRiding) {
      this.x += this.platformRiding.dx;
    }

    if (input.up) {
      this.jumpBuffer = 0.1;
    }

    if (
      this.jumpBuffer > 0 &&
      (this.onGround || this.coyoteTime > 0) &&
      !this.isSliding
    ) {
      this.vy = -this.jumpPower;
      this.onGround = false;
      this.coyoteTime = 0;
      this.jumpBuffer = 0;
      this.platformRiding = null;
    } else if (!input.up && this.vy < -100) {
      this.vy *= 0.5;
    }

    this.vy += this.gravity * dt;

    this.x += this.vx * dt;
    this.handleCollisions(solids, true, dt);

    this.y += this.vy * dt;
    this.handleCollisions(solids, false, dt);

    if (this.y < 0) this.y = 0;
    if (this.y > 2000) this.y = 2000;

    this.updateScarf(dt);
  }

  updateScarf(dt) {
    const attachX = this.x + (this.facing === 1 ? 10 : this.w - 10);
    const attachY = this.y + 18;

    let targetX = attachX - this.vx * 0.1 - this.facing * 10;
    let targetY = attachY + this.vy * 0.05 + 5;

    if (this.isSliding) {
      targetY = attachY + 10;
      targetX = attachX - this.facing * 30;
    }

    this.scarfPoints[0].x = attachX;
    this.scarfPoints[0].y = attachY;

    for (let i = 1; i < this.scarfPoints.length; i++) {
      const prev = this.scarfPoints[i - 1];
      const curr = this.scarfPoints[i];

      curr.x += (prev.x - curr.x) * 10 * dt;
      curr.y += (prev.y - curr.y) * 10 * dt;

      curr.x += (targetX - curr.x) * 2 * dt;
      curr.y += (targetY - curr.y) * 2 * dt;

      curr.y += Math.sin(this.animTimer * 10 + i) * 20 * dt;
    }
  }

  handleCollisions(solids, moveX, dt) {
    let hb = this.getHitbox();
    const skinWidth = 0.5;

    this.onGround = false;
    let groundedThisFrame = false;

    for (const s of solids) {
      if (!rectsOverlap(hb.x, hb.y, hb.w, hb.h, s.x, s.y, s.w, s.h)) continue;

      if (s.isOneWay) {
        if (moveX) continue;
        if (this.vy < 0) continue;

        const prevBottom = this.y - this.vy * dt + this.h;
        if (prevBottom > s.y + 10) continue;
      }

      if (moveX) {
        const overlapY = Math.min(hb.y + hb.h, s.y + s.h) - Math.max(hb.y, s.y);
        const totalH = Math.min(hb.h, s.h);

        if (overlapY < totalH - skinWidth * 2) {
          continue;
        }

        if (this.vx > 0) {
          this.x = s.x - hb.w - 0.01;
        } else if (this.vx < 0) {
          this.x = s.x + s.w + 0.01;
        }
        this.vx = 0;
        hb = this.getHitbox();
      } else {
        if (this.vy > 0) {
          this.y = s.y - this.h;
          this.vy = 0;
          groundedThisFrame = true;

          if (s.ref && s.ref.vx !== undefined) {
            this.platformRiding = s.ref;
          } else {
            this.platformRiding = null;
          }
        } else if (this.vy < 0) {
          const offsetTop = this.isSliding ? 22 : 0;
          this.y = s.y + s.h - offsetTop;
          this.vy = 0;
        }
        hb = this.getHitbox();
      }
    }

    if (!moveX) {
      if (groundedThisFrame) {
        this.onGround = true;
        this.coyoteTime = 0.1;
      } else if (this.onGround) {
        this.onGround = true;
      } else {
        this.platformRiding = null;
      }
    }
  }

  draw(ctx, cameraX) {
    const centerX = Math.round(this.x - cameraX + this.w / 2);
    const centerY = Math.round(this.y + this.h / 2);

    ctx.save();
    ctx.translate(centerX, centerY);

    if (this.godMode) {
      ctx.save();
      ctx.rotate(this.animTimer * 3);
      ctx.strokeStyle = "#ffd700";
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.arc(0, 0, 40, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    if (this.invTime > 0) {
      if (Math.floor(this.invTime * 10) % 2 === 0) ctx.globalAlpha = 0.5;
    }

    ctx.scale(this.facing, 1);

    const isMoving = Math.abs(this.vx) > 10;
    const runCycle = this.animTimer * 15;

    let bodyY = 0;
    let headY = -18;
    let legL_Angle = 0;
    let legR_Angle = 0;
    let armL_Angle = 0;
    let armR_Angle = 0;
    let bodyRot = 0;

    if (this.isSliding) {
      bodyRot = -1.2;
      bodyY = 15;
      headY = -14;
      legL_Angle = 1.5;
      legR_Angle = 0.5;
      armL_Angle = -1.5;
      armR_Angle = -1.0;

      ctx.fillStyle = "#ffff00";
      for (let k = 0; k < 3; k++) {
        const sx = -20 - Math.random() * 10;
        const sy = 25 + Math.random() * 5;
        ctx.fillRect(sx, sy, 4, 4);
      }
    } else if (!this.onGround) {
      bodyY = -2;
      if (this.vy < 0) {
        legL_Angle = -0.5;
        legR_Angle = 0.8;
        armL_Angle = 0.5;
        armR_Angle = -0.5;
      } else {
        legL_Angle = -0.2;
        legR_Angle = -0.2;
        armL_Angle = -2.5;
        armR_Angle = -2.5;
      }
    } else if (isMoving) {
      bodyY = Math.sin(runCycle * 2) * 1;
      legL_Angle = Math.sin(runCycle) * 0.8;
      legR_Angle = Math.sin(runCycle + Math.PI) * 0.8;
      armL_Angle = Math.sin(runCycle + Math.PI) * 0.6;
      armR_Angle = Math.sin(runCycle) * 0.6;
    } else {
      bodyY = Math.sin(this.animTimer * 2) * 1;
      armL_Angle = Math.sin(this.animTimer * 2) * 0.05;
      armR_Angle = -Math.sin(this.animTimer * 2) * 0.05;
    }

    const cSuit = "#2a2d3e";
    const cArmor = "#40445a";
    const cHighlight = "#00d0ff";
    const cScarf = "#ff3333";
    const cBoots = "#15161f";
    const cVisor = "#00ffff";

    ctx.save();
    ctx.scale(this.facing, 1);
    ctx.translate(-centerX, -centerY);

    ctx.beginPath();
    ctx.moveTo(this.scarfPoints[0].x - cameraX, this.scarfPoints[0].y);
    ctx.quadraticCurveTo(
      this.scarfPoints[1].x - cameraX,
      this.scarfPoints[1].y,
      this.scarfPoints[2].x - cameraX,
      this.scarfPoints[2].y
    );
    ctx.lineWidth = 6;
    ctx.strokeStyle = cScarf;
    ctx.lineCap = "round";
    ctx.stroke();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#ff8888";
    ctx.stroke();
    ctx.restore();

    const drawLimb = (x, y, angle, len, w, color) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.fillStyle = color;
      ctx.fillRect(-w / 2, 0, w, len);

      ctx.fillStyle = cBoots;
      ctx.fillRect(-w / 2 - 1, len - 4, w + 2, 6);
      ctx.restore();
    };

    const drawArm = (x, y, angle, len, w, color) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.fillStyle = color;
      ctx.fillRect(-w / 2, 0, w, len);

      ctx.fillStyle = cBoots;
      ctx.fillRect(-w / 2 - 1, len - 4, w + 2, 5);
      ctx.restore();
    };

    drawArm(-4, bodyY - 5, armL_Angle, 18, 5, "#20222e");
    drawLimb(-3, bodyY + 8, legL_Angle, 20, 7, "#20222e");

    ctx.save();
    ctx.translate(0, bodyY);
    ctx.rotate(bodyRot);

    ctx.fillStyle = "#111";
    ctx.fillRect(-10, -8, 8, 20);
    ctx.fillStyle = cHighlight;
    ctx.shadowBlur = 5;
    ctx.shadowColor = cHighlight;
    ctx.fillRect(-9, -4, 2, 2);
    ctx.shadowBlur = 0;

    ctx.fillStyle = cSuit;
    ctx.fillRect(-6, -10, 12, 22);

    ctx.fillStyle = cArmor;
    ctx.fillRect(-7, -10, 14, 8);

    ctx.fillStyle = cScarf;
    ctx.fillRect(-5, -11, 10, 3);

    ctx.restore();

    ctx.save();
    ctx.translate(0, bodyY + headY);
    ctx.rotate(bodyRot * 0.5);

    ctx.fillStyle = cArmor;
    ctx.beginPath();
    ctx.arc(0, 0, 9, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = cVisor;
    ctx.shadowBlur = 10;
    ctx.shadowColor = cVisor;
    ctx.beginPath();
    ctx.moveTo(3, -4);
    ctx.lineTo(8, -2);
    ctx.lineTo(8, 4);
    ctx.lineTo(3, 6);
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.fillStyle = "rgba(255,255,255,0.4)";
    ctx.fillRect(4, -2, 2, 2);

    ctx.restore();

    drawLimb(3, bodyY + 8, legR_Angle, 20, 7, cSuit);
    drawArm(5, bodyY - 5, armR_Angle, 18, 5, cSuit);

    ctx.restore();
  }
}
