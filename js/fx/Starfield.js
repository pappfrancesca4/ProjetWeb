export default class Starfield {
    constructor(w, h, count) {
      this.w = w;
      this.h = h;
      this.stars = [];
      for (let i = 0; i < count; i++) {
        this.stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: 20 + Math.random() * 60,
          size: 1 + Math.random() * 2,
          opacity: 0.3 + Math.random() * 0.7
        });
      }
    }
  
    update(dt) {
      for (const s of this.stars) {
        s.x += s.vx * dt;
        if (s.x > this.w) {
          s.x = 0;
          s.y = Math.random() * this.h;
        }
      }
    }
  
    draw(ctx) {
      ctx.save();
      for (const s of this.stars) {
        ctx.fillStyle = `rgba(255,255,255,${s.opacity})`;
        ctx.fillRect(s.x, s.y, s.size, s.size);
      }
      ctx.restore();
    }
  }