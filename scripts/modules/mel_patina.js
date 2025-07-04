'use strict';

import canvas from './mel_canvas.js';

// import createPattern from './mel_createPattern.js';
// import filter from './mel_filter.js';
// todo: dynamisch 1/2
import templates from './mel_pageTemplates.js';

function patina (domElement, parameters) {
    let self = this;
    // console.log(parameters);

    if (parameters.startsWith('template_')) {
        // todo: dynamisch 2/2
        //let {default: templates} = await import('./mel_pageTemplates.js');
        parameters = templates[parameters.substring(9)];
    }
        
    self._parameters = self._completeParameters( parameters, domElement );
    self.reusableImages = {};

    window.consoleVerbose &&
    console.log('###### - Patina - ######', self._parameters);

    self.createPatina(self._parameters, domElement);  
} // patina()

patina.prototype = {
    preloadImage: function ( reusableImage, width, height, reusableImages) {
        // fetch image from URL and convert it to an Array
        let myCanvas = canvas.init(width, height);
        this.imageObj = new Image();

        this.imageObj.addEventListener("load", function() {
            let imgData;

            myCanvas.el.context.drawImage(this, 0, 0, width, height);
            imgData = myCanvas.el.context.getImageData(
                0, 0,
                myCanvas.el.width,
                myCanvas.el.height
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
        });

        this.imageObj.src = reusableImage.url;
    }, // preloadImage()

    calculateReusablePattern: async function (value, width, height) {
        return await this._processPatinaNode(
            value,
            width,
            height
        );
    }, // just to make async possible

    createPatina: async function (parameters, domElement) {
        if ( parameters.reusableImages.length > 0 ) {
            let self = this;

            for (let index = 0; index < parameters.reusableImages.length; index++) {
                let imageDefinition = parameters.reusableImages[index];
                if (imageDefinition.type === "preloadImage") {
                    self.preloadImage(
                        imageDefinition,
                        parameters.width,
                        parameters.height,
                        self.reusableImages
                    );
                } else {
                    self.reusableImages[imageDefinition.id] = await self._processPatinaNode(
                        imageDefinition,
                        parameters.width,
                        parameters.height
                    );
                }
            }
        }

        let patinaData = await this._processPatinaNode( 
            parameters.patina, 
            parameters.width, 
            parameters.height
        );

        // draw every reusableImage to a DIV with the correct ID ("reusableImage_" + reuseId) if it exists
        Object.keys( this.reusableImages ).forEach( function( reuseId ) {
                if ( reuseId !== 'count' && reuseId !== 'countdown' ) {
                    this._paintCanvasToADifferentDiv(
                        this.reusableImages[reuseId],
                        parameters.width,
                        parameters.height, 
                        "reusableImage_" + reuseId
                    );
                }
            }, this );
            
        let myCanvas = this._createCanvas( patinaData, parameters.width, parameters.height );
        this._paintCanvas( myCanvas, domElement );
    }, // createPatina()

    _completeParameters: function ( parameters, domElement ) {
        parameters = this._jsonParse( parameters );

        parameters.reusableImages = parameters.reusableImages || [];

        let pixelRatio = window.devicePixelRatio;
        // pixelRatio = 2.8125;

        parameters.width = parameters.width || Math.round(domElement.clientWidth * pixelRatio);
        parameters.height = parameters.height ||  Math.round(domElement.clientHeight * pixelRatio);

        const output = document.querySelectorAll('.output');
        if (output.length) output[0].textContent = pixelRatio + "px";
        // console.log(document.querySelector('.output'));

        return parameters;
    }, // _completeParameters()

    _jsonParse: function (pixelPaintingInstructions) {
        let parsed;
        try {
            parsed = JSON.parse(pixelPaintingInstructions);
        }
        catch (e) {
            console.error("Error in pixelPaintingInstructions:",     pixelPaintingInstructions, e);
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
            let multiplier = combineMode.radius || 32,
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
                    vectorY = Math.round((bottom - top) * multiplier),
                    vector = index + vectorX + (vectorY * width);
                if (vectorX < 0) { vectorX = width  + vectorX; }
                if (vectorY < 0) { vectorY = height + vectorY; }
                return bottomLayer[ modulo(vector, bottomLayer.length) ];
            });
        } else if (combineMode.name === 'subtract') {
            return bottomLayer.map(function (value, index) {
                const result = topLayer[index] - value;
                return ( result > 0 ? result : 0);
            });
        } else if (combineMode.name === 'multiply') {
            return bottomLayer.map(function (value, index) {
                return (topLayer[index] * value);
            });
        } else if (combineMode.name === 'burn') { // todo: dodge
            return bottomLayer.map(function (value, index) {
                return ((1 + topLayer[index]) * value);
            });
        } else if (combineMode.name === 'add') {
            let opacity = combineMode.opacity || 1;
            return bottomLayer.map(function (value, index) {
                return (value + (topLayer[index] * opacity));
            });
        } else {
            // overlay (fifty-fifty)
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

    waitMilliseconds: function (delay) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve();
            }, delay);
        });
    },
    
    _processPatinaNode: async function ( layer, width, height ) {
        let resultingImage = false;

        if (typeof layer === "number") {
            let color = layer / 256;
            return Array.from( {length: width * height}, () => color );
        }

        if ( Array.isArray(layer) ) {
            return layer;
        }
        if (layer?.type === "colorChannels") {
            resultingImage = {};
            resultingImage.red   = await this._processPatinaNode(layer.red, width, height);
            resultingImage.green = await this._processPatinaNode(layer.green, width, height);
            resultingImage.blue  = await this._processPatinaNode(layer.blue, width, height);
            resultingImage.alpha = await this._processPatinaNode(layer.alpha, width, height);
        }
        if (layer?.type === "combine") {
            resultingImage = this._combineLayers( 
                await this._processPatinaNode(layer.bottomLayer, width, height),
                await this._processPatinaNode(layer.topLayer, width, height),
                width,
                layer.combineMode
            );
        }

        
        await this.waitMilliseconds(50);
        
        
        if (layer?.type === "createPattern") {

            const {default: createPattern} = await import('./mel_createPattern.js');
            if (window.consoleVerbose) {
                console.log(createPattern);
            }
            resultingImage = new createPattern( layer, width, height );

        } else if (layer?.type === "reuseImage") {
            if (this.reusableImages[layer.reuseId]) {
                resultingImage = await this.reusableImages[layer.reuseId];
            } else {
                console.error("ReusableImage", layer.reuseId, "was not found.");
                resultingImage = await this._createEmptyImage( width, height );
            }
        }

        if (resultingImage) {
            if (layer.filter) {

                const {default: filter} = await import('./mel_filter.js');

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

            // for the nodes with IDs in showSteps
            if (layer.nodeName) {
                this._paintCanvasToADifferentDiv(resultingImage, width, height, layer.nodeName);
            }
            return resultingImage;
        } else {
            console.log('layer type not recognized ',layer);
            return this._createEmptyImage( width, height );
        }
    }, // _processPatinaNode()

    _createCanvas: function (patinaData, width, height) {
        let myCanvas = canvas.init(width, height);

        if ( Array.isArray(patinaData) ) {
            // ToDo: the pixelPaintingInstructions should specify how the Array is transformed to an 4-channel-image
            for (let i = 0, len = width * height; i < len; i++) {
                let alpha = Math.floor(patinaData[i] * 256);
                myCanvas.el.img.data[i*4] = 0;      // r
                myCanvas.el.img.data[i*4+1] = 0;    // g
                myCanvas.el.img.data[i*4+2] = 0;    // b
                myCanvas.el.img.data[i*4+3] = alpha;  // a
            }
        } else {
            for (let i = 0, len = width * height; i < len; i++) {
                myCanvas.el.img.data[i * 4]     = Math.floor(patinaData.red[i]   * 256);
                myCanvas.el.img.data[i * 4 + 1] = Math.floor(patinaData.green[i] * 256);
                myCanvas.el.img.data[i * 4 + 2] = Math.floor(patinaData.blue[i]  * 256);
                myCanvas.el.img.data[i * 4 + 3] = Math.floor(patinaData.alpha[i] * 256);
            }
        }
        myCanvas.el.context.putImageData( myCanvas.el.img, 0, 0 );
        return myCanvas;
    }, // _createCanvas()

    _paintCanvas: function ( myCanvas, element ) {
        if (element) {
            element.style.backgroundImage = 'url(' + myCanvas.el.toDataURL('image/png') + ')';
        }
    }, // _paintCanvas()

    // for reusable images and the nodes in showSteps
    _paintCanvasToADifferentDiv: function ( patinaData, width, height, domElementID ) {
        domElementID = domElementID || 'thisIDDoesNotExist';    
        let domElement = document.getElementById(domElementID);
        if (domElement) {
            console.log('_paintCanvasToADifferentDiv', domElementID);
            let myCanvas = this._createCanvas(patinaData, width, height);
            this._paintCanvas( myCanvas, domElement );
        } else {
            let intermediateSteps = document.querySelector('.intermediateSteps') || document.createElement('div');
            let stepCounter = 0;
            if (!intermediateSteps.classList.contains('intermediateSteps')) {
                intermediateSteps.classList.add('intermediateSteps');
                document.body.append(intermediateSteps);
            } else {
                stepCounter = intermediateSteps.getAttribute('data-step-counter');
            }

            stepCounter++;

            intermediateSteps.setAttribute('data-step-counter', stepCounter);

            intermediateSteps.insertAdjacentHTML('beforeend', '<div class=stepCounter id=stepCounter' + stepCounter + '></div>');

            let domElement = document.getElementById('stepCounter' + stepCounter );
            let myCanvas = this._createCanvas(patinaData, width, height);
            this._paintCanvas( myCanvas, domElement );

            // console.log('_paintCanvasToADifferentDiv ', domElementID, ' dom element not found.');
        }
    }, // _paintCanvasToADifferentDiv()

    _createEmptyImage: async function ( width, height ) {
        return Array.from( {length: width * height}, () => 0 );
    }

} // patina.prototype

export default patina;

export const visualize = function (domElement, parameters) {
    console.log(domElement);
    return parameters;
}