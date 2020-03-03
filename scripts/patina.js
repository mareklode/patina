require.config({
    baseUrl: 'scripts',
    paths: {
        patina:         'mel/mel_patina',
        canvas:         'mel/mel_canvas',
        createPattern:  'mel/mel_createPattern',
        noise:          'mel/mel_noise',
        filter:         'mel/mel_filter',
        templates:      'mel/mel_pageTemplates',
    }
});

let mel = {};

mel.setupPage = function () {

    /* find and execute JavaScript-triggers in HTML-tags */
    let nodeList = document.querySelectorAll(".js-require");
    console.log('JavaScript-triggers in HTML-tags:', nodeList.length, nodeList);
    for (let nl = 0; nl < nodeList.length; nl++) {
        let el = nodeList[nl],
            requireName = el.getAttribute('data-require-name'),
            requireData = el.getAttribute('data-require-data');

        (function (el, requireName, requireData) { // to eliminate the race condition
            require([requireName], function( requireName ) {
                if (typeof requireName === 'function') {
                    new requireName(el, requireData);
                    el.classList.remove('js-require');
                    el.classList.add('js-require-processed');
                } else {
                    console.error(requireName, ' does not exist? ', el);
                }
            });
        })(el, requireName, requireData);
    }

    mel.kkeys = [];
    mel.konami = "38,38,40,40,37,39,37,39,66,65";
    mel.easteregg = function () {
        alert('Konami');
    }

    document.addEventListener('keydown', function(e) {
      mel.kkeys.push( e.keyCode );
      if ( mel.kkeys.toString().indexOf( mel.konami ) >= 0 ) {
        mel.kkeys = [];        
        mel.easteregg();
      }
    });

};

mel.setupPage();
define("main", function(){});

define('canvas',[], function() {

    let canvas = {
        newCanvas: function (width, height) {
            let newCanvas = document.createElement('canvas');
            newCanvas.width = width;
            newCanvas.height = height;

            newCanvas.context = newCanvas.getContext('2d');
            newCanvas.img = newCanvas.context.createImageData(width, height);

            newCanvas.getImgData = function (x, y) {
                let position, r, g, b, a;

                if (x < 0) { x = newCanvas.width + x; }
                if (y < 0) { y = newCanvas.height + y; }
                if (x >= newCanvas.width ) { x = x % newCanvas.width; }
                if (y >= newCanvas.height) { y = y % newCanvas.height; }

                position = 4 * ((y * newCanvas.width) + x);

                /*
                % newCanvas.img.data.length,
                if (position < 0) position = newCanvas.img.data.length - position;
                */

                r = newCanvas.img.data[position + 0] || 0;
                g = newCanvas.img.data[position + 1] || 0;
                b = newCanvas.img.data[position + 2] || 0;
                a = newCanvas.img.data[position + 3] || 0;

                return [r, g, b, a];
            }

            newCanvas.setImgData = function (x, y, r, g, b, a) {
                let position = (y * newCanvas.width + x) * 4;
                newCanvas.img.data[position + 0] = r;
                newCanvas.img.data[position + 1] = g;
                newCanvas.img.data[position + 2] = b;
                if (a || a === 0) newCanvas.img.data[position + 3] = a;
            }

            newCanvas.setImgDataGray = function (x, y, c) {
                newCanvas.setImgData(x, y, c, c, c, 255);
            }

            newCanvas.setImgDataAlpha = function (x, y, a) {
                let position = (y * newCanvas.width + x) * 4;
                newCanvas.img.data[position + 3] = newCanvas.img.data[position + 3] * a;
            }

            return newCanvas;
        }, // newCanvas()

    } // canvas

    return canvas;
});

