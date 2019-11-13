define(['canvas', 'createPattern', 'filter'], function( canvas, createPattern, filter ) {

    // http://codeblog.cz/vanilla/inside.html#set-element-html

    function patina (domElement, parameters) {
        var self = this,
            createPatina;
        
        self._parameters = self._completeParameters( parameters, domElement );
        console.log('###### - Patina - ######', self._parameters);

        self.reusableImages = {};
        this._parameters.reusableImages.forEach( function (value) {
            self.reusableImages[value.id] = self._processPatinaNode(
                value,
                self._parameters.width,
                self._parameters.height
            );
            console.log("reusableImage: ", value.id);
        });
        // ToDo: check for race condition between reusableImages and createPatina
        createPatina = self._processPatinaNode( 
            self._parameters.patina, 
            self._parameters.width, 
            self._parameters.height
        );
                
        self.myCanvas = canvas.newCanvas( self._parameters.width, self._parameters.height );
        if ( Array.isArray(createPatina) ) {
            // ToDo: the JSON should specify how the Array is transformed to an 4-channel-image
            for (var i = 0, len = self._parameters.width * self._parameters.height; i < len; i++) {
                var alpha = Math.floor(createPatina[i] * 256)
                self.myCanvas.img.data[i*4] = 0;      // r
                self.myCanvas.img.data[i*4+1] = 0;    // g
                self.myCanvas.img.data[i*4+2] = 0;    // b
                self.myCanvas.img.data[i*4+3] = alpha;  // a
            }
        } else {
            for (var i = 0, len = self._parameters.width * self._parameters.height; i < len; i++) {
                self.myCanvas.img.data[i*4] =   Math.floor(createPatina.red[i] * 256);
                self.myCanvas.img.data[i*4+1] = Math.floor(createPatina.green[i] * 256);
                self.myCanvas.img.data[i*4+2] = Math.floor(createPatina.blue[i] * 256);
                self.myCanvas.img.data[i*4+3] = Math.floor(createPatina.alpha[i] * 256);
            }
        }
        self.myCanvas.context.putImageData( self.myCanvas.img, 0, 0 );
        self._paintCanvas( self.myCanvas, domElement );
    } // patina()

    patina.prototype = {

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

        _combine: function(bottomLayer, topLayer) {
            // could be way more sophisticated. And than deserves an extra file

            var resultingImage;

            
            if ( Array.isArray(bottomLayer) && Array.isArray(topLayer) ) {
                resultingImage = bottomLayer.map(function (value, index) {
                    return (value + topLayer[index]) / 2;
                });
            } else {
                resultingImage = {};
                // ToDo: what if one color channel is missing?
                if (bottomLayer.red && topLayer.red) {
                    resultingImage.red = bottomLayer.red.map(function (value, index) {
                        return (value + topLayer.red[index]) / 2;
                    });
                }
                if (bottomLayer.green && topLayer.green) {
                    resultingImage.green = bottomLayer.green.map(function (value, index) {
                        return (value + topLayer.green[index]) / 2;
                    });
                }
                if (bottomLayer.blue && topLayer.blue) {
                    resultingImage.blue = bottomLayer.blue.map(function (value, index) {
                        return (value + topLayer.blue[index]) / 2;
                    });
                }
                if (bottomLayer.alpha && topLayer.alpha) {
                    resultingImage.alpha = bottomLayer.alpha.map(function (value, index) {
                        return (value + topLayer.alpha[index]) / 2;
                    });
                }
            } // if isArray
                
            return resultingImage;
        }, // _combine()

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
                resultingImage = this._combine( 
                    this._processPatinaNode(layer.bottomLayer, width, height),
                    this._processPatinaNode(layer.topLayer, width, height)
                );
            }
            if (layer.type === "createPattern") {
                resultingImage = new createPattern( layer, width, height );
            }
            if (layer.type === "reuseImage") {
                resultingImage = this.reusableImages[layer.id];
            }
            if (resultingImage) {
                if (layer.filter) {
                    layer.filter.forEach(element => {
                        // todo: rauskriegen ob das hier sequenziell abgearbeitet wird oder race conditions stören
                        resultingImage = new filter(resultingImage, element, width, height);
                    });
                }
                return resultingImage;
            } else {
                console.log('layer type not recognized ',layer);
                return null; // Todo: transparentes Array rückgeben oder woanders gracefully failen
            }
        }, // _processPatinaNode()

        _paintCanvas: function( myCanvas, element ) {
            if (element) {
                var s = element.style;
                s.backgroundImage = 'url(' + myCanvas.toDataURL('image/png') + ')';
            }
        } // _paintCanvas()

    } // patina.prototype

    return patina;

});
