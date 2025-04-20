'use strict';

const canvas = {
    el: document.createElement('canvas'),

    init: function (width, height) {

        this.el.width = width;
        this.el.height = height;

        this.el.setAttribute('role','img');

        this.el.context = this.el.getContext('2d');
        this.el.img = this.el.context.createImageData(width, height);

        console.log("init new canvas");
        return this;
    },
      
    getImgData: function (x, y) {
        let position, r, g, b, a;

        if (x < 0) { x = this.el.width + x; }
        if (y < 0) { y = this.el.height + y; }
        if (x >= this.el.width ) {
                x = x % this.el.width; 
                // und deshalb y + 1 oder so
        }
        if (y >= this.el.height) { 
            y = y % this.el.height; 
            // und hier x -+ 1 oder so
        }

        position = 4 * ((y * this.el.width) + x);

        /*
        % this.el.img.data.length,
        if (position < 0) position = this.el.img.data.length - position;
        */

        r = this.el.img.data[position + 0] || 0;
        g = this.el.img.data[position + 1] || 0;
        b = this.el.img.data[position + 2] || 0;
        a = this.el.img.data[position + 3] || 0;

        return [r, g, b, a];
    },

    setImgData: function (x, y, r, g, b, a) {
        let position = (y * this.el.width + x) * 4;
        this.el.img.data[position + 0] = r;
        this.el.img.data[position + 1] = g;
        this.el.img.data[position + 2] = b;
        if (a || a === 0) this.el.img.data[position + 3] = a;
    },

    setImgDataGray: function (x, y, c) {
        this.el.setImgData(x, y, c, c, c, 255);
    },

    setImgDataAlpha: function (x, y, a) {
        let position = (y * this.el.width + x) * 4;
        this.el.img.data[position + 3] = this.el.img.data[position + 3] * a;
    }
} // canvas

export default canvas;