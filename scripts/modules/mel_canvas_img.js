'use strict';

const canvas = {

    newCanvas: document.createElement('canvas'),

    init: function (width, height) {

        this.newCanvas.width = width;
        this.newCanvas.height = height;

        this.newCanvas.setAttribute('role','img');

        this.newCanvas.context = this.newCanvas.getContext('2d');
        this.newCanvas.img = this.newCanvas.context.createImageData(width, height);

        return this;
    },
      
    getImgData: function (x, y) {
        let position, r, g, b, a;

        if (x < 0) { x = this.newCanvas.width + x; }
        if (y < 0) { y = this.newCanvas.height + y; }
        if (x >= this.newCanvas.width ) {
                x = x % this.newCanvas.width; 
                // und deshalb y + 1 oder so
        }
        if (y >= this.newCanvas.height) { 
            y = y % this.newCanvas.height; 
            // und hier x -+ 1 oder so
        }

        position = 4 * ((y * this.newCanvas.width) + x);

        /*
        % this.newCanvas.img.data.length,
        if (position < 0) position = this.newCanvas.img.data.length - position;
        */

        r = this.newCanvas.img.data[position + 0] || 0;
        g = this.newCanvas.img.data[position + 1] || 0;
        b = this.newCanvas.img.data[position + 2] || 0;
        a = this.newCanvas.img.data[position + 3] || 0;

        return [r, g, b, a];
    },

    setImgData: function (x, y, r, g, b, a) {
        let position = (y * this.newCanvas.width + x) * 4;
        this.newCanvas.img.data[position + 0] = r;
        this.newCanvas.img.data[position + 1] = g;
        this.newCanvas.img.data[position + 2] = b;
        if (a || a === 0) this.newCanvas.img.data[position + 3] = a;
    },

    setImgDataGray: function (x, y, c) {
        this.newCanvas.setImgData(x, y, c, c, c, 255);
    },

    setImgDataAlpha: function (x, y, a) {
        let position = (y * this.newCanvas.width + x) * 4;
        this.newCanvas.img.data[position + 3] = this.newCanvas.img.data[position + 3] * a;
    }

        //return this.newCanvas;

} // canvas

export default canvas;