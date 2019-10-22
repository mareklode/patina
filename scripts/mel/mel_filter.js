define([], function() {

    function filter (image, filterDefinition, width, height) {
        var self = this,
            filteredImage;
        self.image = image.grey;
        self.width = width;
        self.height = height;
    
        console.log(this);
        // apply filter to image
        console.log(image, filterDefinition);
        filteredImage = image;

        console.log(this);
        this._setPixel(10, 10, 3.1415)
        console.log("pixel: ",this._getPixel(10, 10));

        return filteredImage;

    }; // filter()

    filter.prototype = {

        _blur: function( elemet ) { 
            if (element) {
                var s = element.style;
                s.backgroundImage = 'url(' + myCanvas.toDataURL('image/png') + ')';
                s.backgroundRepeat = 'repeat';
            }
        }, // _blur()

        _getPixel: function(x, y) {
            console.log(this.image, );
            return this.image[y * this.width + x];
        }, // _getPixel()

        _setPixel: function(x, y, color) {
            this.image[y * this.width + x] = color;
        }, // _setPixel()

    }; // filter.prototype

    return filter;

});
