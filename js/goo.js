
(function(root){

  root.Goo = function (pos, char) {
    this.pos = pos
    this.size = new Vector(1, 1);
    if (char === "=") {
      this.speed = new Vector(2, 0);
    }
    else if (char === "|") {
      debugger;
      this.speed = new Vector(0, -2);
    }
    else if (char==="v") {
      this.speed = new Vector(0,3);
      this.repeatPos = this.pos;
    }
    this.type = "goo";
  }

  Goo.prototype.act = function(step, level) {
    var newPos = this.pos.plus(this.speed.scale(step));
    if (!level.obstacleAt(newPos, this.size))
      this.pos = newPos;
    else if (this.repeatPos)
      this.pos = this.repeatPos
    else
      this.speed = this.speed.scale(-1);
  };

})(this)