import { THEME } from "../theme.js";

export default class Tile{
  constructor(x,y,size){
    this.x=x; this.y=y; this.w=size; this.h=size;
  }

  draw(ctx,cameraX){
    ctx.save();
    ctx.translate(this.x - cameraX, this.y);

    ctx.fillStyle = THEME.level.ground;
    ctx.fillRect(0, 0, this.w, this.h);

    ctx.fillStyle = THEME.level.groundDetail;
    ctx.fillRect(4, 4, this.w - 8, this.h - 8);

    ctx.fillStyle = THEME.level.ground;
    ctx.fillRect(10, 10, this.w - 20, this.h - 20);

    ctx.fillStyle = "rgba(70, 243, 255, 0.1)";
    for(let i=0; i<this.w; i+=8) {
        ctx.fillRect(i, 0, 1, this.h);
    }

    ctx.shadowBlur = 10;
    ctx.shadowColor = THEME.level.groundTop;
    ctx.fillStyle = THEME.level.groundTop;
    ctx.fillRect(0, 0, this.w, 3);

    ctx.restore();
  }
}