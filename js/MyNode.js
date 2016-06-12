function MyNode(canvas, rect, parent) {
	this.left = null;
  this.right = null;
	this.parent = parent;
  this.separationAxis = null;
  this.separationValue = null;
  this.rect = rect;
	this.collage = canvas;
  this.canvas = canvas.canvas;
	this.image = null;
  // create CONTEX MENU
	this.contextmenu = document.createElement("ul");
	this.contextmenu.className = "hide c_menu";
	// BY 'X'
	var by_x = document.createElement('li');
	by_x.innerHTML = "Divide horizontally";
	// BY 'Y'
	var by_y = document.createElement('li');
	by_y.innerHTML = "Divide vertically";
	// DELETE
	var del = document.createElement('li');
	del.innerHTML = "Delete node";

	this.contextmenu.appendChild(by_x);
	this.contextmenu.appendChild(by_y);
	this.contextmenu.appendChild(del);
	var parent = kaj.$id("collage");
	parent.appendChild(this.contextmenu);

	by_x.addEventListener("click", this.split.bind(this, "x", 0.5));
	by_y.addEventListener("click", this.split.bind(this, "y", 0.5));
	del.addEventListener("click", this.delete.bind(this));
}

MyNode.prototype.split = function(separationAxis, separationValue) {
	if (this.image != null) this.image = null;
	this.separationAxis = separationAxis;
  // this.separationValue = separationValue;
  var ctx = this.canvas.getContext("2d");
  // Calculate rectangles
  var leftRect = this.rect.clone();
  var rightRect = this.rect.clone();

  if (separationAxis == "x") {
    this.separationValue = this.rect.x + separationValue * this.rect.width;
    leftRect.width = this.rect.width * separationValue;
    rightRect.x = this.rect.x + leftRect.width; // left part
		rightRect.width = this.rect.width - leftRect.width;
  } else if (separationAxis == "y") {
    this.separationValue = this.rect.y + separationValue * this.rect.height;
    leftRect.height = this.rect.height * separationValue; // top part
    rightRect.y = this.rect.y + leftRect.height;
		rightRect.height = this.rect.height - leftRect.height;
  }
  this.left = new MyNode(this.collage, leftRect, this);
  this.right = new MyNode(this.collage, rightRect, this);
	// slider
	this.createSlider(separationValue);
	this.collage.redrawCanvas();
}

MyNode.prototype.showSlider = function(e) {
	kaj.hideAllSliders(e);
	if (this.parent == null || this.parent.slider == null) return;
	this.parent.slider.classList.remove("hide");
	this.parent.slider.classList.add("show");
}

MyNode.prototype.createSlider = function(value) {
	if (this.slider != null) return;
	this.slider = document.createElement("input");
	this.slider.className = "slider show";
	this.slider.type = "range";
	this.slider.min = 0;
	this.slider.max = 1;
	this.slider.step = 0.01;
	if (this.separationAxis == "x") {
		this.slider.value = value;
		this.slider.classList.add("horizontal");
		this.slider.style.width = this.rect.width + "px";
		this.slider.style.top = this.rect.y + this.rect.height - 10 + "px";
		this.slider.style.left = this.rect.x + "px";
	} else {
		this.slider.value = 1 - value;
		this.slider.classList.add("vertical");
		this.slider.style.height = this.rect.height + "px";
		this.slider.style.top = this.rect.y + "px";
		this.slider.style.left = this.rect.x + "px";
	}
	this.slider.addEventListener("change", this.changeSeparation.bind(this, this.separationAxis));
	var parent = kaj.$id("canvas-block");
	parent.appendChild(this.slider);
}

MyNode.prototype.changeSeparation = function(axis) {
	var val = 0;
	if (axis == "x") {
		val = this.slider.value;
	} else {
		// because of axis direction (slider vs. canvas)
		val = 1 - this.slider.value;
	}
	this.updateSeparation(this.separationAxis, val);
	// update rect sizes
	this.left.updateValues();
	this.right.updateValues();
	// update slider's sizes and position
	this.left.updateSlider();
	this.right.updateSlider();
	// redraw all canvas with new values
	this.collage.redrawCanvas();
}

MyNode.prototype.delete = function() {
	var parent = this.parent;
	parent.left = null;
  parent.right = null;
  parent.separationAxis = null;
  parent.separationValue = null;
	parent.slider = null;
	this.collage.redrawCanvas();
}

MyNode.prototype.updateSeparation = function(axis, value) {
	if (axis == "x") {
    this.separationValue = this.rect.x + this.rect.width * value;
    this.left.rect.width = this.rect.width * value;
    this.right.rect.x = this.rect.x + this.left.rect.width; // left part
		this.right.rect.width = this.rect.width - this.left.rect.width;
  } else if (axis == "y") {
    this.separationValue = this.rect.y + this.rect.height * value;
    this.left.rect.height = this.rect.height * value; // top part
    this.right.rect.y = this.rect.y + this.left.rect.height;
		this.right.rect.height = this.rect.height - this.left.rect.height;
  }
}

