import { STORY } from "../story/storyData.js";
import { drawBackground, THEME } from "../theme.js";

export default class StoryState{
  constructor(game){
    this.game=game;
    this.levelIndex=0;
  }

  enter(levelIndex){
    this.levelIndex = levelIndex ?? 0;
  }

  update(dt){
    this.game.starfield.update(dt);
    const i=this.game.input;

    if(i.enter || i.mouseClicked){
      this.game.setState("PLAY", this.levelIndex);
    }
  }

  draw(ctx){
    const g=this.game;
    const s = STORY[this.levelIndex] ?? STORY[0];

    drawBackground(ctx,g.w,g.h);
    g.starfield.draw(ctx);

    ctx.save();
    ctx.fillStyle=THEME.text;
    ctx.font="28px Arial";
    ctx.fillText(s.title, 360, 180);

    ctx.font="16px Arial";
    s.text.forEach((line,idx)=>{
      ctx.fillText(line, 280, 240 + idx*26);
    });

    ctx.fillStyle=THEME.textDim;
    ctx.fillText("Entrée / Clic : Continuer", 360, 420);
    ctx.restore();
  }
}
