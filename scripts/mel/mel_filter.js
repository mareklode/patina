define([], function() {

    function filter (image, filterDefinition, width, height) {
        var filteredImage = {};

        if (this[filterDefinition.name]) {
            filteredImage = this[filterDefinition.name]( image, filterDefinition, width, height );
        } else {
            console.error("filter: \"", filterDefinition.name, "\" does not exist.");
            filteredImage = image;
        }

        return filteredImage;
    }; // filter()

    filter.prototype = {

        blur: function (sourceImage, filterDefinition, width, height) {
            // copied from http://blog.ivank.net/fastest-gaussian-blur.html (three times box blur)

            var sigma = filterDefinition.radius || 3, // standard deviation
                n = 3, // number of boxes
                targetImage = [];

            var wIdeal = Math.sqrt((12*sigma*sigma/n)+1);  // Ideal averaging filter width 
            var wl = Math.floor(wIdeal);  if(wl%2==0) wl--;
            var wu = wl+2;
                        
            var mIdeal = (12*sigma*sigma - n*wl*wl - 4*n*wl - 3*n)/(-4*wl - 4);
            var m = Math.round(mIdeal);
                        
            var sizes = [];  
            for(var i=0; i<n; i++) sizes.push(i<m?wl:wu);
            
            var boxBlur_4 = function (sourceImage, targetImage, w, h, r) {
                for(var i=0; i<sourceImage.length; i++) targetImage[i] = sourceImage[i];
                boxBlurH_4(targetImage, sourceImage, w, h, r);
                boxBlurT_4(sourceImage, targetImage, w, h, r);
            }
            var boxBlurH_4 = function (sourceImage, targetImage, w, h, r) {
                var iarr = 1 / (r+r+1);
                for(var i=0; i<h; i++) {
                    var ti = i*w, li = ti, ri = ti+r;
                    var fv = sourceImage[ti], lv = sourceImage[ti+w-1], val = (r+1)*fv;
                    for(var j=0; j<r; j++) val += sourceImage[ti+j];
                    for(var j=0  ; j<=r ; j++) { val += sourceImage[ri++] - fv       ;   targetImage[ti++] = val*iarr; }
                    for(var j=r+1; j<w-r; j++) { val += sourceImage[ri++] - sourceImage[li++];   targetImage[ti++] = val*iarr; }
                    for(var j=w-r; j<w  ; j++) { val += lv        - sourceImage[li++];   targetImage[ti++] = val*iarr; }
                }
            }
            var boxBlurT_4 = function (sourceImage, targetImage, w, h, r) {
                var iarr = 1 / (r+r+1);
                for(var i=0; i<w; i++) {
                    var ti = i, li = ti, ri = ti+r*w;
                    var fv = sourceImage[ti], lv = sourceImage[ti+w*(h-1)], val = (r+1)*fv;
                    for(var j=0; j<r; j++) val += sourceImage[ti+j*w];
                    for(var j=0  ; j<=r ; j++) { val += sourceImage[ri] - fv ;  targetImage[ti] = val*iarr;  ri+=w; ti+=w; }
                    for(var j=r+1; j<h-r; j++) { val += sourceImage[ri] - sourceImage[li];  targetImage[ti] = val*iarr;  li+=w; ri+=w; ti+=w; }
                    for(var j=h-r; j<h  ; j++) { val += lv      - sourceImage[li];  targetImage[ti] = val*iarr;  li+=w; ti+=w; }
                }
            }

            boxBlur_4 (sourceImage, targetImage, width, height, (sizes[0]-1)/2);
            boxBlur_4 (targetImage, sourceImage, width, height, (sizes[1]-1)/2);
            boxBlur_4 (sourceImage, targetImage, width, height, (sizes[2]-1)/2);

            return targetImage;
        }, // blur()

        // the brightness function keeps black and white and manipulates the color-curve between them
        // ToDo: naming of contrast and brightness are confusing / misleading
        brightness: function (image, filterDefinition) { 
            var brightness = filterDefinition.brightness;

            if ( brightness < 0 ) {
                // for brightness =-2 : https://www.wolframalpha.com/ <-- Plot[x^0.25, {x, 0, 1}] 
                brightness = (-1 / (brightness - 1) );
            } else {
                // for brightness = 0 : https://www.wolframalpha.com/ <-- Plot[x^1, {x, 0, 1}] 
                // for brightness = 2 : https://www.wolframalpha.com/ <-- Plot[x^3, {x, 0, 1}] 
                brightness += 1;
            }
            return image.map(function(value){
                return Math.pow(value, brightness );
            });
            
        },

        contrast: function (image, filterDefinition) {
            // https://www.wolframalpha.com/ <-- plot (sin((x-0.5)*pi) + 1)/2 
            // y = mx + n
            var y = 0.5, // always
                x = filterDefinition.x || 0.5,
                m = filterDefinition.m || 2, // steigung
                n = y - m * x,
                x0 = -n / m,
                x1 = (1-n) / m;

            return image.map( function( value ) {
                var y = m * value + n;
                if ( y < 0 ) { return 0; }
                if ( y > 1 ) { return 1; }
                return y;
            });
        },

        invert: function (image) {
            return image.map(function(value){
                return -value + 1;
            });
        }, // invert() 

        threshold: function (image, filterDefinition) {
            // maybe set a range for the threshold, so the border is smoother?
            return image.map(function(value){
                return value > filterDefinition.threshold ? 1 : 0;
            })
        },

        _getPixel: function(x, y) {
            return this.image[y * this.width + x];
        }, // _getPixel()

        _setPixel: function(x, y, color) {
            this.image[y * this.width + x] = color;
        }, // _setPixel()

    }; // filter.prototype

    return filter;

});
