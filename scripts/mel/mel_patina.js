define(['canvas', 'createPattern', 'filter'], function( canvas, createPattern, filter ) {

    // http://youmightnotneedjquery.com/
    // http://codeblog.cz/vanilla/inside.html#set-element-html

    function patina (domElement, parameters) {
        var self = this;
        self.domElement = domElement;
        self._parameters = self._completeParameters( parameters, self.domElement );
        
        console.log('###### - Patina - ######');
        console.log(self._parameters);
        
        self.myCanvas = canvas.newCanvas( self._parameters.width, self._parameters.height );
        var createPatina = self._evaluateLayerNode( 
                self._parameters.patina, 
                self._parameters.width, 
                self._parameters.height
            );

        // copy img byte-per-byte into our ImageData
        for (var i = 0, len = self._parameters.width * self._parameters.height; i < len; i++) {
            var grey = Math.floor(createPatina[i] * 256)
            self.myCanvas.img.data[i*4] = grey;
            self.myCanvas.img.data[i*4+1] = grey;
            self.myCanvas.img.data[i*4+2] = grey;
            self.myCanvas.img.data[i*4+3] = 255;
        }

        self.myCanvas.context.putImageData( self.myCanvas.img, 0, 0 );
        self._paintCanvas( self.myCanvas, self.domElement );
    } // patina()

    patina.prototype = {

        _completeParameters: function ( parameters, element ) {
            parameters = this._jsonParse( parameters );

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

        // muss noch in eine eigene Datei
        _combine: function(bottomLayer, topLayer) {
            return bottomLayer.map(function (value, index) {
                return (value + topLayer[index])/2;
            });
        }, // _combine()

        _evaluateLayerNode: function ( layer, width, height ) {
            var resultingImage = false;

            if (layer.type === "combination") {
                resultingImage = this._combine( 
                    this._evaluateLayerNode(layer.bottomLayer, width, height),
                    this._evaluateLayerNode(layer.topLayer, width, height)
                );
            }
            if (layer.type === "createPattern") {
                resultingImage = createPattern( layer, width, height );
            }
            if (resultingImage) {
                if (layer.filters) {
                    layer.filters.forEach(element => {
                        // todo: rauskriegen ob das hier sequenziell abgearbeitet wird oder race conditions stören
                        resultingImage = filter(resultingImage, element);
                    });
                }
                return resultingImage;
            } else {
                console.log('layer type not recognized ',layer);
                return null; // transparentes Array rückgeben oder woanders gracefully failen
            }
        }, // _evaluateLayerNode()

        _paintCanvas: function( myCanvas, element ) {
            if (element) {
                var s = element.style;
                s.backgroundImage = 'url(' + myCanvas.toDataURL('image/png') + ')';
                s.backgroundRepeat = 'repeat';
            }
        } // _paintCanvas()

    } // patina.prototype

    return patina;

});
