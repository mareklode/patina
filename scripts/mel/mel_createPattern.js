define(['canvas', 'noise'], function( canvas, noise ) {

    // http://youmightnotneedjquery.com/
    // http://codeblog.cz/vanilla/inside.html#set-element-html
    // https://github.com/daneden/animate.css

    function createPattern (layerDefinition, width, height, reusableImages) {
        var pattern = {};

        if (this[layerDefinition.patternName]) {
            console.log("createPattern: ", layerDefinition.patternName);
            pattern = this[layerDefinition.patternName]( layerDefinition, width, height, reusableImages );
        } else {
            console.error("createPattern: \"", layerDefinition.patternName, "\" does not exist.");
            pattern = this["flat"]({color: 0}, width, height);
        }

        return pattern;
    } // createPattern()

    createPattern.prototype = {

        border: function ( layerDefinition, width, height ) {
            var imageData = new Array( width * height );
            for (var i = 0; i < width; i++ ) {
                for (var j = 0; j < height; j++ ) {
                    var x1 = i / ( width  - 1 ),
                        x2 = j / ( height - 1 ),
                        y1 = Math.pow(2 * x1, 2) - (4 * x1) + 1,
                        y2 = Math.pow(2 * x2, 2) - (4 * x2) + 1;
                        // https://www.wolframalpha.com/ <-- plot (2*x)^2 - 4x + 1
                    
                    imageData[j * width + i] = (
                        Math.pow(y1, 32) + 
                        Math.pow(y2, 32) + 
                        Math.pow(y1, 8) + 
                        Math.pow(y2, 8) + 
                        Math.pow(y1, 2) + 
                        Math.pow(y2, 2)
                    ) / 6;
                }
            }
            return imageData;
        },

        diamondSquareNoise: function ( layerDefinition, width, height ) {
            return noise.diamondSquareNoise(width);
        },

        flat: function ( layerDefinition, width, height ) {
            return Array.from( {length: width * height}, () => layerDefinition.color / 256 );
        },

        sine: function ( layerDefinition, width, height ) {
            var imageData = new Array( width * height ),
                color = 0,
                period = layerDefinition.period || 1;
            for (var i = 0; i < width; i++ ) {
                for (var j = 0; j < height; j++ ) {

                    switch ( layerDefinition.direction ) {
                        case 'vertical':
                            color = Math.sin(i/period);
                            break;
                        case 'horizontal':
                            color = Math.sin(j/period);
                            break;
                        case 'rectangles':
                            color = Math.sin((j*i)/period);
                            break;
                        case 'diagonalUp':
                            color = Math.sin((j+i)/period);
                            break;
                        case 'diagonalDown':
                            color = Math.sin((j-i)/period);
                            break;
                        case 'circular':
                            color = Math.sin( Math.sqrt((i*i) + (j*j))/period );
                            break;
                        default: 
                            color = Math.sin( Math.sqrt((i*i) + (j*j))/period );
                    }
                    imageData[j * width + i] = (color / 2) + 0.5;
                }
            }
            return imageData
            
        },

        slope: function ( layerDefinition, width, height ) {
            var pattern = new Array(width * height);
            for (var x = 0; x < width; x++) {
                for (var y = 0; y < height; y++) {
                    // ToDo: changing directions must be possible
                    var position = y * width + x ;
                    pattern[position] = y / (height - 1);
                }
            }
            return pattern;
        },

        twoDimensionalNoise: function ( layerDefinition, width, height ) {
            var noise, 
                pattern = new Array(),
                flattenedArray;

            if (layerDefinition.direction === "vertical") {
                var noise = Array.from( {length: height}, () => Math.random() );
                for (var i = 0; i < width; i++) {
                    pattern.push(noise);
                }
            } else {
                var noise = Array.from( {length: width}, () => Math.random() );
                for (var i = 0; i < height; i++) {
                    pattern.push(Array.from( {length: height}, () => noise[i] ));
                }
            }
            flattenedArray = [].concat.apply([], pattern);
            return flattenedArray;
        },

        whiteNoise: function ( layerDefinition, width, height ) {
            return Array.from( {length: width * height}, () => Math.random() );
        },

    } // createPattern.prototype

    return createPattern;

});
