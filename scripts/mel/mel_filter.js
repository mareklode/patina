define([], function() {

    function filter (image, filterDefinition) {
        var self = this,
            filteredImage;

        // apply filter to image
        console.log(image, filterDefinition);
        filteredImage = image;

        return filteredImage;

    } // filter()

    filter.prototype = {

        _blur: function( elemet ) { 
            if (element) {
                var s = element.style;
                s.backgroundImage = 'url(' + myCanvas.toDataURL('image/png') + ')';
                s.backgroundRepeat = 'repeat';
            }
        } // _blur()

    } // filter.prototype

    return filter;

});