define('filter',[], function() {

    function filter (image, filterDefinition, width, height) {
        let filteredImage = {};

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
            // copied from http://blog.ivank.net/fastest-gaussian-blur.html 

            let sigma = filterDefinition.radius || 3, // standard deviation
                n = 3, // number of boxes
                targetImage = [];
                
            let wIdeal = Math.sqrt((12*sigma*sigma/n)+1);  // Ideal averaging filter width 
            let wl = Math.floor(wIdeal);  if(wl%2==0) wl--;
            let wu = wl+2;
                        
            let mIdeal = (12*sigma*sigma - n*wl*wl - 4*n*wl - 3*n)/(-4*wl - 4);
            let m = Math.round(mIdeal);
                        
            let sizes = [];  
            for(let i=0; i<n; i++) sizes.push(i<m?wl:wu);
            
            let boxBlur_4 = function (sourceImage, targetImage, w, h, r) {
                for(let i=0; i<sourceImage.length; i++) targetImage[i] = sourceImage[i];
                boxBlurH_4(targetImage, sourceImage, w, h, r);
                boxBlurT_4(sourceImage, targetImage, w, h, r);
            }
            let boxBlurH_4 = function (sourceImage, targetImage, w, h, r) {
                let iarr = 1 / (r+r+1);
                for(let i=0; i<h; i++) {
                    let ti = i*w, li = ti, ri = ti+r;
                    let fv = sourceImage[ti], lv = sourceImage[ti+w-1], val = (r+1)*fv;
                    for(let j=0; j<r; j++) val += sourceImage[ti+j];
                    for(let j=0  ; j<=r ; j++) { val += sourceImage[ri++] - fv       ;   targetImage[ti++] = val*iarr; }
                    for(let j=r+1; j<w-r; j++) { val += sourceImage[ri++] - sourceImage[li++];   targetImage[ti++] = val*iarr; }
                    for(let j=w-r; j<w  ; j++) { val += lv        - sourceImage[li++];   targetImage[ti++] = val*iarr; }
                }
            }
            let boxBlurT_4 = function (sourceImage, targetImage, w, h, r) {
                let iarr = 1 / (r+r+1);
                for(let i=0; i<w; i++) {
                    let ti = i, li = ti, ri = ti+r*w;
                    let fv = sourceImage[ti], lv = sourceImage[ti+w*(h-1)], val = (r+1)*fv;
                    for(let j=0; j<r; j++) val += sourceImage[ti+j*w];
                    for(let j=0  ; j<=r ; j++) { val += sourceImage[ri] - fv ;  targetImage[ti] = val*iarr;  ri+=w; ti+=w; }
                    for(let j=r+1; j<h-r; j++) { val += sourceImage[ri] - sourceImage[li];  targetImage[ti] = val*iarr;  li+=w; ri+=w; ti+=w; }
                    for(let j=h-r; j<h  ; j++) { val += lv      - sourceImage[li];  targetImage[ti] = val*iarr;  li+=w; ti+=w; }
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
            let brightness = filterDefinition.brightness || 0;

            if ( brightness < 0 ) {
                // for brightness =-2 : https://www.wolframalpha.com/ <-- Plot[x^0.25, {x, 0, 1}] 
                brightness = (-1 / (brightness - 1) );
            } else {
                // for brightness = 0 : https://www.wolframalpha.com/ <-- Plot[x^1, {x, 0, 1}] 
                // for brightness = 2 : https://www.wolframalpha.com/ <-- Plot[x^3, {x, 0, 1}] 
                brightness += 1;
            }
            return image.map(function(value){
                return value ** brightness;
            });
            
        }, // brightness()

        contrast: function (image, filterDefinition) {
            let y = 0.5, // always
                m = filterDefinition.m || 1, // slope
                x = filterDefinition.x || 0.5,
                n = y - m * x;

            return image.map( function( value ) {
                let y = m * value + n; // linear equation
                if ( y < 0 ) { return 0; }
                if ( y > 1 ) { return 1; }
                return y;
            });
        }, // contrast()

        invert: function (image) {
            return image.map(function(value){
                return -value + 1;
            });
        }, // invert() 

        threshold: function (image, filterDefinition) {
            let threshold = filterDefinition.threshold || 0.5;
            return image.map(function(value){
                return value > threshold ? 1 : 0;
            })
        }, // threshold()

        _getPixel: function(x, y) {
            return this.image[y * this.width + x];
        }, // _getPixel()

        _setPixel: function(x, y, color) {
            this.image[y * this.width + x] = color;
        }, // _setPixel()

    }; // filter.prototype

    return filter;

});

define('templates',{
    header:  `{
        "width" : 375,
        "height": 283,
        "patina": {
            "type"  : "colorChannels",
            "red"   : 73,
            "green" : 94,
            "blue"  : 18,
            "alpha" : {
                "type"          : "createPattern",
                "patternName"   : "wave",
                "direction"     : "rectangles",
                "frequency"     : 4,
                "filter"        : [
                    { "name": "threshold", "threshold": 0.5 },
                    { "name": "blur", "radius": 1 },
                    { "name": "threshold", "threshold": 0.66 },
                    { "name": "contrast", "m": 0.5, "x": 1.5 }
                ]
            }
        }
    }`,
    navigation: `{
        "patina": {
            "type"          : "combine",
            "topLayer"      : {
                "type"          : "createPattern",
                "patternName"   : "border"
            },
            "bottomLayer"   : {
                "type"          : "createPattern",
                "patternName"   : "noise_white",
                "filter"        : [{ "name": "contrast", "x": 2, "m": 0.25 }]
            }
        }
    }`,
    footer: `{
        "width": 256,
        "patina": {
            "type"  : "colorChannels",
            "red"   : 73,
            "green" : 94,
            "blue"  : 18,
            "alpha" : {
                "type"  :   "combine",
                "topLayer"    : {
                    "type"  :   "combine",
                    "topLayer"    : {
                        "type"  :   "combine",
                        "topLayer"      : {
                            "type"          : "createPattern",
                            "patternName"   : "noise_plasma"
                        },
                        "bottomLayer"   : {
                            "type"          : "createPattern",
                            "patternName"   : "wave",
                            "direction"     : "horizontal",
                            "frequency"     : 60
                        }
                    },
                    "bottomLayer" : { 
                        "type"          : "createPattern",
                        "patternName"   : "slope",
                        "filter"        : [{ "name": "brightness", "brightness": -2 }]
                    }
                },
                "bottomLayer" : { 
                    "type"  :   "combine",
                    "topLayer"    : {
                        "type"          : "createPattern",
                        "patternName"   : "noise_white"
                    },
                    "bottomLayer"   : {
                        "type"          : "createPattern",
                        "patternName"   : "wave",
                        "direction"     : "vertical",
                        "frequency"     : 67
                    }
                },
                "filter"        : [
                    { "name": "invert" },
                    { "name": "blur", "radius": 1 },
                    { "name": "contrast", "m": 3, "x": 0.625 }
                ]
            }
        }
    }`
});

define('noise',[], function() {

    noise = {

        // https://sdm.scad.edu/faculty/mkesson/vsfx419/wip/best/winter12/jonathan_mann/noise.html
        noise_plasma: function (width) {

            let max=0,
                min=0,
                aktX,aktY,
                noiseMapWidth = (function() {
                        let powerOfTwo = 2;
                        while (powerOfTwo < width) {
                            powerOfTwo *= 2;
                        }
                        return powerOfTwo;
                    })(),
                b = noiseMapWidth, // die jeweils aktuelleBreite der Unterquadrate
                bh = b/2, // halbe Breite (oft benutzte Zahl)
                displacementDistance,
                averageColor, range = b,
                chunkSize = b/2,// * b,
                noiseMap = [];

            // console.log('noiseMapWidth: ', noiseMapWidth);

            // creating the array
            for ( let step = 0; step <= b; step++) {
                noiseMap[step] = [];
            }
            // setting the corners to the same color
            noiseMap[0][0] = 0;
            noiseMap[b][0] = 0;
            noiseMap[0][b] = 0;
            noiseMap[b][b] = 0;

            // repeating the displacement steps down to pixel level
            while (b >= 2) {

                // diamondStep:
                // take a square (first is the whole area),
                // calculate average of corners,
                // add random number (displacement distance)
                // and assign new value to center of the square
                for ( aktX = 0; aktX < noiseMapWidth; aktX=aktX+b ){
                    for ( aktY = 0; aktY < noiseMapWidth; aktY=aktY+b ){
                        // set range for displacement distance
                        if ( b < chunkSize) {
                            range = b * 1.414 + (1/b) +3.1415;
                        } else {
                            range = 0;
                        }
                        displacementDistance = this.randomFromTo( -range , range );

                        // calculate average of the corners
                        averageColor = ( noiseMap[aktX][aktY]
                                       + noiseMap[aktX+b][aktY]
                                       + noiseMap[aktX][aktY+b]
                                       + noiseMap[aktX+b][aktY+b]
                                       ) / 4;
                        try {
                            // assign new value to center of the square
                            noiseMap[aktX+bh][aktY+bh] = averageColor + displacementDistance;

                            // need min & max for stretching to color space
                            if (noiseMap[aktX+bh][aktY+bh]>max) max=noiseMap[aktX+bh][aktY+bh];
                            if (noiseMap[aktX+bh][aktY+bh]<min) min=noiseMap[aktX+bh][aktY+bh];
                        } catch (e) {
                            console.error(aktX, aktY, bh, e);
                        }
                    }
                }

                // squareStep:
                // take a diamond
                // add random number (displacement distance) to average of corners
                // and assign new value to center of the diamond
                for ( aktX=0; aktX < ( (noiseMapWidth-1) ); aktX=aktX+b ){
                    for ( aktY=0; aktY< ( (noiseMapWidth-1) ); aktY=aktY+b ){
                        if ( b < chunkSize ) {
                            range = b + (1/b) +3.1415;
                        } else {
                            range = 0;
                        }

                        if ( aktY == 0 ){
                            feldOben = noiseMap[aktX+bh][noiseMapWidth-bh];
                        } else {
                            feldOben = noiseMap[aktX+bh][aktY-bh];
                        }

                        // calculate average of the corners
                        averageColor = ( noiseMap[aktX][aktY]
                                       + noiseMap[aktX+b][aktY]
                                       + feldOben
                                       + noiseMap[aktX+bh][aktY+bh]
                                       ) / 4;

                        displacementDistance = this.randomFromTo( -range , range );
                        // assign new value to center of the square
                        noiseMap[aktX+bh][aktY] = averageColor + displacementDistance;

                        if (noiseMap[aktX+bh][aktY]>max) max=noiseMap[aktX+bh][aktY];
                        if (noiseMap[aktX+bh][aktY]<min) min=noiseMap[aktX+bh][aktY];

                        if (aktX == 0){
                            feldLinks = noiseMap[noiseMapWidth-bh][aktY+bh];
                        } else {
                            feldLinks = noiseMap[aktX-bh][aktY+bh];
                        }
                        // calculate average of the corners
                        averageColor = ( noiseMap[aktX][aktY]
                                       + noiseMap[aktX+b][aktY]
                                       + noiseMap[aktX+bh][aktY+bh]
                                       + feldLinks
                                       ) / 4;
                        displacementDistance = this.randomFromTo( -range, range );
                        // assign new value to center of the square
                        noiseMap[aktX][aktY+bh]=averageColor + displacementDistance;

                        // need min & max for stretching to color space
                        if (noiseMap[aktX][aktY+bh]>max) max = noiseMap[aktX][aktY+bh];
                        if (noiseMap[aktX][aktY+bh]<min) min = noiseMap[aktX][aktY+bh];
                    }
                }

                // copy border colors to opposite border
                for ( i=0; i<=noiseMapWidth; i++){
                    noiseMap[noiseMapWidth][i]=noiseMap[0][i];
                    noiseMap[i][noiseMapWidth]=noiseMap[i][0];
                }
                b = b/2;
                bh = b/2;
            } // while

            // stretching to color space
            let stretchFromZeroTo = 1, // or 255
                by = stretchFromZeroTo / (max - min); // how much to stretch

            for ( i = 0; i < noiseMapWidth; i++ ) {
                for ( j = 0; j < noiseMapWidth; j++ ) {
                    noiseMap[i][j] = ( noiseMap[i][j] - min ) * by;
                }
            }

            let noiseString = new Array();
            for (let y = 0; y < width; y++) {
                noiseMap[y].pop(); // every line was one pixel too long. Border-copying?
                noiseString = noiseString.concat(noiseMap[y]);
            }
            // debugger
            return noiseString;

        }, // noise_plasma()

        randomFromTo: function( from, to ) {
            return ( Math.random() * ( to - from ) ) + from;
        } // randomFromTo()

    }

    return noise;

});

define('createPattern',['canvas', 'noise'], function( canvas, noise ) {

    // http://youmightnotneedjquery.com/
    // http://codeblog.cz/vanilla/inside.html#set-element-html
    // https://github.com/daneden/animate.css

    function createPattern (layerDefinition, width, height, reusableImages) {
        let pattern = {};

        if (layerDefinition.pattern && this[layerDefinition.pattern.name]) {
            console.log("createPattern: ", layerDefinition.pattern.name);
            pattern = this[layerDefinition.pattern.name]( layerDefinition.pattern, width, height );
        } else if (this[layerDefinition.patternName]) {
            console.log("createPattern: ", layerDefinition.patternName);
            pattern = this[layerDefinition.patternName]( layerDefinition, width, height );
        } else {
            let patternName = layerDefinition.patternName;
            if (layerDefinition.pattern) { patternName = layerDefinition.pattern.name }
            console.error("createPattern: \"", patternName, "\" does not exist.", layerDefinition);
            pattern = this["flat"]({color: 0}, width, height);
        }

        return pattern;
    } // createPattern()

    createPattern.prototype = {

        border: function ( layerDefinition, width, height ) {
            let imageData = new Array( width * height );
            for (let i = 0; i < width; i++ ) {
                for (let j = 0; j < height; j++ ) {
                    let x1 = i / ( width  - 1 ),
                        x2 = j / ( height - 1 ),
                        y1 = Math.pow(2 * x1, 2) - (4 * x1) + 1,
                        y2 = Math.pow(2 * x2, 2) - (4 * x2) + 1;
                        // https://www.wolframalpha.com/ <-- plot (2*x)^2 - 4x + 1
                    
                    imageData[j * width + i] = (
                        Math.pow(y1, 32) + 
                        Math.pow(y2, 32) + 
                        Math.pow(y1, 8) + 
                        Math.pow(y2, 8) + 
                        Math.pow(y1, 2) + 
                        Math.pow(y2, 2)
                    ) / 6;
                }
            }
            return imageData;
        }, // border()

        noise_plasma: function ( layerDefinition, width, height ) {
            return noise.noise_plasma(width);
        },

        // better use the number-Shortcut like { "topLayer" : 256 }
        flat: function ( layerDefinition, width, height ) {
            let color = layerDefinition.color || 128;
            return Array.from( {length: width * height}, () => color / 256 );
        },

        wave: function ( layerDefinition, width, height ) {
            let imageData = new Array( width * height ),
                color = 0,
                frequency = width / layerDefinition.frequency / 6.2832 || width / 31.4156, // default: 5 waves per width
                offsetX = layerDefinition.offsetX || 0,
                offsetY = layerDefinition.offsetY || 0;
            for (let x = 0; x < width; x++ ) {
                for (let y = 0; y < height; y++ ) {

                    switch ( layerDefinition.direction ) {
                        case 'concentric':
                            color = Math.sin( Math.sqrt(((x - offsetX) * (x - offsetX)) + ((y - offsetY) * (y - offsetY))) / frequency );
                            break;
                        case 'horizontal':
                            color = Math.sin((y - offsetY) / frequency);
                            break;
                        case 'rectangles':
                            color = Math.sin(((y - offsetY) * (x - offsetX)) / frequency);
                            break;
                        case 'diagonalUp':
                            color = Math.sin(((y - offsetY) + (x - offsetX)) / frequency);
                            break; 
                        case 'diagonalDown':
                            color = Math.sin((y - offsetY - x - offsetX) / frequency);
                            break;
                        default: /* vertical */
                            color = Math.sin((x - offsetX) / frequency);
                    }
                    imageData[y * width + x] = (-color / 2) + 0.5;
                }
            }
            return imageData
            
        }, // wave()

        slope: function ( layerDefinition, width, height ) {
            let pattern = new Array(width * height);
            for (let x = 0; x < width; x++) {
                for (let y = 0; y < height; y++) {
                    // ToDo: changing directions must be possible
                    let position = y * width + x ;
                    pattern[position] = y / (height - 1);
                }
            }
            return pattern;
        }, // slope()

        noise_1D: function ( layerDefinition, width, height ) {
            let noise, 
                pattern = new Array(),
                flattenedArray;

            if (layerDefinition.direction === "horizontal") {
                let noise = Array.from( {length: height}, () => Math.random() );
                for (let i = 0; i < width; i++) {
                    pattern.push(Array.from( {length: width}, () => noise[i] ));
                }
            } else { // vertical
                let noise = Array.from( {length: width}, () => Math.random() );
                for (let i = 0; i < height; i++) {
                    pattern.push(noise);
                }
            }
            flattenedArray = [].concat.apply([], pattern);
            return flattenedArray;
        }, // noise_1D()

        noise_white: function ( layerDefinition, width, height ) {
            return Array.from( {length: width * height}, () => Math.random() );
        },

    } // createPattern.prototype

    return createPattern;

});

define('patina',['canvas', 'createPattern', 'filter', 'templates'], function( canvas, createPattern, filter, templates ) {

    function patina (domElement, parameters) {
        let self = this;

        if (parameters.startsWith('template_')) {
            parameters = templates[parameters.substring(9)];
        };
        
        self._parameters = self._completeParameters( parameters, domElement );
        console.log('###### - Patina - ######', self._parameters);

        self.reusableImages = {
            count : this._parameters.reusableImages.length,
            countdown : function () {
                this.count--;
                if ( this.count === 0) {
                    self.createPatina(self._parameters, domElement);
                };
            }
        };

        if ( this._parameters.reusableImages.length > 0 ) {
            console.log("deferred, because ist contains reusable images");
            this._parameters.reusableImages.forEach( function (value) {
                if (value.type === "preloadImage") {
                    self.preloadImage(
                        value,
                        self._parameters.width,
                        self._parameters.height,
                        self.reusableImages
                    );
                } else {
                    self.reusableImages[value.id] = self._processPatinaNode(
                        value,
                        self._parameters.width,
                        self._parameters.height
                    );
                    self.reusableImages.countdown();
                }
                console.log("reusableImage: ", value.id);
            });
        } else {
            // evaluate now because we don't have to wait for any images to load
            self.createPatina(self._parameters, domElement);
        }

    } // patina()

    patina.prototype = {

        preloadImage: function ( reusableImage, width, height, reusableImages) {
            
            // fetch image from URL and convert it to an Array
            let myCanvas = canvas.newCanvas(width, height);
            this.imageObj = new Image();

            this.imageObj.addEventListener("load", function() {
                let imgData;

                myCanvas.context.drawImage(this, 0, 0);
                imgData = myCanvas.context.getImageData(
                    0, 0,
                    myCanvas.width,
                    myCanvas.height
                );

                let data = imgData.data;

                if ( reusableImage.colorChannels === 1 ) {
                    reusableImages[reusableImage.id] = [];
                    for (let i = 0, len = width * height; i < len; i += 1) {
                        reusableImages[reusableImage.id][i]   = ( data[i*4] + 
                                                                  data[i*4+1] +
                                                                  data[i*4+2] +
                                                                  data[i*4+3] ) / ( 256 * 4 );
                    }
                } else {
                    reusableImages[reusableImage.id] = {
                        red: [],
                        green: [],
                        blue: [],
                        alpha: []
                    };  
                    for (let i = 0, len = width * height; i < len; i += 1) {
                        reusableImages[reusableImage.id].red[i]   = data[i*4]   / 256;
                        reusableImages[reusableImage.id].green[i] = data[i*4+1] / 256;
                        reusableImages[reusableImage.id].blue[i]  = data[i*4+2] / 256;
                        reusableImages[reusableImage.id].alpha[i] = data[i*4+3] / 256;
                    }
                }

                reusableImages.countdown();
            });

            this.imageObj.src = reusableImage.url;

        }, // preloadImage()
        
        createPatina: function (parameters, domElement) {

            let patinaData = this._processPatinaNode( 
                parameters.patina, 
                parameters.width, 
                parameters.height
            );
                    
            let myCanvas = this._createCanvas(patinaData, parameters.width, parameters.height );
            this._paintCanvas( myCanvas, domElement );

            // draw every reusableImage to a DIV with the correct ID ("reusableImage_" + reuseId) if it exists
            Object.keys(this.reusableImages).forEach(function(reuseId) {
                if (reuseId !== 'count' && reuseId !== 'countdown') {
                    this._paintCanvasToADifferentDiv(
                        this.reusableImages[reuseId],
                        parameters.width,
                        parameters.height, 
                        "reusableImage_" + reuseId
                    );
                }
            }, this);

        }, // createPatina()

        _completeParameters: function ( parameters, element ) {
            parameters = this._jsonParse( parameters );

            parameters.reusableImages = parameters.reusableImages || [];

            parameters.width = parameters.width || element.clientWidth;
            parameters.height = parameters.height || element.clientHeight;

            return parameters;
        }, // _completeParameters()

        _jsonParse: function (jsonString) {
            let parsed;
            try {
                parsed = JSON.parse(jsonString);
            }
            catch (e) {
                console.error(jsonString, e);
            }
            finally {
                return parsed || {};
            }
        }, // _jsonParse()

        _combineArrays: function (bottomLayer, topLayer, width, combineMode = {} ) {
            let modulo = function (divided, m) {
                // modulo(index - 1, tll)
                return ((divided % m) + m) % m;
            }
            let arrayPos = function (x, y, width) {
                return x + y * width;
            }
            if (combineMode.name === 'distort') {
                let multiplier = combineMode.radius || 1,
                    length = topLayer.length,
                    tll = length,
                    height = length / width,
                    x, y, vectorX, vectorY, xNew, yNew;
                return bottomLayer.map(function (value, index) {
                    let x = index % width,
                        y = (index - x) / width,
                        leftPosX   = (x - 1) % width,
                        rightPosX  = (x + 1) % width,
                        topPosY    = (y - 1) % height,
                        bottomPosY = (y + 1) % height;
                    if (leftPosX < 0) { 
                        leftPosX = width + leftPosX; 
                    }
                    if (topPosY  < 0) { topPosY  = height + topPosY; }

                    let left  = topLayer[arrayPos(leftPosX, y, width)],
                        right = topLayer[arrayPos(rightPosX, y, width)],
                        top   = topLayer[arrayPos(x, topPosY, width)],
                        bottom= topLayer[arrayPos(x, bottomPosY, width)],
                        vectorX = Math.round((right - left) * multiplier),
                        vectorY = Math.round((bottom - top) * multiplier);
                        vector = index + vectorX + (vectorY * width);
                    if (vectorX < 0) { vectorX = width  + vectorX; }
                    if (vectorY < 0) { vectorY = height + vectorY; }
                    return bottomLayer[ modulo(vector, bottomLayer.length) ];
                });
            } else {
                return bottomLayer.map(function (value, index) {
                    return (value + topLayer[index]) / 2;
                });
            }
            
        }, // combineArrays()

        _combineLayers: function(bottomLayer, topLayer, width, combineMode) {
            // could be way more sophisticated. And than deserves an extra file
            let resultingImage,
                isArrayBottomLayer = Array.isArray(bottomLayer),
                isArrayTopLayer =  Array.isArray(topLayer);

            if ( isArrayBottomLayer && isArrayTopLayer ) {
                resultingImage = this._combineArrays(bottomLayer, topLayer, width, combineMode);
            } else {
                // at least one of the images has color channels. the result has color channels.
                let bl = {}, tl = {};
                resultingImage = {};

                if (isArrayBottomLayer) {
                    bl.red = bottomLayer;
                    bl.green = bottomLayer;
                    bl.blue = bottomLayer;
                    bl.alpha = bottomLayer;
                } else {
                    bl = bottomLayer;
                }
            
                if (isArrayTopLayer) {
                    tl.red = topLayer;
                    tl.green = topLayer;
                    tl.blue = topLayer;
                    tl.alpha = topLayer;
                } else {
                    tl = topLayer;
                }
            
                resultingImage.red   = this._combineArrays(bl.red,   tl.red  , width, combineMode);
                resultingImage.green = this._combineArrays(bl.green, tl.green, width, combineMode);
                resultingImage.blue  = this._combineArrays(bl.blue,  tl.blue , width, combineMode);
                resultingImage.alpha = this._combineArrays(bl.alpha, tl.alpha, width, combineMode);
            } // if isArray
                
            return resultingImage;
        }, // _combineLayers()

        _processPatinaNode: function ( layer, width, height ) {
            let resultingImage = false;
            
            if (typeof layer === "number") {
                let color = layer / 256;
                return Array.from( {length: width * height}, () => color );
            }

            if ( Array.isArray(layer) ) {
                return layer;
            }
            if (layer.type === "colorChannels") {
                resultingImage = {};
                resultingImage.red   = this._processPatinaNode(layer.red, width, height);
                resultingImage.green = this._processPatinaNode(layer.green, width, height);
                resultingImage.blue  = this._processPatinaNode(layer.blue, width, height);
                resultingImage.alpha = this._processPatinaNode(layer.alpha, width, height);
            }
            if (layer.type === "combine") {
                resultingImage = this._combineLayers( 
                    this._processPatinaNode(layer.bottomLayer, width, height),
                    this._processPatinaNode(layer.topLayer, width, height),
                    width,
                    layer.combineMode
                );
            }
            if (layer.type === "createPattern") {
                resultingImage = new createPattern( layer, width, height );
            }
            if (layer.type === "reuseImage") {
                if (this.reusableImages[layer.reuseId]) {
                    resultingImage = this.reusableImages[layer.reuseId];

                } else {
                    console.error("ReusableImage", layer.reuseId, "was not found.");
                }
            }
            if (resultingImage) {
                if (layer.filter) {
                    layer.filter.forEach(element => {
                        // todo: check wether this is done sequentially or are there chances for race conditions
                        if (Array.isArray(resultingImage)) {
                            resultingImage = new filter(resultingImage, element, width, height);
                        } else {
                            resultingImage.red   = new filter(resultingImage.red,   element, width, height);
                            resultingImage.green = new filter(resultingImage.green, element, width, height);
                            resultingImage.blue  = new filter(resultingImage.blue,  element, width, height);
                            //resultingImage.alpha = new filter(resultingImage.alpha, element, width, height);
                        }
                    });
                }

                return resultingImage;
            } else {
                console.log('layer type not recognized ',layer);
                return Array.from( {length: width * height}, () => 0 );
            }
        }, // _processPatinaNode()

        _createCanvas: function (patinaData, width, height) {
            let myCanvas = canvas.newCanvas( width, height );

            if ( Array.isArray(patinaData) ) {
                // ToDo: the JSON should specify how the Array is transformed to an 4-channel-image
                for (let i = 0, len = width * height; i < len; i++) {
                    let alpha = Math.floor(patinaData[i] * 256);
                    myCanvas.img.data[i*4] = 0;      // r
                    myCanvas.img.data[i*4+1] = 0;    // g
                    myCanvas.img.data[i*4+2] = 0;    // b
                    myCanvas.img.data[i*4+3] = alpha;  // a
                }
            } else {
                for (let i = 0, len = width * height; i < len; i++) {
                    myCanvas.img.data[i * 4]     = Math.floor(patinaData.red[i]   * 256);
                    myCanvas.img.data[i * 4 + 1] = Math.floor(patinaData.green[i] * 256);
                    myCanvas.img.data[i * 4 + 2] = Math.floor(patinaData.blue[i]  * 256);
                    myCanvas.img.data[i * 4 + 3] = Math.floor(patinaData.alpha[i] * 256);
                }
            }
            myCanvas.context.putImageData( myCanvas.img, 0, 0 );
            return myCanvas;
        }, // _createCanvas()

        _paintCanvas: function ( myCanvas, element ) {
            if (element) {
                element.style.backgroundImage = 'url(' + myCanvas.toDataURL('image/png') + ')';
            }
        }, // _paintCanvas()

        _paintCanvasToADifferentDiv: function ( patinaData, width, height, domElementID ) {

            let domElement = document.getElementById(domElementID);
            if (domElement) {
                let myCanvas = this._createCanvas(patinaData, width, height);
                this._paintCanvas( myCanvas, domElement );
            }
        }, // _paintCanvasToADifferentDiv()

    } // patina.prototype

    return patina;

});
