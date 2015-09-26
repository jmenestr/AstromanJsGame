//Helpers 

function Vector(x,y) {
  this.x = x;
  this.y = y;
}

Vector.prototype.plus = function(other_vector) {
  return new Vector(this.x + other_vector.x, this.y + other_vector.y);
}

Vector.prototype.minus = function(other_vector) {
  return new Vector(this.x - other_vector.x, this.y - other_vector.y);
}

Vector.prototype.scale = function(factor) {
  return new Vector(factor*this.x, factor*this.y);
}

// Display Function 


function elt(name, className) {
  var elt = document.createElement(name);
  if (className) elt.className = className;
  return elt;
}

function DOMDisplay(parent, level) {
  this.wrap = parent.appendChild(elt('div', 'game'));
  this.level = level;

  this.wrap.appendChild(this.drawBackground());
  this.actorLayer = null;
  this.drawFrame();
}

DOMDisplay.prototype.drawBackground = function() {
  var scale = 20;
  var table = elt("table","background");
  table.style.width = this.level.width * scale + "px";
  this.level.grid.forEach(function(row){
    var rowEle = table.appendChild(elt('tr'));
    rowEle.style.height = scale + "px";
    row.forEach(function(type) {
      rowEle.appendChild(elt("td", type));
    });
  });
  return table;
};

DOMDisplay.prototype.drawActors = function() {
  var wrap = elt("div");
  var scale = 20;
  this.level.actors.forEach(function(actor){
    var rect = wrap.appendChild(elt("div","actor "+ actor.type));
    rect.style.height = actor.size.y * scale + "px";
    rect.style.width = actor.size.x * scale + "px";
    rect.style.top = actor.pos.y * scale + "px";
    rect.style.left = actor.pos.x * scale + "px";
  });
  return wrap;
}

DOMDisplay.prototype.drawFrame = function() {
  var scale = 20;
  if(this.actorLayer)
    this.wrap.removeElement(this.actorLayer);
  this.actorLayer = this.wrap.appendChild(this.drawActors());
  this.wrap.className = "game" + (this.level.status || "");
  this.scrollPlayerIntoView();
};

DOMDisplay.prototype.scrollPlayerIntoView = function() {
  var scale = 20;
  var width = this.wrap.clientWidth;
  var height = this.wrap.clientHeight;

  var margin = width / 3;

  var left = this.wrap.scrollLeft, right = left + width;
  var top = this.wrap.scrollTop, bottom = top + height;

  var player = this.level.player;
  var center = player.pos.plus(player.size.scale(0,5)).scale(scale);

  if (center.x < left + margin) {
    this.wrap.scrollLeft = center.x - margin;
  } else if (center.x > right + margin - width) {
    this.wrap.scrollLeft = center.x + margin - width;
  } else if (center.y < top + margin) 
      this.wrap.scrollTop = center.y - margin; 
    else if (center.y > bottom - margin) 
      this.wrap.scrollTop = center.y + margin - height;
};

//Actor Classes 

function Player(pos) {
  this.pos = pos.plus(new Vector(0,-0.1));
  this.size = new Vector(0.8, 1.5);
  this.speed = new Vector(0, 0);
}

Player.prototype.type = "player";

function Lava(pos, char) {
  this.pos = pos.plus(new Vector(0.75, 0.75));
  this.size = new Vector(1, 1);
  if (char === "=") {
    this.speed = new Vector(0, 1);
  }
  else if (char ==="|") {
    this.speed = new Vector(-1, 0);
  }
  else if (char==="v") {
    this.speed = new Vector(0,3);
    this.repeatPos = this.pos;
  }
  this.type = "lava";
}

function Coin(pos) {
  this.basePos = this.pos = pos.plus(new Vector(0.6, 0.1));
  this.size = new Vector(0.6, 0.6); 
  this.wobble = Math.random() * Math.PI * 2;
  this.type = "coin";
}

// Level Constructor 

function Level(plan) {
  this.width = plan[0].length;
  this.height = plan.length; 
  this.grid = [];
  this.actors = [];
  this.actorChars = {
    "@": Player,
    "o": Coin,
    "=": Lava, "|": Lava, "v": Lava
  };

  for (var y = 0; y < this.height; y++) {
    var row = plan[y], gridLine = [];
    for(var x = 0; x < this.width; x++) {
      var char = row[x], type = null;
      var Actor = this.actorChars[char];
      // "Initialize all moving charactrs in a seperate actors array"
      if (Actor) {
        this.actors.push(new Actor(new Vector(x,y),char));
      } else if (char === 'x') {
          type = "wall";
      } else if (char ==='!') {
          type = "lava";
      }
        gridLine.push(type);
    }
    this.grid.push(gridLine);
  }

  var player = null;
   this.actors.forEach(function(actor) {
    if (actor.type == 'player')
      player = actor;
  });
   this.player = player;

  this.status = this.finishDelay = null;
}

Level.prototype.isFinsihed = function() {
  return this.status != null && this.finishDelay < 0;
};

var simpleLevel = [
"          ",
"     o    ",
"    xxx   ",
"       =  ",
"x        o",
"x @      x",
"xxxx!!!!!x",
"  x!!!!!!x",
];

var game = new Level(simpleLevel);
var display = new DOMDisplay(document.body, game);

