define(['canvas', 'createPattern', 'filter'], function( canvas, createPattern, filter ) {

    // http://youmightnotneedjquery.com/
    // http://codeblog.cz/vanilla/inside.html#set-element-html

    function patina (domElement, parameters) {
        var self = this,
            createPatina;
        
        self.domElement = domElement;
        self._parameters = self._completeParameters( parameters, self.domElement );
        

        console.log('###### - Patina - ######');
        // console.log(self);
        self.myCanvas = canvas.newCanvas( self._parameters.width, self._parameters.height );

        self.reusableImages = {};
        this._parameters.reusableImages.forEach( function (value) {
            self.reusableImages[value.id] = self._evaluateLayerNode(
                value,
                self._parameters.width,
                self._parameters.height
            );
        });
       
        createPatina = self._evaluateLayerNode( 
            self._parameters.patina, 
            self._parameters.width, 
            self._parameters.height
        );

        if (createPatina.grey) {
            // copy img byte-per-byte into our ImageData
            for (var i = 0, len = self._parameters.width * self._parameters.height; i < len; i++) {
                var grey = Math.floor(createPatina.grey[i] * 256)
                self.myCanvas.img.data[i*4] = grey;
                self.myCanvas.img.data[i*4+1] = grey;
                self.myCanvas.img.data[i*4+2] = grey;
                self.myCanvas.img.data[i*4+3] = 255;
            }
        } else {
            for (var i = 0, len = self._parameters.width * self._parameters.height; i < len; i++) {
                self.myCanvas.img.data[i*4] =   Math.floor(createPatina.red[i] * 256);
                self.myCanvas.img.data[i*4+1] = Math.floor(createPatina.green[i] * 256);
                self.myCanvas.img.data[i*4+2] = Math.floor(createPatina.blue[i] * 256);
                self.myCanvas.img.data[i*4+3] = Math.floor(createPatina.alpha[i] * 256);
            }
        }

        console.log(this);

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
            var resultingImage = {};

            if (bottomLayer.grey && topLayer.grey) {
                resultingImage.grey = bottomLayer.grey.map(function (value, index) {
                    return (value + topLayer.grey[index]) / 2;
                });
            }
                
            if (bottomLayer.alpha && topLayer.alpha) {
                resultingImage.alpha = bottomLayer.alpha.map(function (value, index) {
                    return (value + topLayer.alpha[index]) / 2;
                });
            }
    
            return resultingImage;
        }, // _combine()

        _evaluateLayerNode: function ( layer, width, height ) {
            var resultingImage = false;

            if (typeof layer === "number") {
                var color = layer / 256;
                return Array.from( {length: width * height}, () => color );
            }
            if (layer.type === "colorChannels") {
                resultingImage = {};
                resultingImage.red = this._evaluateLayerNode(layer.red, width, height);
                resultingImage.green = this._evaluateLayerNode(layer.green, width, height);
                resultingImage.blue = this._evaluateLayerNode(layer.blue, width, height);
                resultingImage.alpha = this._evaluateLayerNode(layer.alpha, width, height).grey;
            }
            if (layer.type === "combine") {
                resultingImage = this._combine( 
                    this._evaluateLayerNode(layer.bottomLayer, width, height),
                    this._evaluateLayerNode(layer.topLayer, width, height)
                );
            }
            if (layer.type === "createPattern") {
                resultingImage = {};
                resultingImage = new createPattern( layer, width, height );
            }
            if (layer.type === "reuseImage") {
                console.log("reuse Image: ", layer.name, this.reusableImages[layer.name]);
                resultingImage = this.reusableImages[layer.name];
            }
            if (resultingImage) {
                if (layer.filter) {
                    layer.filter.forEach(element => {
                        // todo: rauskriegen ob das hier sequenziell abgearbeitet wird oder race conditions stören
                        resultingImage = new filter(resultingImage, element, width, height);
                    });
                }
                // if (layer.reuseName)
                return resultingImage;
            } else {
                console.log('layer type not recognized ',layer);
                return null; // Todo: transparentes Array rückgeben oder woanders gracefully failen
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
