// requestAnim shim layer by Paul Irish
   window.requestAnimFrame = (function(){
      return  window.requestAnimationFrame       || 
              window.webkitRequestAnimationFrame || 
              window.mozRequestAnimationFrame    || 
              window.oRequestAnimationFrame      || 
              window.msRequestAnimationFrame     || 
              function(/* function */ callback, /* DOMElement */ element){
                 window.setTimeout(callback, 1000 / 60);
              };
   })();

if (!window.getComputedStyle) {
    window.getComputedStyle = function(el, pseudo) {
        this.el = el;
        this.getPropertyValue = function(prop) {
            var re = /(\-([a-z]){1})/g;
            if (prop == 'float') prop = 'styleFloat';
            if (re.test(prop)) {
                prop = prop.replace(re, function () {
                    return arguments[2].toUpperCase();
                });
            }
            return el.currentStyle[prop] ? el.currentStyle[prop] : null;
        }
        return this;
    }
}

var canvas, context, imageData, time=0;

function drawFrame(context, plasmaMap, colorMap){
    var time = new Date().getTime() * 0.003;
    var w = context.canvas.width;
    var h = context.canvas.height;
    var imageData = context.getImageData(0,0,w,h);
    var px = imageData.data;
    var kx = w/h;
    for (var y=0; y<h; y++){
        var yy = y/h-.5;
        for (var x = 0; x<w; x++){
            var xx = kx*x/w-kx/2;
            var v = plasmaFinal(xx,yy,time);
            colorMap2(px, (y*w+x)*4, v);
        }
    }
    context.putImageData(imageData, 0,0);
}

function drawStill(canvasId, plasmaMap, colorMap) {
    var canvas = document.getElementById(canvasId);
    var context = canvas.getContext( '2d' );
    drawAnimated(context, plasmaMap, colorMap);
}

function drawAnimated(canvasId, plasmaMap, colorMap) {
    var canvas = document.getElementById(canvasId);
    var context = canvas.getContext( '2d' );
    
    function animate() {
        drawFrame(context, plasmaMap, colorMap);
        requestAnimFrame( animate );
    }
    requestAnimFrame( animate );
}

function plasmaFinal(x, y, time) {
         var v = 0;
         v += Math.sin((x*10+time));
         v += Math.sin((y*10+time)/2.0);
         v += Math.sin((x*10+y*10+time)/2.0);
         var cx = x + .5 * Math.sin(time/5.0);
         var cy = y + .5 * Math.cos(time/3.0);
         v += Math.sin(Math.sqrt(100*(cx*cx+cy*cy)+1)+time);
         v = v/2.0;
         return v;
    }

function colorMap2(px, offset, v) {
     px[offset  ] = 255;
     px[offset+1] = 255*(.5+.5*Math.cos(Math.PI*v));
     px[offset+2] = 255*(.5+.5*Math.sin(Math.PI*v));
     px[offset+3] = 255;
   }


function setPixel(imageData, x, y, r, g, b, a) {
    index = (x + y * imageData.width) * 4;
    imageData.data[index+0] = r;
    imageData.data[index+1] = g;
    imageData.data[index+2] = b;
    imageData.data[index+3] = a;
}

function init(){
   // canvas = document.getElementById('canvas');
   // canvas.style.margin = 0;
   // canvas.style.padding = 0;
    //canvas.style.width = "100%";
    //canvas.style.height = "100%";
    //context = canvas.getContext('2d');
    //container_width = 100;
    //container_height = 100;
    //canvas.width = container_width;
    //canvas.height = container_height;
    //imageData = context.createImageData(container_width, container_height);
    drawAnimated('canvas', plasmaFinal, colorMap2 );
}


document.addEventListener("DOMContentLoaded", function(event) { 
  init();
});
