var kaj = {

  $id: function(id) {
    return document.getElementById(id);
  },

  getMousePos: function(canvas, evt) {
      var rect = canvas.getBoundingClientRect();
      return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
      };
  },

  hideAllMenu: function(e) {
    // e.preventDefault();
    var list = document.querySelectorAll(".c_menu");
    for(var i = 0, item; item = list[i]; i++){
      item.classList.remove("show");
      item.classList.add("hide");
    }
  },

  hideAllSliders: function(e) {
    var list = document.querySelectorAll(".slider");
    for(var i = 0, item; item = list[i]; i++){
      item.classList.remove("show");
      item.classList.add("hide");
    }
  },

  mouseX: function (evt) {
    if (evt.pageX) {
      return evt.pageX;
    } else if (evt.clientX) {
      return evt.clientX + (document.documentElement.scrollLeft ?
        document.documentElement.scrollLeft :
        document.body.scrollLeft);
    } else {
      return null;
    }
  },

  mouseY: function (evt) {
    if (evt.pageY) {
      return evt.pageY;
    } else if (evt.clientY) {
      return evt.clientY + (document.documentElement.scrollTop ?
        document.documentElement.scrollTop :
        document.body.scrollTop);
    } else {
      return null;
    }
  },

  download: function(e) {
    e.preventDefault ? e.preventDefault() : (e.returnValue = false);
    var img_src = canvas.canvas.toDataURL("image/jpeg", 1.0);
    var ua = window.navigator.userAgent;
    var msie = ua.indexOf("MSIE ");
    // If Internet Explorer, return version number
    if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
      var parent = document.querySelector("#for-ie-download .container");
      var old_img = document.querySelector("#for-ie-download .container img");
      if (old_img) {
        parent.removeChild(old_img);
      }
      img = document.createElement("img");
      img.src = img_src;
      img.alt = "result pic";
      parent.appendChild(img);

      $('html, body').animate({
       scrollTop: $("#for-ie-download").offset().top
      }, 2000);
    } // If another browser, return 0
    else {
      var ah = document.createElement("a");
      ah.href = img_src;
      ah.target = "_blank";
      ah.click();
    }
  },

  fileSelectHandler: function(e) {
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
          thumb.addEventListener("dragstart",function(ev) {
            ev.dataTransfer.setData("id", ev.target.id);
          });
          var text = document.querySelector("#photos .placeholder");
          text.classList.add("hide");
          var cont = kaj.$id("scroll");
          cont.insertBefore(thumb, cont.firstChild);
          kaj.$id("photos").className = "";
        };
      })(f);
      reader.readAsDataURL(f);
    }
  },

  dragOverTape: function(e) {
    e.stopPropagation();
    e.preventDefault();
    kaj.$id("photos").className = (e.type == "dragover" ? "hover" : "");
  }
};
