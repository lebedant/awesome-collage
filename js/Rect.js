function Rect(x, y, width, height) {
	this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
}

Rect.prototype.clone = function() {
  return new Rect(this.x, this.y, this.width, this.height);
}
