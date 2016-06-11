function Canvas(id) {
  this.canvas = $id(id);
  this.canvas.width = $("#canvas-block").width();
  this.canvas.height = this.canvas.width / 1.57;
  console.log(this.canvas.width);
  console.log(this.canvas.height);
  // var size = this.canvas.getBoundingClientRect();
  var mainRect = new Rect(0, 0, this.canvas.width, this.canvas.height);
  this.root = new MyNode(this, mainRect, null);

  //  ON HOVER:
  // this.canvas.addEventListener("mousemove", this.onHover.bind(this));
  //  CONTEX MENU:
  this.canvas.addEventListener("contextmenu", this.contextMenu.bind(this));
  //  SHOW SLIDER:
  this.canvas.addEventListener("click", this.showSlider.bind(this));
  //  DRAG & DROP:
  this.canvas.addEventListener("dragover",  this.dragOver.bind(this), false);
  this.canvas.addEventListener("dragleave", this.dragLeave.bind(this), false);
  this.canvas.addEventListener("drop",      this.drop.bind(this), false);
}

Canvas.prototype.dragOver = function (e) {
  e.stopPropagation();
  // e.preventDefault();
  e.preventDefault ? e.preventDefault() : (e.returnValue = false);

  hideAllSliders();
  var pos = getMousePos(this.canvas, e);
  var node = this.root.findLeafForPoint(pos.x, pos.y);
  if (this.activeNode == node) { return; }
  this.activeNode = node;
  this.redrawCanvas();
  node.onDragOver();
}

Canvas.prototype.dragLeave = function (e) {
  // e.preventDefault();
  e.preventDefault ? e.preventDefault() : (e.returnValue = false);

}

Canvas.prototype.drop = function (e) {
  e.stopPropagation();
  // e.preventDefault();
  e.preventDefault ? e.preventDefault() : (e.returnValue = false);

  var pos = getMousePos(this.canvas, e);
  var node = this.root.findLeafForPoint(pos.x, pos.y);
  var imgId = e.dataTransfer.getData("text");
  var img = $id(imgId);
  // console.log(img);
  this.redrawCanvas();
  node.dropImage(img);
}

Canvas.prototype.showSlider = function(e) {
  var pos = getMousePos(this.canvas, e);
  var node = this.root.findLeafForPoint(pos.x, pos.y);
  node.showSlider(e);
}

Canvas.prototype.onHover = function(e) {
  var pos = getMousePos(this.canvas, e);
  var node = this.root.findLeafForPoint(pos.x, pos.y);
  this.redrawCanvas();
  node.highlight();
}

Canvas.prototype.contextMenu = function(e) {
  // e.preventDefault();
  e.preventDefault ? e.preventDefault() : (e.returnValue = false);
  hideAllMenu(e);
  hideAllSliders(e);
  var pos = getMousePos(this.canvas, e);
  var node = this.root.findLeafForPoint(pos.x, pos.y);
  this.redrawCanvas();
  node.highlight();
  node.showMenu(e);
}

Canvas.prototype.getWidth = function() {
  return this.canvas.getBoundingClientRect().width;
}

Canvas.prototype.getHeight = function() {
  return this.canvas.getBoundingClientRect().height;
}

Canvas.prototype.redrawCanvas = function() {
  var ctx = this.canvas.getContext("2d");
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, this.getWidth(), this.getHeight());
  this.redrawSeparators(this.root);
  this.redrawImages(this.root);
}

Canvas.prototype.drawSeparatorLine = function(ctx, node) {
  ctx.setLineDash([]);
  ctx.beginPath();
  if (node.separationAxis == "x") {
    ctx.moveTo(node.separationValue, node.rect.y);
    ctx.lineTo(node.separationValue, node.rect.y + node.rect.height);
  } else if (node.separationAxis == "y") {
    ctx.moveTo(node.rect.x, node.separationValue);
    ctx.lineTo(node.rect.x + node.rect.width, node.separationValue);
  }
  ctx.strokeStyle = "#fff";
  ctx.stroke();
}

Canvas.prototype.redrawSeparators = function(node) {
  if (node.isLeaf()) {
    return;
  }
  // draw line
  var ctx = this.canvas.getContext("2d");
  this.drawSeparatorLine(ctx,node);
  // recursivelly for the rest
  this.redrawSeparators(node.left);
  this.redrawSeparators(node.right);
}

Canvas.prototype.redrawImages = function(node) {
  // draw line
  var ctx = this.canvas.getContext("2d");
  node.drawImage();
  // recursivelly for the rest
  if (!node.isLeaf()) {
    this.redrawImages(node.left);
    this.redrawImages(node.right);
  }
}
