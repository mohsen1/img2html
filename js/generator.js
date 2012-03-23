var crazyTable= {
    build: function (src) {
      var img = new Image();
      var canvas = document.getElementById('c');
      var result = document.createElement('div');
      var output = document.getElementById('output');
      var chars = document.getElementById('chars');
      var base64 = document.getElementById('base64');
      var ratio = document.getElementById('ratio');
      var ctx = canvas.getContext('2d');
      var style = document.createElement('style');
      var rId = 't' + Math.floor(Math.random() * 9999999999999);
      result.id = rId;
      img.onload = function(){
        ctx.canvas.width= this.width;
        ctx.canvas.height = this.height;
        ctx.drawImage(this,0,0);
        style.innerHTML = "#"+rId+" i{display:block;margin:0;padding:0;width:1px; height:1px;border:none; float:left;}"
        style.style.display = 'none';
        result.appendChild(style);
		result.style.width = this.width + 'px';
		result.style.height = this.height + 'px';
        var pixels = ctx.getImageData(0,0,ctx.canvas.width, ctx.canvas.height);
		var colors = [];
		var block = {color:'', width:1, height:1}
		var isSameAsPreviousPixel = function(i,w,h){
			if(
					pixels.data[i] == pixels.data[i-4] && 
					pixels.data[i+1] == pixels.data[i-3] && 
					pixels.data[i+2] == pixels.data[i-2] && 
					w!=0 && h!=0
			) return true;
			return false;
		}
        for(var h=0; h<pixels.height; h++){
			block.width = 1;
			  for(var w=0; w<pixels.width; w++){
				var i = w*4 + h*4*pixels.width;
				if(isSameAsPreviousPixel(i,w,h)){
					block.width++;
				}else{
					var cell = document.createElement('i');
					/*if(tdStack!=1){
					td.setAttribute('colspan', tdStack);
					}*/
					if(pixels.data[i] || pixels.data[i+1] || pixels.data[i+2]){
						var color = ((256 + pixels.data[i]<< 8| pixels.data[i+1])<< 8| pixels.data[i+2]).toString(16).slice(1);
						block.color = color;
						if(colors.indexOf(color) == -1){colors.push(color);}
						cell.setAttribute('style', 'background:#' + color + ';width:' + block.width + 'px');
					}
					result.appendChild(cell);
				}
			  }
		}
		console.log(colors);
		document.getElementById('resultContainer').appendChild(result); // move it out of build
	  output.value = result.outerHTML;
	  chars.innerHTML = (result.outerHTML.length /1024).toFixed(2) + 'kb';
	  base64.innerHTML = (this.src.length /1024).toFixed(2) + 'kb';
	  ratio.innerHTML = 'table is ' + ((result.outerHTML.length /1024).toFixed(2)/ (this.src.length /1024).toFixed(2)).toFixed() + ' times bigger';
        
      };
      img.src = src;
    }
  };

//Canvas.trim
('HTMLCanvasElement' in this) && (function () {
  HTMLCanvasElement.prototype.trim = function (opts) {
    opts = opts || {};

    var
    element = this,
    bound = {
      top: null,
      left: null,
      right: null,
      bottom: null
    },
    ctx = element.getContext('2d'),
    newctx = document.createElement('canvas').getContext('2d'),
    pixels = ctx.getImageData(0, 0, element.width, element.height),
    l = pixels.data.length,
    i, x, y;

    for (i = 0; i < l; i += 4) {
      if (pixels.data[i + 3] !== 0) {
        x = (i / 4) % element.width;
        y = ~~((i / 4) / element.width);
    
        if (bound.top === null) {
          bound.top = y;
        }
        
        if (bound.left === null) {
          bound.left = x; 
        } else if (x < bound.left) {
          bound.left = x;
        }
        
        if (bound.right === null) {
          bound.right = x; 
        } else if (bound.right < x) {
          bound.right = x;
        }
        
        if (bound.bottom === null) {
          bound.bottom = y;
        } else if (bound.bottom < y) {
          bound.bottom = y;
        }
      }
    }

    var
    trimmedHeight = Math.max(bound.bottom - bound.top, 1),
    trimmedWidth = Math.max(bound.right - bound.left, 1),
    trimmedData = ctx.getImageData(bound.left, bound.top, trimmedWidth, trimmedHeight),
    offsetX = 0,
    offsetY = 0;

    if (opts.minAspectRatio && opts.minAspectRatio > (trimmedWidth / trimmedHeight)) {
      var trimmedWidthNew = trimmedHeight * opts.minAspectRatio;
      offsetX = (trimmedWidthNew - trimmedWidth) / 2;
      trimmedWidth = trimmedWidthNew;
    }
    else if (opts.maxAspectRatio && opts.maxAspectRatio < (trimmedWidth / trimmedHeight)) {
      var trimmedHeightNew = trimmedWidth / opts.maxAspectRatio;
      offsetY = (trimmedHeightNew - trimmedHeight) / 2;
      trimmedHeight = trimmedHeightNew;
    }

    if (opts.minWidth && opts.minWidth > trimmedWidth) {
      var trimmedWidthNew = opts.minWidth;
      offsetX += (trimmedWidthNew - trimmedWidth) / 2;
      trimmedWidth = trimmedWidthNew;
    }

    if (opts.minHeight && opts.minHeight > trimmedHeight) {
      var trimmedHeightNew = opts.minHeight;
      offsetY += (trimmedHeightNew - trimmedHeight) / 2;
      trimmedHeight = trimmedHeightNew;
    }

    newctx.canvas.width = trimmedWidth;
    newctx.canvas.height = trimmedHeight;
    newctx.putImageData(trimmedData, offsetX, offsetY);

    return newctx.canvas;
  };
})();
//Drag and drop
document.body.ondragover = function () { return false; };
document.body.ondragend = function () { return false; };
document.body.ondrop = function (e) {
  e.preventDefault();
  var file = e.dataTransfer.files[0],
      reader = new FileReader();
  reader.onload = function () {
    var img = new Image();
    img.onload = function () {
      var ctx = document.createElement('canvas').getContext('2d');
      ctx.canvas.width = this.width;
      ctx.canvas.height = this.height;
      ctx.drawImage(this, 0, 0);
      var newCanvas = ctx.canvas.trim();
      var res = newCanvas.toDataURL('image/png');
      crazyTable.build(res);
    };
    img.src = event.target.result;
  };
  reader.readAsDataURL(file);
  return false;
};
