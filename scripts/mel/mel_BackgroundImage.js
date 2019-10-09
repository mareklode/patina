define(['backgroundImage_canvas', 'backgroundImage_filters', 'backgroundImage_noise'], function( canvas, filters, noise ) {

    // http://youmightnotneedjquery.com/
    // http://codeblog.cz/vanilla/inside.html#set-element-html
    // https://github.com/daneden/animate.css

    function backgroundImage (domElement, parameters) {
        var self = this;
        self.domElement = domElement;
        self._parameters = self._completeParameters( parameters, self.domElement );

        console.log('#######################################');

        self.noiseMap = noise.createNoisemap( self._parameters.width, self._parameters.height );
        noise._zufall( self.noiseMap );

        self.myCanvas = canvas.newCanvas( self._parameters.width, self._parameters.height );

        self.domElement.addEventListener(
            'backgroundReady',
            function (e) {
                var ani = self._parameters.animation,
                    dispatchEvent = function (domElement) {
                        var event = new CustomEvent('backgroundReady');
                        domElement.dispatchEvent(event);
                    };

                console.log('filters');
                self.applyFilters(self.myCanvas, self._parameters, self.noiseMap);
                console.log('nachher');

                if (ani.length > 0) {
                   if (ani[0].radius < ani[0].animateTo) {
                        ani[0].radius++;
                        setTimeout(function () {
                                dispatchEvent(domElement);
                            },
                            2000
                        );
                    }
                }

                self.myCanvas.context.putImageData( self.myCanvas.img, 0, 0 );
                self._paintCanvas( self.myCanvas, self.domElement );
            },
        false);

        // dispatches the 'backgroundReady' event
        self._createBackground( self.myCanvas, self._parameters, self.noiseMap, self.domElement );

        self.domElement.addEventListener( 'click', function (el) {
            //self._zufall( self.noiseMap );
            //self._createBackground( self.myCanvas, self._parameters, self.noiseMap, self.domElement );

            self.copyBackgroundFromDomelement(self.domElement, self.myCanvas);
            self.applyFilters(self.myCanvas, self._parameters, self.noiseMap);
        });

    } // backgroundImage()

    backgroundImage.prototype = {

        _completeParameters: function ( parameters, element ) {
            parameters = this._jsonParse( parameters );
            console.log(parameters);

            parameters.width = parameters.width || element.clientWidth;
            parameters.height = parameters.height || element.clientHeight;

            // parameters.background = transparent || color || gradient || image || stripes || pattern || random
            parameters.background = parameters.background || 'transparent';
            parameters.url = parameters.url || false;

            parameters.filters = parameters.filters || [];
            parameters.animation = [];
            for (var i = 0; i < parameters.filters.length; i++) {
                var filter = parameters.filters[i];
                if (filter.animateTo) {
                    parameters.animation.push(filter);
                }
            };

            return parameters;
        }, // _completeParameters()

        _jsonParse: function (jsonString) {
            var parsed;
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
            if (background.category === 'sine') {
                var opacity = 0;
                for (var i = 0; i < width; i++ ) {
                    for (var j = 0; j < height; j++ ) {
                        switch (background.direction) {
                            case 'vertical':
                                opacity = Math.sin(i/background.period) * 127 + 128;
                                break;
                            case 'horizontal':
                                opacity = Math.sin(j/background.period) * 127 + 128;
                                break;
                            case 'rectangles':
                                opacity = Math.sin((j*i)/background.period) * 127 + 128;
                                break;
                            case 'slopeUpwards':
                                opacity = Math.sin((j+i)/background.period) * 127 + 128;
                                break;
                            case 'slopeDownwards':
                                opacity = Math.sin((j-i)/background.period) * 127 + 128;
                                break;
                            case 'circular':
                                // alert('circular');
                                opacity = Math.sin( Math.sqrt((i*i) + (j*j))/background.period ) * 127 + 128;
                                break;
                        }
                        myCanvas.imgData(
                            i, j,
                            background.color.r,
                            background.color.g,
                            background.color.b,
                            opacity
                        );
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

        copyBackgroundFromDomelement: function ( domElement, myCanvas ) {
            alert('hintergund in myCanvas rüberkopieren');
        }, // copyBackgroundFromDomelement()

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

    } // backgroundImage.prototype

    return backgroundImage;

});
