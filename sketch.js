var END = 0,
  PLAY = 1;
var tower, towerImage;
var climberImage;
var doorImage;
var doorsGroup, climbersGroup;
var ghost, ghost_jumping, ghost_standing;
var gameState = PLAY;
var gameOverImage, gameOver;

function preload() {
  towerImage = loadImage("tower.png");
  doorImage = loadImage("door.png");
  climberImage = loadImage("climber.png");
  ghost_standing = loadImage("ghost-standing.png");
  ghost_jumping = loadImage("ghost-jumping.png");
  gameOverImage = loadImage("gameOver.png");
}


function setup() {
  createCanvas(600, 600);
  tower = createSprite(300, 300, 10, 10);
  tower.addImage(towerImage);
  tower.velocityY = 1;
  doorsGroup = createGroup();
  climbersGroup = createGroup();
  ghost = createSprite(300, 300, 10, 10);
  ghost.addImage(ghost_standing);
  ghost.scale = 0.4;
  gameOver = createSprite(300, 300);
  gameOver.addImage(gameOverImage);
  gameOver.visible = false;
}


function draw() {
  background("white");
  if (gameState === PLAY) {
    if (tower.y > 400) {
      tower.y = 300;
    }
    if (keyWentDown("space")) {
      ghost.velocityY = -10;
      ghost.addImage(ghost_jumping);
    }
    if (keyWentUp("space")) {
      ghost.addImage(ghost_standing);
    }
    if (keyDown("right")) {
      ghost.x += 4;
    }
    if (keyDown("left")) {
      ghost.x -= 4;
    }
    climbersGroup.setVelocityYEach(1);
    doorsGroup.setVelocityYEach(1);
  }
  ghost.velocityY = ghost.velocityY + 0.8;
  spawnDoors();

  for (var i = 0; i < climbersGroup.length; i++) {
    if (climbersGroup.get(i).isTouching(ghost)) {
      if (climbersGroup.get(i).y < ghost.y) {
        gameState = END;
      } else if (climbersGroup.get(i).y > ghost.y) {
        ghost.collide(climbersGroup.get(i));
      }
    }
  }
  if (gameState === END) {
    ghost.visible = false;
    doorsGroup.visible = false;
    climbersGroup.visible = false;
    tower.visible = false;
    doorsGroup.destroyEach();
    climbersGroup.destroyEach();
    doorsGroup.setVelocityEach(0);
    climbersGroup.setVelocityEach(0);
    gameOver.visible = true;
  }

  drawSprites();
}

function spawnDoors() {
  if (frameCount % 200 === 0) {
    var door = createSprite(random(120, 480), -50, 10, 10);
    door.addImage(doorImage);
    door.velocityY = tower.velocityY;
    door.lifetime = 650;
    doorsGroup.add(door);
    var climber = createSprite(120, 10, 10, 10);
    climber.addImage(climberImage);
    climber.x = door.x;

    climber.lifetime = 650;
    climbersGroup.add(climber);
    ghost.depth = door.depth++;
  }
}