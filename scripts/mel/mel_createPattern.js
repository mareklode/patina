define(['canvas', 'noise'], function( canvas, noise ) {

    // http://youmightnotneedjquery.com/
    // http://codeblog.cz/vanilla/inside.html#set-element-html
    // https://github.com/daneden/animate.css

    function createPattern (layerDefinition, width, height) {
        var pattern = {};

        if (this[layerDefinition.patternName]) {
            console.log("createPattern: ", layerDefinition.patternName);
            pattern = this[layerDefinition.patternName]( layerDefinition, width, height );
        } else {
            console.error("createPattern: ", layerDefinition.patternName, " does not exist.");
        }

        return pattern;
    } // createPattern()

    createPattern.prototype = {

        slope: function ( layerDefinition, width, height ) {
            var pattern = new Array(width * height);
            for (var x = 0; x < width; x++) {
                for (var y = 0; y < height; y++) {
                    var position = y * width + x;
                    pattern[position] = y / height;
                }
            }
            return pattern;
        },

        whiteNoise: function ( layerDefinition, width, height ) {
            return Array.from( {length: width * height}, () => Math.random() );
        },

        sine: function ( layerDefinition, width, height ) {
            var imageData = new Array( width * height ),
                color = 0;
            for (var i = 0; i < width; i++ ) {
                for (var j = 0; j < height; j++ ) {
                    switch (layerDefinition.parameters.direction) {
                        case 'vertical':
                            color = Math.sin(i/layerDefinition.parameters.period);// * 127 + 128;
                            break;
                        case 'horizontal':
                            color = Math.sin(j/layerDefinition.parameters.period);// * 127 + 128;
                            break;
                        case 'rectangles':
                            color = Math.sin((j*i)/layerDefinition.parameters.period);// * 127 + 128;
                            break;
                        case 'slopeUpwards':
                            color = Math.sin((j+i)/layerDefinition.parameters.period);// * 127 + 128;
                            break;
                        case 'slopeDownwards':
                            color = Math.sin((j-i)/layerDefinition.parameters.period);// * 127 + 128;
                            break;
                        case 'circular':
                            color = Math.sin( Math.sqrt((i*i) + (j*j))/layerDefinition.parameters.period );// * 127 + 128;
                            break;
                    }
                    imageData[j*width + i] = (color/2) + 0.5;
                }
            }
            return imageData
            
        },

        diamondSquareNoise: function ( layerDefinition, width, height ) {
            return noise.diamondSquareNoise(width);
        }

    } // createPattern.prototype

    return createPattern;

});
