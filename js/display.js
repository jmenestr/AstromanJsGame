//Dom Display Class// 
//

(function(root){
function elt(name, className) {
  var elt = document.createElement(name);
  if (className) elt.className = className;
  return elt;
}

 root.DOMDisplay = function(parent, level) {
  this.wrap = parent.appendChild(elt('div', 'game'));
  this.level = level;

  this.wrap.appendChild(this.drawBackground());
  this.actorLayer = null;
  this.drawFrame();
};

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
};

DOMDisplay.prototype.drawFrame = function() {
  var scale = 20;
  if(this.actorLayer)
    this.wrap.removeChild(this.actorLayer);
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
  var center = player.pos.plus(player.size.scale(0.5)).scale(scale);

  if (center.x < left + margin) {
    this.wrap.scrollLeft = center.x - margin;
  } else if (center.x > right + margin - width) {
    this.wrap.scrollLeft = center.x + margin - width;
  } else if (center.y < top + margin) 
      this.wrap.scrollTop = center.y - margin; 
    else if (center.y > bottom - margin) 
      this.wrap.scrollTop = center.y + margin - height;
};

DOMDisplay.prototype.clear = function() {
  this.wrap.parentNode.removeChild(this.wrap);
};
})(this)

