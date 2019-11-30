define([], function() {

    function filter (image, filterDefinition, width, height) {
        var filteredImage = {};

        if (this[filterDefinition.name]) {
            filteredImage = this[filterDefinition.name]( image, filterDefinition, width, height );
        } else {
            console.error("filter: \"", filterDefinition.name, "\" does not exist.");
            filteredImage = image;
        }

        return filteredImage;
    }; // filter()

    filter.prototype = {

        blur: function (image, filterDefinition, width) {
            // ToDo: better blur algorithm: http://blog.ivank.net/fastest-gaussian-blur.html (three times box blur)
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
            var brightness = filterDefinition.brightness;

            if ( brightness < 0 ) {
                // for brightness =-2 : https://www.wolframalpha.com/ <-- Plot[x^0.25, {x, 0, 1}] 
                brightness = (-1 / (brightness - 1) );
            } else {
                // for brightness = 0 : https://www.wolframalpha.com/ <-- Plot[x^1, {x, 0, 1}] 
                // for brightness = 2 : https://www.wolframalpha.com/ <-- Plot[x^3, {x, 0, 1}] 
                brightness += 1;
            }
            return image.map(function(value){
                return Math.pow(value, brightness );
            });
            
        },

        contrast: function (image, filterDefinition) {
            // https://www.wolframalpha.com/ <-- plot (sin((x-0.5)*pi) + 1)/2 
            // y = mx + n
            var y = 0.5, // always
                x = filterDefinition.x || 0.5,
                m = filterDefinition.m || 2, // steigung
                n = y - m * x,
                x0 = -n / m,
                x1 = (1-n) / m;

            return image.map( function( value ) {
                var y = m * value + n;
                if ( y < 0 ) { return 0; }
                if ( y > 1 ) { return 1; }
                return y;
            });
        },

        invert: function (image) {
            return image.map(function(value){
                return -value + 1;
            });
        }, // invert() 

        threshold: function (image, filterDefinition) {
            // maybe set a range for the threshold, so the border is smoother?
            return image.map(function(value){
                return value > filterDefinition.threshold ? 1 : 0;
            })
        },

        _getPixel: function(x, y) {
            return this.image[y * this.width + x];
        }, // _getPixel()

        _setPixel: function(x, y, color) {
            this.image[y * this.width + x] = color;
        }, // _setPixel()

    }; // filter.prototype

    return filter;

});
