define(['canvas', 'createPattern', 'filter'], function( canvas, createPattern, filter ) {

    function patina (domElement, parameters) {
        var self = this;
        
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
            var myCanvas = canvas.newCanvas(width, height);
            this.imageObj = new Image();

            this.imageObj.addEventListener("load", function() {
                var imgData;

                // ToDo: check why i do this from here...
                myCanvas.context.drawImage(this, 0, 0);
                imgData = myCanvas.context.getImageData(
                    0, 0,
                    myCanvas.width,
                    myCanvas.height
                );
                // Todo: ... to here and if it is necessary

                var data = imgData.data;

                if ( reusableImage.colorChannels === 1 ) {
                    reusableImages[reusableImage.id] = [];
                    for (var i = 0, len = width * height; i < len; i += 1) {
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

                    for (var i = 0, len = width * height; i < len; i += 1) {
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
            var myCanvas = canvas.newCanvas( parameters.width, parameters.height );

            var patinaArray = this._processPatinaNode( 
                parameters.patina, 
                parameters.width, 
                parameters.height
            );
                    
            if ( Array.isArray(patinaArray) ) {
                // ToDo: the JSON should specify how the Array is transformed to an 4-channel-image
                for (var i = 0, len = parameters.width * parameters.height; i < len; i++) {
                    var alpha = Math.floor(patinaArray[i] * 256);
                    myCanvas.img.data[i*4] = 0;      // r
                    myCanvas.img.data[i*4+1] = 0;    // g
                    myCanvas.img.data[i*4+2] = 0;    // b
                    myCanvas.img.data[i*4+3] = alpha;  // a
                }
            } else {
                for (var i = 0, len = parameters.width * parameters.height; i < len; i++) {
                    myCanvas.img.data[i * 4]     = Math.floor(patinaArray.red[i]   * 256);
                    myCanvas.img.data[i * 4 + 1] = Math.floor(patinaArray.green[i] * 256);
                    myCanvas.img.data[i * 4 + 2] = Math.floor(patinaArray.blue[i]  * 256);
                    myCanvas.img.data[i * 4 + 3] = Math.floor(patinaArray.alpha[i] * 256);
                }
            }
            myCanvas.context.putImageData( myCanvas.img, 0, 0 );
            this._paintCanvas( myCanvas, domElement );

        }, // createPatina()

        _completeParameters: function ( parameters, element ) {
            parameters = this._jsonParse( parameters );

            parameters.reusableImages = parameters.reusableImages || [];

            parameters.width = parameters.width || element.clientWidth;
            parameters.height = parameters.height || element.clientHeight;

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

        _combineArrays: function (bottomLayer, topLayer) {
            return bottomLayer.map(function (value, index) {
                return (value + topLayer[index]) / 2;
            });
        },

        _combineLayers: function(bottomLayer, topLayer) {
            // could be way more sophisticated. And than deserves an extra file
            var resultingImage,
                isArrayBottomLayer = Array.isArray(bottomLayer),
                isArrayTopLayer =  Array.isArray(topLayer);

            if ( isArrayBottomLayer && isArrayTopLayer ) {
                resultingImage = this._combineArrays(bottomLayer, topLayer);
            } else {
                // at least one of the images has color channels. maybe both.
                var bl = {}, tl = {}, resultingImage = {};

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
            
                resultingImage.red   = this._combineArrays(bl.red,   tl.red);
                resultingImage.green = this._combineArrays(bl.green, tl.green);
                resultingImage.blue  = this._combineArrays(bl.blue,  tl.blue);
                resultingImage.alpha = this._combineArrays(bl.alpha, tl.alpha);
            } // if isArray
                
            return resultingImage;
        }, // _combineLayers()

        _processPatinaNode: function ( layer, width, height ) {
            var resultingImage = false;
            
            if (typeof layer === "number") {
                var color = layer / 256;
                return Array.from( {length: width * height}, () => color );
            }

            if ( Array.isArray(layer) ) {
                return layer;
            }
            if (layer.type === "colorChannels") {
                resultingImage = {};
                resultingImage.red = this._processPatinaNode(layer.red, width, height);
                resultingImage.green = this._processPatinaNode(layer.green, width, height);
                resultingImage.blue = this._processPatinaNode(layer.blue, width, height);
                resultingImage.alpha = this._processPatinaNode(layer.alpha, width, height);
            }
            if (layer.type === "combine") {
                resultingImage = this._combineLayers( 
                    this._processPatinaNode(layer.bottomLayer, width, height),
                    this._processPatinaNode(layer.topLayer, width, height)
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

        _paintCanvas: function( myCanvas, element ) {
            if (element) {
                element.style.backgroundImage = 'url(' + myCanvas.toDataURL('image/png') + ')';
            }
        } // _paintCanvas()

    } // patina.prototype

    return patina;

});
