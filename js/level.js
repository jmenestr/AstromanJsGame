(function(root){

  root.Level = function(plan) {
  this.width = plan[0].length;
  this.height = plan.length; 
  this.grid = [];
  this.actors = [];
  this.actorChars = {
    "@": Player,
    "*": Star,
    "=": Goo, "|": Goo, "v": Goo
  };

  for (var y = 0; y < this.height; y++) {
    var row = plan[y], gridLine = [];
    for(var x = 0; x < this.width; x++) {
      var char = row[x], type = null;

      var Actor = this.actorChars[char];
      if (Actor) {
        this.actors.push(new Actor(new Vector(x,y),char));
      } else if (char === '#') {
          type = "wall";
      } else if (char ==='!') {
          type = "goo";
      }
        gridLine.push(type);
    }
    this.grid.push(gridLine);
  }

   this.player = this.actors.filter(function(actor) {
      if(actor.type == 'player') return actor;
  })[0];


  this.status = this.finishDelay = null;
}

Level.prototype.obstacleAt = function(pos, size) {
  var xStart = Math.floor(pos.x);
  var xEnd = Math.ceil(pos.x + size.x);
  var yStart = Math.floor(pos.y);
  var yEnd = Math.ceil(pos.y + size.y);
  if (xStart < 0 || xEnd > this.width || yStart < 0) {
    return 'wall';
  } else if (yEnd > this.height) {
    return 'goo';
  } 
  for (var y = yStart; y < yEnd; y++) {
    for (var x = xStart; x < xEnd; x++) {
      var fieldType = this.grid[y][x];
      if (fieldType) return fieldType;
    }
  }
};

Level.prototype.actorAt = function(actor) {
  for (var i = 0; i < this.actors.length; i++) {
    var other = this.actors[i];
    if (actor !== other && 
      actor.pos.x + actor.size.x > other.pos.x &&
      actor.pos.x < other.pos.x + other.size.x &&
      actor.pos.y + actor.size.y > other.pos.y &&
      actor.pos.y < other.pos.y + other.size.y ) {
      return other;
    }
  }
};
Level.prototype.animate = function(step, keys) {
  var maxStep = 0.05;
  if (this.status != null) {
    this.finishDelay -= step;
  }

  while (step > 0) {
    var thisStep = Math.min(step, maxStep);
    this.actors.forEach(function(actor) {
      actor.act(thisStep, this, keys)
    }, this);
    step -= thisStep;
  }
};

Level.prototype.playerTouched = function(type, actor) {
  if (type == 'goo' && this.status == null) {
    this.status = 'lost';
    this.finishDelay = 1;
  } else if (type == 'star') {
    displayScore();
    this.actors = this.actors.filter(function(other){
      return other != actor;
    });
    if (!this.actors.some(function(actor){
      return actor.type == 'star';
    })) {
      this.status = 'won';
      this.finishDelay = 1;
    }
  }
};




Level.prototype.isFinished = function() {
  return this.status != null && this.finishDelay < 0;
};

})(this)