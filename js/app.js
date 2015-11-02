(function(root){
  var $start = $('#start-game');
  $(document).on('keydown', function(e) {
    if (e.keyCode == 13) {
      $start.hide();
      $(document).off('keydown');
      startGame();
    }
  });
})(this)