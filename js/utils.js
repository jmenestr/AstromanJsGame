(function(root){
//Helpers 

root.Vector = function(x,y) {
  this.x = x;
  this.y = y;
};

Vector.prototype.plus = function(other_vector) {
  return new Vector(this.x + other_vector.x, this.y + other_vector.y);
};

Vector.prototype.minus = function(other_vector) {
  return new Vector(this.x - other_vector.x, this.y - other_vector.y);
};

Vector.prototype.scale = function(factor) {
  return new Vector(factor*this.x, factor*this.y);
};



})(this)