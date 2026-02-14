import Tile from "../entities/Tile.js";
import PlatformOneWay from "../entities/PlatformOneWay.js";
import Enemy from "../entities/Enemy.js";
import Door from "../entities/Door.js";
import Hazard from "../entities/Hazard.js";
import MovingPlatform from "../entities/MovingPlatform.js";
import Button from "../entities/Button.js";
import Gate from "../entities/Gate.js";

import { TILE } from "./levels.js";

export function buildLevel(level) {
  const tiles = [];
  const oneWayPlatforms = [];
  const solids = [];
  const enemies = [];
  const hazards = [];
  const movingPlatforms = [];
  const buttons = [];
  const gates = [];

  let door = null;
  let playerSpawn = { x: 100, y: 100 };

  for (let row = 0; row < level.map.length; row++) {
    const line = level.map[row];
    for (let col = 0; col < line.length; col++) {
      const ch = line[col];
      const x = col * TILE;
      const y = row * TILE;

      if (ch === "#") {
        const t = new Tile(x, y, TILE);
        tiles.push(t);
        solids.push({ x, y, w: TILE, h: TILE });
      }

      if (ch === "=") {
        const p = new PlatformOneWay(x, y, TILE);
        oneWayPlatforms.push(p);
        solids.push({ x, y, w: TILE, h: 10, isOneWay: true });
      }

      if (ch === "P") {
        playerSpawn = { x, y: y - 60 };
      }

      if (ch === "E") {
        enemies.push(new Enemy(x, y - 8, "ground"));
      }

      if (ch === "D") {
        door = new Door(x, y - 24);
      }

      if (ch === "^") {
        hazards.push(new Hazard(x, y + 18, TILE, TILE - 18));
      }

      if (ch === "M") {
        const mp = new MovingPlatform(x, y, TILE, 18, x - 120, x + 120);
        movingPlatforms.push(mp);
        solids.push({
          x: mp.x,
          y: mp.y,
          w: mp.w,
          h: mp.h,
          ref: mp,
          isOneWay: true,
        });
      }

      if (ch === "B") {
        buttons.push(new Button(x + 10, y + 30));
      }

      if (ch === "G") {
        const gate = new Gate(x, y - 48);
        gates.push(gate);
        solids.push({
          x: gate.x,
          y: gate.y,
          w: gate.w,
          h: gate.h,
          ref: gate,
          isGate: true,
        });
      }
    }
  }

  return {
    tiles,
    oneWayPlatforms,
    solids,
    enemies,
    hazards,
    door,
    playerSpawn,
    movingPlatforms,
    buttons,
    gates,
  };
}
