import { THEME, neonStroke } from "../theme.js";

export default class Hazard{
  constructor(x,y,w,h){
    this.x=x; this.y=y; this.w=w; this.h=h;
  }

  draw(ctx,cameraX){
    ctx.save();
    ctx.translate(this.x - cameraX, this.y);
    neonStroke(ctx,THEME.magenta,18,2);
    ctx.beginPath();
    ctx.moveTo(0,this.h);
    ctx.lineTo(this.w/2,0);
    ctx.lineTo(this.w,this.h);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
  }
}
