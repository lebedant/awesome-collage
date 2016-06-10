function Grid(context) {
  this.ctx = context;
}

Grid.prototype.on = function() {
  var can = this.ctx.canvas;
  for (var x = 0; x < can.clientWidth; x += 20) {
    this.ctx.moveTo(x, 0);
    this.ctx.lineTo(x, can.clientHeight);
  }

  for (var y = 0; y < can.clientHeight; y += 20) {
    this.ctx.moveTo(0, y);
    this.ctx.lineTo(can.clientWidth, y);
  }

  this.ctx.strokeStyle = "#256600";
  // this.ctx.fillStyle = "";
  this.ctx.stroke();
}

Grid.prototype.off = function() {
  
}
