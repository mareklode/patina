'use strict';

const canvas = {
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

export default canvas;