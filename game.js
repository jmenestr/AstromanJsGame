(function(root) {


var keyCodes = {37: 'left', 38: 'up', 39: 'right'};

var _lives, _score;
var _score


  var $score = $('.score'), $lives = $('.lives');

  root.displayScore = function() {
     _score += 10;
    var text = "Score: " + _score ;
    $score.text(text);
  };

  root.displayLives = function(lives) {
    var text = "Lives: " + lives
    $lives.text(text);
  };

  root.startGame = function(lives) {
    _lives = lives || 3;
    _score = -10;
    runGame(LEVELS, CanvasDisplay);
  };

function trackKeys(codes) {
  var pressed = Object.create(null);
  function handler(event) {
    if (codes.hasOwnProperty(event.keyCode)) {
      var down = event.type == 'keydown';
      pressed[codes[event.keyCode]] = down;
      event.preventDefault();
    }
  }
  addEventListener('keydown', handler);
  addEventListener('keyup', handler);
  return pressed;
};

  function gameOver() {
    $over = $('#game-over');
    $over.show();
     $(document).on('keydown', function(e) {
    if (e.keyCode == 13) {
      $over.hide();
      $(document).off('keydown');
      startGame();
    }
  });
  };

  function gameWon() {
    $won = $('#game-won');
    $won.show();
     $(document).on('keydown', function(e) {
    if (e.keyCode == 13) {
      $won.hide();
      $(document).off('keydown');
      startGame(lives = 1);
    }
  });
  };

  function readyNextLevel(startLevel, level) {
    $next = $("#next-level")
    $next.show();
    window.setTimeout(function() {
      $next.hide();
      startLevel(level + 1);
    },2000)

  }

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

var arrows = trackKeys(keyCodes);

function runLevel(level, Display, endCallback) {
  var display = new Display(document.getElementById('game'), level);
  runAnimation(function(step) {
    level.animate(step, arrows);
    display.drawFrame(step);
    if (level.isFinished()) {
      display.reset();
      if (endCallback) {
        endCallback(level.status);
      }
      return true;
    }
    return false;
  });
};

 function runGame(plans, Display) {
      displayLives(_lives);
      displayScore();
  function startLevel(n) {
    runLevel(new Level(plans[n]), Display, function(status) {
      if (status == 'lost') {
        _lives -= 1;
        if (status == 'lost' && _lives > 0)  {
          displayLives(_lives);
          startLevel(n);
        } else if (status == 'lost' && _lives == 0) {
          gameOver();
        }
      }
      else if (n < plans.length - 1) {
        readyNextLevel(startLevel, n);
      }
      else {
        gameWon();
      }
    });
  }
  startLevel(0);
};


})(this)

