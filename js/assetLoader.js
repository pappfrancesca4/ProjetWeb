export const assets = {};

export function loadAssets(callback) {
  const toLoad = {
    // Joueur
    playerIdle: "assets/sprites/player/player_idle.png",
    playerRun: "assets/sprites/player/player_run.png", // Si tu as ce sprite, sinon retire la ligne
    playerJump: "assets/sprites/player/player_jump.png",
    playerSlide: "assets/sprites/player/player_slide.png",

    // Ennemis
    enemyBasic: "assets/sprites/enemies/enemy_basic.png",
    enemyShooter: "assets/sprites/enemies/enemy_shooter.png",
    enemyArmored: "assets/sprites/enemies/enemy_armored.png",
    boss: "assets/sprites/enemies/boss.png",

    // Projectiles
    bulletPlayer: "assets/sprites/projectiles/bullet_player.png",
    bulletEnemy: "assets/sprites/projectiles/bullet_enemy.png", // AJOUT CRUCIAL ICI

    // Décors / Tiles
    tileGround: "assets/sprites/tiles/tile_ground.png",
    platformMoving: "assets/sprites/tiles/platform_moving.png",
    spikes: "assets/sprites/tiles/spikes.png",

    // UI / Objets
    doorExit: "assets/sprites/ui/door_exit.png",
    buttonSwitch: "assets/sprites/ui/button_switch.png",
    gateLocked: "assets/sprites/ui/gate_locked.png",

    // FX
    explosion: "assets/sprites/fx/explosion.png",
  };

  const keys = Object.keys(toLoad);
  let loadedCount = 0;
  const total = keys.length;

  if (total === 0) {
    if (callback) callback();
    return;
  }

  keys.forEach((key) => {
    const img = new Image();
    img.src = toLoad[key];
    img.onload = () => {
      loadedCount++;
      assets[key] = img;
      if (loadedCount === total) {
        if (callback) callback();
      }
    };
    img.onerror = () => {
      console.error(`Erreur chargement image: ${toLoad[key]}`);
      loadedCount++; // On continue quand même
      assets[key] = null;
      if (loadedCount === total) {
        if (callback) callback();
      }
    };
  });
}
