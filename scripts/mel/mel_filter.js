define([], function() {

    function filter (image, filterDefinition, width, height) {
        var filteredImage = {};

        if (this[filterDefinition.name]) {
            filteredImage = this[filterDefinition.name]( image, filterDefinition, width, height );
        } else {
            console.error("filter: ", filterDefinition.name, " does not exist.");
            filteredImage = image;
        }

        return filteredImage;
    }; // filter()

    filter.prototype = {

        blur: function (image, filterDefinition, width) {
            return image.map(function(value, index){
                return (value + 
                        image[index + 1] + 
                        image[index - 1] +
                        image[index - width] +
                        image[index - width - 1] +
                        image[index - width + 1] +
                        image[index + width] +
                        image[index + width - 1] +
                        image[index + width + 1]
                       ) / 9;
            }); 
        }, // blur()

        brightness: function (image, filterDefinition) {
            return image.map(function(value){
                return value - filterDefinition.brightness;
            });
        },

        contrast: function (image, filterDefinition) {
            // wolframalpha <-- plot (sin((x-0.5)*pi) + 1)/2
            return image.map(function(value){
                return Math.pow(value, 2);
            });
        },

        invert: function (image) {
            return image.map(function(value){
                return -value + 1;
            });
        }, // invert() 

        threshold: function (image, filterDefinition) {
            
            return image.map(function(value){
                return value > filterDefinition.threshold ? 1 : 0;
            })
        },

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
