export default class ObjetGraphique {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.dead = false;
  }
  update(dt) {}
  draw(ctx, cameraX) {}
}
