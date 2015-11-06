# AstromanJsGame
__[http://jmenestr.github.io/astroman](Astroman) is a spacebased sidescroller implemented with vanilia javascript and HTML 5 Canvas.__ 

### Feature Highlights 


* Use Object Oriented Design to modularize display class for rendering on HTML 5 Canvas 

``` javascript 

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
  ....
  ``` 

  * Implements sprite animation for character movement

  ```javascripot 
  // User Sprits and canvas drawImage to animate player character 
  // Give default sprite for jump animation and no movement 
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

``` 

* Takes advantue requestAnimationFrame to keep animations smooth and synced with browser refresh 

```javascript 
  // Keeps track of time between current animation and last animation frames
  // and passes in this timestep to the animateLevel method, which throttles  
  // the maximum timestep to keep accurate collision detections 
  function runAnimation(animateLevel) {
  var lastTime = null;
  function frame(time) {
    var stop = false;
    if (lastTime != null) {
      var timeStep = Math.min(time - lastTime, 100)/1000;
      stop = animateLevel(timeStep);
    }
    lastTime = time;
    if (!stop)
      requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

```

## TODOS

* Implement sound
* Implement other NPC enemy characters
* Implement lasers to destroy said NPCs
