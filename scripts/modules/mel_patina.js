'use strict';

import canvas from './mel_canvas.js';
import combineLayers from './mel_combineLayers.js';

// import createPattern from './mel_createPattern.js';
// import filter from './mel_filter.js';
// todo: dynamisch 1/2
import templates from './mel_pageTemplates.js';

function patina (domElement, parameters) {
    let self = this;

    if (parameters.startsWith('template_')) {
        // todo: dynamisch 2/2
        // let {default: templates} = await import('./mel_pageTemplates.js');
        parameters = templates[parameters.substring(9)];

        if (!parameters) { return }
    }

    self._parameters = self._completeParameters(parameters, domElement);
    self.reusableImages = {};

    window.consoleVerbose &&
        console.log('###### - Patina - ######', self._parameters);

    self.createPatina(self._parameters, domElement);
} // patina()

patina.prototype = {
    preloadImage: function (reusableImage, width, height, reusableImages) {
        reusableImages[reusableImage.nodeName] = new Promise((resolve) => {
            // fetch image from URL and convert it to an Array
            let myCanvas = new canvas(width, height);
            this.imageObj = new Image();

            this.imageObj.addEventListener("load", function () {
                let imgData;

                myCanvas.el.context.drawImage(this, 0, 0, width, height);
                imgData = myCanvas.el.context.getImageData(
                    0, 0,
                    myCanvas.el.width,
                    myCanvas.el.height
                );

                let data = imgData.data;
                let resultingArray = null;

                if (reusableImage.colors === 1) {
                    resultingArray = [];
                    for (let i = 0, len = width * height; i < len; i += 1) {
                        resultingArray[i] = (data[i * 4] +
                            data[i * 4 + 1] +
                            data[i * 4 + 2] +
                            data[i * 4 + 3]) / (256 * 4);
                    }
                } else {
                    resultingArray = {
                        colorRed: [],
                        colorGreen: [],
                        colorBlue: [],
                        colorAlpha: []
                    };
                    for (let i = 0, len = width * height; i < len; i += 1) {
                        resultingArray.colorRed[i] = data[i * 4] / 256;
                        resultingArray.colorGreen[i] = data[i * 4 + 1] / 256;
                        resultingArray.colorBlue[i] = data[i * 4 + 2] / 256;
                        resultingArray.colorAlpha[i] = data[i * 4 + 3] / 256;
                    }
                }
                resolve(resultingArray);
            });

            this.imageObj.src = reusableImage.url;
        });
    }, // preloadImage()

    calculateReusablePattern: async function (value, width, height) {
        return await this._processPatinaNode(
            value,
            width,
            height
        );
    }, // just to make async possible

    resultingImageHasData: function (resultingImage) {
        return !!resultingImage.length || !!resultingImage.colorRed;
    },

    createPatina: async function (parameters, domElement) {
        Object.keys(parameters.reusableImages).forEach(async (nodeName) => {
            if (!this.reusableImages[nodeName]) {
                let imageDefinition = { ...parameters.reusableImages[nodeName], nodeName: nodeName };
                if (imageDefinition.type === "preloadImage") {
                    this.preloadImage(
                        imageDefinition,
                        parameters.width,
                        parameters.height,
                        this.reusableImages
                    );
                    return;
                }
                // else
                this.reusableImages[nodeName] = new Promise((resolve) => {
                    resolve(this._processPatinaNode(
                        imageDefinition,
                        parameters.width,
                        parameters.height
                    ));
                });
            }
        });

        await this._processPatinaNode(
            parameters.patina,
            parameters.width,
            parameters.height
        ).then((patinaData) => {
            if (this.resultingImageHasData(patinaData)) { // why is this empty sometimes?
                let myCanvas = this._createCanvas(patinaData, parameters.width, parameters.height);
                this._paintCanvas(myCanvas, domElement);
            }
        });
    }, // createPatina()

    _completeParameters: function (parameters, domElement) {
        parameters = this._jsonParse(parameters);

        parameters.reusableImages = parameters.reusableImages || {};

        /*
        // I don't want the pixelRatio, it makes it more complicated.
        // let the browser do its thing and save users with hi-res displays some computing time
        
        let pixelRatio = window.devicePixelRatio; 
        // pixelRatio = 2.8125;
        const output = document.querySelectorAll('.output');
        if (output.length) output[0].textContent = pixelRatio + "px";
        */

        parameters.width = parameters.width || domElement.clientWidth;
        parameters.height = parameters.height || domElement.clientHeight;

        return parameters;
    }, // _completeParameters()

    _jsonParse: function (pixelPaintingInstructions) {
        let parsed;
        try {
            parsed = JSON.parse(pixelPaintingInstructions);
        }
        catch (e) {
            console.error("Error in pixelPaintingInstructions:", pixelPaintingInstructions, e);
        }
        finally {
            return parsed || {};
        }
    }, // _jsonParse()

    waitMilliseconds: function (delay) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve();
            }, delay);
        });
    },

    _processPatinaNode: async function (layer, width, height) {
        let resultingImage = false;

        if (typeof layer === "number") {
            let color = layer / 256;
            return Array.from({ length: width * height }, () => color);
        }

        if (Array.isArray(layer)) {
            return layer;
        }
        if (layer?.type === "colors") {
            resultingImage = {};
            resultingImage.colorRed = await this._processPatinaNode(layer.colorRed, width, height);
            resultingImage.colorGreen = await this._processPatinaNode(layer.colorGreen, width, height);
            resultingImage.colorBlue = await this._processPatinaNode(layer.colorBlue, width, height);
            resultingImage.colorAlpha = await this._processPatinaNode(layer.colorAlpha, width, height);
        }
        if (layer?.type === "layers") {
            resultingImage = combineLayers(
                await this._processPatinaNode(layer.layerBottom, width, height),
                await this._processPatinaNode(layer.layerTop, width, height),
                width,
                layer.combineMode
            );
        }

        await this.waitMilliseconds(50); // So the Page stays responsive while calculating patinas

        if (layer?.type === "createPattern") {

            const { default: createPattern } = await import('./mel_createPattern.js');

            window.consoleVerbose &&
                console.log(createPattern);

            resultingImage = new createPattern(layer, width, height);

        } else if (layer?.type === "reuseImage") {
            if (this.reusableImages[layer.reuseId]) {
                resultingImage = await this.reusableImages[layer.reuseId];
            } else {
                console.error("ReusableImage", layer.reuseId, "was not found.");
                resultingImage = await this._createEmptyImage(width, height);
            }
        }

        if (resultingImage) {
            if (layer.filter) {
                const { default: filter } = await import('./mel_filter.js');

                layer.filter.forEach(element => {
                    // todo: check wether this is done sequentially or are there chances for race conditions
                    if (Array.isArray(resultingImage)) {
                        resultingImage = new filter(resultingImage, element, width, height);
                    } else {
                        resultingImage.colorRed = new filter(resultingImage.colorRed, element, width, height);
                        resultingImage.colorGreen = new filter(resultingImage.colorGreen, element, width, height);
                        resultingImage.colorBlue = new filter(resultingImage.colorBlue, element, width, height);
                        //resultingImage.colorAlpha = new filter(resultingImage.colorAlpha, element, width, height);
                    }
                });

                if (typeof layer.filter === 'object' && !Array.isArray(layer.filter) && layer.filter !== null) {
                    console.warn("filter is object (showSteps)");
                }
            }

            // for the nodes with IDs in showSteps and reusableImages 
            if (layer.nodeName && this.resultingImageHasData(resultingImage)) { // why is this array empty, sometimes?!?
                this._paintCanvasToADifferentDiv(resultingImage, width, height, layer.nodeName);
            }

            return resultingImage;
        } else {
            console.log('layer type not recognized ', layer);
            return this._createEmptyImage(width, height);
        }
    }, // _processPatinaNode()

    _createCanvas: function (patinaData, width, height) {
        let myCanvas = new canvas(width, height);

        if (Array.isArray(patinaData)) {
            // ToDo: the pixelPaintingInstructions should specify how the Array is transformed to an 4-channel-image
            for (let i = 0, len = width * height; i < len; i++) {
                let colorAlpha = Math.floor(patinaData[i] * 256);
                myCanvas.el.img.data[i * 4] = 0;      // r
                myCanvas.el.img.data[i * 4 + 1] = 0;    // g
                myCanvas.el.img.data[i * 4 + 2] = 0;    // b
                myCanvas.el.img.data[i * 4 + 3] = colorAlpha;  // a
            }
        } else {
            for (let i = 0, len = width * height; i < len; i++) {
                myCanvas.el.img.data[i * 4] = Math.floor(patinaData.colorRed[i] * 256);
                myCanvas.el.img.data[i * 4 + 1] = Math.floor(patinaData.colorGreen[i] * 256);
                myCanvas.el.img.data[i * 4 + 2] = Math.floor(patinaData.colorBlue[i] * 256);
                myCanvas.el.img.data[i * 4 + 3] = Math.floor(patinaData.colorAlpha[i] * 256);
            }
        }
        myCanvas.el.context.putImageData(myCanvas.el.img, 0, 0);
        return myCanvas;
    }, // _createCanvas()

    _paintCanvas: function (myCanvas, element) {
        if (element) {
            element.style.backgroundImage = 'url(' + myCanvas.el.toDataURL('image/png') + ')';
        }
    }, // _paintCanvas()

    // for reusable images and the nodes in showSteps
    _paintCanvasToADifferentDiv: async function (patinaData, width, height, domElementID) {
        domElementID = domElementID || 'thisIDDoesNotExist';
        let domElement = document.getElementById(domElementID);
        if (domElement) {
            let myCanvas = await this._createCanvas(patinaData, width, height);
            this._paintCanvas(myCanvas, domElement);
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

            let domElement = document.getElementById('stepCounter' + stepCounter);
            let myCanvas = await this._createCanvas(patinaData, width, height);
            this._paintCanvas(myCanvas, domElement);
        }
    }, // _paintCanvasToADifferentDiv()

    _createEmptyImage: async function (width, height) {
        return Array.from({ length: width * height }, () => 0);
    }

} // patina.prototype

export default patina;