(function(root){
  var $score = $('score');
  var $lives = $('lives');

  root.displayScore = function(score) {
    $score.innerHTML = score;
  };

  root.displayLives = function(lives) {
    $lives.innerHTML = lives
  };

})(this)