MyNode.prototype.updateValues = function() {
	if (this.isLeaf()) return;
	this.left.rect.x = this.rect.x;
	this.left.rect.y = this.rect.y;
	if (this.separationAxis == "x") {
		this.left.rect.width = this.separationValue - this.rect.x;
		this.left.rect.height = this.rect.height;
		this.right.rect.y = this.rect.y;
		this.right.rect.height = this.rect.height;
		this.right.rect.width = this.rect.width - this.left.rect.width;
	} else if (this.separationAxis == "y") {
		this.left.rect.height = this.separationValue - this.rect.y;
		this.left.rect.width = this.rect.width;
		this.right.rect.x = this.rect.x;
		this.right.rect.width = this.rect.width;
		this.right.rect.height = this.rect.height - this.left.rect.width;
	}
	// recursion
	this.left.updateValues();
	this.right.updateValues();
}

MyNode.prototype.updateSlider = function() {
	if (this.isLeaf()) return;
	if (this.separationAxis == "x") {
		this.slider.style.width = this.rect.width + "px";
		this.slider.style.top = this.rect.y + this.rect.height - 10 + "px";
		this.slider.style.left = this.rect.x + "px";
	} else if (this.separationAxis == "y") {
		this.slider.style.height = this.rect.height + "px";
		this.slider.style.top = this.rect.y + "px";
		this.slider.style.left = this.rect.x + "px";
	}
	// recursion
	this.left.updateSlider();
	this.right.updateSlider();
}

MyNode.prototype.isLeaf = function() {
  return !this.left && !this.right;
}

MyNode.prototype.findLeafForPoint = function(x, y) {
  // If leaf, return this
  if (this.isLeaf()) {
    return this;
  }
  // Find the leaf which the point might belong to
  // and recursivelly call return findLeafForPoint()
  if (this.separationAxis == "x") {
    if (x <= this.separationValue) {
      return this.left.findLeafForPoint(x,y);
    } else {
      return this.right.findLeafForPoint(x,y);
    }
  } else if (this.separationAxis == "y") {
    if (y <= this.separationValue) {
      return this.left.findLeafForPoint(x,y);
    } else {
      return this.right.findLeafForPoint(x,y);
    }
  }
}

MyNode.prototype.onDragOver = function() {
	var ctx = this.canvas.getContext("2d");
	var x1 = this.rect.x;
	var x2 = this.rect.width;
	var y1 = this.rect.y;
	var y2 = this.rect.height;
	ctx.setLineDash([5, 2]);
	ctx.strokeStyle="#02bfbf";
	ctx.strokeRect(x1+5,y1+5,x2-10,y2-10);
}

MyNode.prototype.highlight = function() {
	var ctx = this.canvas.getContext("2d");
	var x1 = this.rect.x;
	var x2 = this.rect.width;
	var y1 = this.rect.y;
	var y2 = this.rect.height;
	ctx.fillStyle="#222222";
	ctx.fillRect(x1,y1,x2-1,y2-1);
}

MyNode.prototype.dropImage = function(img) {
	this.image = img;
	this.drawImage();
}

MyNode.prototype.drawImage = function() {
	if (this.image == null) return;
	var ctx = this.canvas.getContext("2d");
	var offset = 2; // borders
	var dx = this.rect.x; //
	var dy = this.rect.y;
	var dWidth = this.rect.width;
	var dHeight = this.rect.height;

	var imageAspectRatio = this.image.naturalWidth / this.image.naturalHeight;
	var canvasAspectRatio = this.rect.width / this.rect.height;
	var xStart, yStart;

	// If image's aspect ratio is less than canvas's we fit on height
	// and place the image centrally along width
	if(imageAspectRatio > canvasAspectRatio) {
		var aconst = (this.rect.height / this.image.naturalHeight);
		var newImageWidth = this.image.naturalWidth * aconst;
		xStart = ((newImageWidth - this.rect.width) / 2) / aconst;
		yStart = 0;
	}
	// If image's aspect ratio is greater than canvas's we fit on width
	// and place the image centrally along height
	else if(imageAspectRatio < canvasAspectRatio) {
		var aconst = (this.rect.width / this.image.naturalWidth);
		var newImageHeight = this.image.naturalHeight * aconst;
		xStart = 0;
		yStart = ((newImageHeight - this.rect.height) / 2) / aconst;
	}
	// Happy path - keep aspect ratio
	else {
		renderableHeight = this.rect.height;
		renderableWidth = this.rect.width;
		xStart = 0;
		yStart = 0;
	}
	ctx.drawImage(this.image, xStart, yStart, this.image.naturalWidth - 2*xStart, this.image.naturalHeight - 2*yStart, dx+offset, dy+offset, dWidth-2*offset, dHeight-2*offset);
}

MyNode.prototype.showMenu = function(event) {
	this.contextmenu.classList.remove("hide");
	this.contextmenu.classList.add("show");
	this.contextmenu.style.top =  kaj.mouseY(event) + "px";
	this.contextmenu.style.left = kaj.mouseX(event) + "px";
}
