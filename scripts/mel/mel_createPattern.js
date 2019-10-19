define(['canvas', 'noise'], function( canvas, noise ) {

    // http://youmightnotneedjquery.com/
    // http://codeblog.cz/vanilla/inside.html#set-element-html
    // https://github.com/daneden/animate.css

    function createPattern (layer, width, height) {
        var self = this;
        console.log(layer);

        if (layer.name === "whiteNoise") {
            /*
            var whiteNoise = new Array[width][height];
            for (var x = 0; x < width; x++) {
                for (var y = 0; y < height; y++) {
                    whiteNoise[x][y] = Math.floor(Math.random() * 256);
                }
            }*/
            return Array.from( {length: width * height}, () => Math.random() );
        }
        if (layer.name === "sine") {
            var imageData = new Array( width * height ),
                color = 0;
            for (var i = 0; i < width; i++ ) {
                for (var j = 0; j < height; j++ ) {
                    switch (layer.parameters.direction) {
                        case 'vertical':
                            color = Math.sin(i/layer.parameters.period);// * 127 + 128;
                            break;
                        case 'horizontal':
                            color = Math.sin(j/layer.parameters.period);// * 127 + 128;
                            break;
                        case 'rectangles':
                            color = Math.sin((j*i)/layer.parameters.period);// * 127 + 128;
                            break;
                        case 'slopeUpwards':
                            color = Math.sin((j+i)/layer.parameters.period);// * 127 + 128;
                            break;
                        case 'slopeDownwards':
                            color = Math.sin((j-i)/layer.parameters.period);// * 127 + 128;
                            break;
                        case 'circular':
                            color = Math.sin( Math.sqrt((i*i) + (j*j))/layer.parameters.period );// * 127 + 128;
                            break;
                    }
                    imageData[j*width + i] = (color/2) + 0.5;
                }
            }
            return imageData;
        }
        if (layer.name === "diamondSquareNoise") {
            return noise.diamondSquareNoise(width);
        }
    } // createPattern()

    createPattern.prototype = {

        _createBackground: function ( myCanvas, parameters, noiseMap, domElement ) {
            var background = parameters.background,
                backgroundReady = function () {
                    var event = new CustomEvent('backgroundReady');
                    domElement.dispatchEvent(event);
                },
                width = myCanvas.width,
                height = myCanvas.height;

            console.log("background.category: ", background.category);
            if (background.category === 'stripes') {
                for (var i = 0; i < width; i++ ) {
                    for (var j = 0; j < height; j++ ) {

                        var col = (background.width/2) > (i % background.width) ? true:false,
                            row = (background.height/2) > (j % background.height) ? true:false,
                            halftone;

                        if (!(col || row)) {
                            halftone = 0;
                        } else {
                            if (background.width && background.height) {
                                halftone = (col && row) ? 255:127;
                            } else {
                                halftone = 255;
                            }
                        }

                        myCanvas.imgData(
                            i, j,
                            background.color.r,
                            background.color.g,
                            background.color.b,
                            halftone
                        );

                    } // for
                } // for
                backgroundReady();
            } // if
            if (background.category === 'noise') {
                for (var i = 0; i < width; i++ ) {
                    for (var j = 0; j < height; j++ ) {
                        myCanvas.imgDataGray(i, j, noiseMap.imgData[i][j]);
                    }
                }
                backgroundReady();
            }
            if (background.category === 'image') {
                this.imageObj = new Image();

                this.imageObj.addEventListener("load", function() {
                    var imgData;

                    myCanvas.context.drawImage(this, 0, 0);
                    imgData = myCanvas.context.getImageData(
                            0, 0,
                            myCanvas.width,
                            myCanvas.height
                        );

                    myCanvas.img.data.set(imgData.data);
                    backgroundReady();
                });

                if (background.url) { //  onload triggern
                    this.imageObj.src = background.url;
                }

            }

        }, // _createBackground()

        applyFilters: function ( myCanvas, parameters, noiseMap ) {
            var tmpCanvas = canvas.newCanvas( parameters.width, parameters.height );
            parameters.filters.forEach( function (filter) {
                var filterName = filter['name'];
                if ( filters.hasOwnProperty(filterName) ) {
                    filters[filterName]( myCanvas, filter, noiseMap, tmpCanvas );
                }
            });
        }, // applyFilters()

        _paintCanvas: function( myCanvas, element ) { // newcanvas.paintit
            if (element) {
                var s = element.style;
                s.backgroundImage = 'url(' + myCanvas.toDataURL('image/png') + ')';
                s.backgroundRepeat = 'repeat';
            }
        } // _paintCanvas()

    } // createPattern.prototype

    return createPattern;

});
