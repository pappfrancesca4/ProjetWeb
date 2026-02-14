export const THEME = {
  bg1:"#05061b",
  bg2:"#07092a",
  cyan:"#46f3ff",
  magenta:"#ff4bd8",
  violet:"#8e5bff",
  text:"#eaf7ff",
  textDim:"rgba(234,247,255,0.75)",
  player: {
    body: "#46f3ff",
    visor: "#ff0055",
    core: "#ffffff",
    shadow: 20
  },
  level: {
    ground: "#0f1135",
    groundTop: "#46f3ff",
    groundDetail: "#1c1f52",
    platform: "#1a1d4e",
    platformBorder: "#8e5bff",
    platformLight: "#ffffff"
  }
};

export function drawBackground(ctx,w,h){
  const g = ctx.createLinearGradient(0,0,0,h);
  g.addColorStop(0,THEME.bg1);
  g.addColorStop(1,THEME.bg2);
  ctx.save();
  ctx.fillStyle=g;
  ctx.fillRect(0,0,w,h);
  ctx.restore();
}

export function neonStroke(ctx,color,blur=16,width=2){
  ctx.strokeStyle=color;
  ctx.lineWidth=width;
  ctx.shadowColor=color;
  ctx.shadowBlur=blur;
}