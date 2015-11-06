(function(root){
    var scale = 20; 
    var goo = document.createElement('img');
    var wall = document.createElement('img');
    var star = document.createElement('img');
    goo.src = 'sprites/goo.png';
    wall.src = 'sprites/wall.png';
    star.src = 'sprites/star.png'
    var background = new Image();
    background.src = 'sprites/stars.jpg';

  function flipHorizontally(context, around) {
    context.translate(around, 0);
    context.scale(-1, 1);
    context.translate(-around, 0);
  }

  root.CanvasDisplay = function(parent, level) {
    this.canvas = document.createElement('canvas');
    this.canvas.width = Math.min(600, level.width * scale);
    this.canvas.height = Math.min(450, level.height * scale);

    this.context = this.canvas.getContext('2d');
    parent.appendChild(this.canvas);
    this.level = level;
    this.animationTime = 0;
    this.fireTimer = 0;
    this.flippedPlayer = false;

    this.viewport = {
      left: 0,
      top: 0,
      width: this.canvas.width / scale,
      height: this.canvas.height / scale
    };
    this.drawFrame(0);
  }; 

  CanvasDisplay.prototype.clear = function() {
    this.context.clearRect(0,0, this.canvas.width, this.canvas.height);

  };

  CanvasDisplay.prototype.reset = function() {
    this.canvas.parentNode.removeChild(this.canvas);
  };

  CanvasDisplay.prototype.drawFrame = function(animationTimeStep) {
    this.animationTime += animationTimeStep;
    this.drawViewport();
    this.clear();
    this.drawBackground();
    this.drawMovingElements();
  };

  CanvasDisplay.prototype.drawViewport = function() {
    var view = this.viewport, margin = view.width / 3;
    var player = this.level.player; 
    var center = player.pos.plus(player.size.scale(0.5));

    if (center.x < view.left + margin) {
      view.left = Math.max(center.x - margin, 0);
    } else if (center.x > view.left + view.width - margin) {
      view.left = Math.min(center.x + margin - view.width, 
        this.level.width - view.width )
    }

    if (center.y < view.top + margin) {
      view.top = Math.max(center.y - margin, 0);
    }
    else if (center.y > view.top + view.height - margin) {
      view.top = Math.min(center.y + margin - view.height,
                        this.level.height - view.height);
      }
    };

    CanvasDisplay.prototype.drawPlayer = function(x, y, height, width) {
      var spriteIdx = 5;
      var player = this.level.player;
      var jump = 6;
      var playerImage = document.createElement('img');
      playerImage.src = 'sprites/spaceman.png';
      if (player.speed.x != 0)
        this.flippedPlayer = player.speed.x < 0;

      if (player.speed.y != 0) {
        spriteIdx = jump;
      }

      else if (player.speed.x != 0) {
        var spriteIdx = Math.floor(this.animationTime * 12) % 10;
      }

      this.context.save();
      if (this.flippedPlayer) {
        flipHorizontally(this.context, x + (width + 8) / 2);
      }
      this.context.drawImage(playerImage, 
                        spriteIdx * (width + 8), 0, width + 8, height,
                        x,                 y, width + 8, height);

      this.context.restore();
    };

    CanvasDisplay.prototype.drawMovingElements = function() {
      this.level.actors.forEach(function(actor){
        var actorWidth = actor.size.x * scale;
        var actorHeight = actor.size.y * scale;
        var x = (actor.pos.x - this.viewport.left) * scale;
        var y = (actor.pos.y - this.viewport.top) * scale;
        if (actor.type == 'player') {
          this.drawPlayer(x, y, actorHeight, actorWidth);
        } else if (actor.type == 'star') {
          this.context.drawImage(star,x, y)
        } else {
          this.context.drawImage(goo, x, y);
        }
      }.bind(this))
    }

    CanvasDisplay.prototype.drawBackground = function() {

      var view = this.viewport;
      var xStart = Math.floor(view.left);
      var xEnd = Math.ceil(view.left + view.width);
      var yStart = Math.floor(view.top);
      var yEnd = Math.ceil(view.top + view.height);

        for (var y = yStart; y < yEnd; y++) {
          for (var x = xStart; x < xEnd; x++) {
            var tile = this.level.grid[y][x];
            if (tile == null) continue;
            var screenX = (x - view.left) * scale;
            var screenY = (y - view.top) * scale;
            if( tile == "goo") {      
              this.context.drawImage(goo, 0, 0, scale, scale, screenX, screenY, scale, scale); 
            } else {
              this.context.drawImage(wall, 0, 0, scale, scale, screenX, screenY, scale, scale);
                                           
            }
          }
        }
};
    
})(this)