(function(root){
  
  root.Player = function(pos) {
  this.pos = pos.plus(new Vector(0,-0.5));
  this.size = new Vector(0.8, 1.5);
  this.speed = new Vector(0, 0);
}

Player.prototype.type = "player";


Player.prototype.moveX = function(step, level, keys) {
  var playerXSpeed = 7;
  this.speed.x = 0;
  if (keys.left) this.speed.x -= playerXSpeed;
  if (keys.right) this.speed.x += playerXSpeed;
  var motion = new Vector(this.speed.x * step, 0);
  var newPos = this.pos.plus(motion);
  var obstacle = level.obstacleAt(newPos, this.size);
  if (obstacle)
    level.playerTouched(obstacle);
  else
    this.pos = newPos;
};

Player.prototype.moveY = function(step, level, keys) {
  var gravity = 30;
  var jumpSpeed = 17;
  this.speed.y += step * gravity;
  var motion = new Vector(0, this.speed.y * step);
  var newPos = this.pos.plus(motion);
  var obstacle = level.obstacleAt(newPos, this.size);
  if (obstacle) {
    level.playerTouched(obstacle);
    if (keys.up && this.speed.y > 0) {
      this.speed.y = -jumpSpeed;
    } else {
      this.speed.y = 0;
    } 
    } else {
      this.pos = newPos;
    }
};

Player.prototype.act = function(step, level, keys) {
  this.moveX(step, level, keys);
  this.moveY(step, level, keys);
  var otherActor = level.actorAt(this);
  console.log(otherActor);
  if (otherActor) {
    level.playerTouched(otherActor.type, otherActor);
  }
  // Losing Animation 
  if (level.status == 'lost') {
    this.pos.y += step;
    this.size.y -= step;
  }
};
})(this)