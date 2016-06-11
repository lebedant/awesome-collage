function $id(id) {
  return document.getElementById(id);
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
}

function hideAllMenu(e) {
  // e.preventDefault();
  var list = document.querySelectorAll(".c_menu");
  for (var item of list) {
    item.classList.remove("show");
    item.classList.add("hide");
  }
}

function hideAllSliders(e) {
  var list = document.querySelectorAll(".slider");
  for (var item of list) {
    item.classList.remove("show");
    item.classList.add("hide");
  }
}

function mouseX(evt) {
  if (evt.pageX) {
    return evt.pageX;
  } else if (evt.clientX) {
    return evt.clientX + (document.documentElement.scrollLeft ?
         document.documentElement.scrollLeft :
         document.body.scrollLeft);
  } else {
    return null;
  }
}

function mouseY(evt) {
  if (evt.pageY) {
    return evt.pageY;
  } else if (evt.clientY) {
    return evt.clientY + (document.documentElement.scrollTop ?
     document.documentElement.scrollTop :
     document.body.scrollTop);
  } else {
    return null;
  }
}

function download(e) {
  // e.preventDefault();
  e.preventDefault ? e.preventDefault() : (e.returnValue = false);
  var img_src = canvas.canvas.toDataURL("image/jpeg", 1.0);
  var ah = document.createElement("a");
  ah.href = img_src;
  ah.target = "_blank";
  ah.click();
}

function fileSelectHandler(e) {
  // e.preventDefault();
  e.preventDefault ? e.preventDefault() : (e.returnValue = false);
  var files = e.target.files || e.dataTransfer.files;
  for (var i = 0, f; f = files[i]; i++) {
    var reader = new FileReader();
    reader.onload = (function(file) {
      return function(e) {
        var thumb = document.createElement("img");
        thumb.src = e.target.result;
        thumb.id = file.name;
        thumb.height = 100;
        thumb.draggable = "true";
        thumb.className = "thumb";

        $('#file.name').draggable();
        thumb.addEventListener("dragstart",function(ev) {
          ev.dataTransfer.setData("text", ev.target.id);
        });
        var text = document.querySelector("#photos .placeholder");
        text.classList.add("hide");
        var cont = $id("scroll");
        cont.insertBefore(thumb, cont.firstChild);
        $id("photos").className = "";
      };
    })(f);
    reader.readAsDataURL(f);
  }
}
