define(['canvas', 'noise'], function( canvas, noise ) {

    // http://youmightnotneedjquery.com/
    // http://codeblog.cz/vanilla/inside.html#set-element-html
    // https://github.com/daneden/animate.css

    function createPattern (layerDefinition, width, height, reusableImages) {
        let pattern = {};

        if (layerDefinition.pattern && this[layerDefinition.pattern.name]) {
            console.log("createPattern: ", layerDefinition.pattern.name);
            pattern = this[layerDefinition.pattern.name]( layerDefinition.pattern, width, height );
        } else if (this[layerDefinition.patternName]) {
            console.log("createPattern: ", layerDefinition.patternName);
            pattern = this[layerDefinition.patternName]( layerDefinition, width, height );
        } else {
            let patternName = layerDefinition.patternName;
            if (layerDefinition.pattern) { patternName = layerDefinition.pattern.name }
            console.error("createPattern: \"", patternName, "\" does not exist.");
            pattern = this["flat"]({color: 0}, width, height);
        }

        return pattern;
    } // createPattern()

    createPattern.prototype = {

        border: function ( layerDefinition, width, height ) {
            let imageData = new Array( width * height );
            for (let i = 0; i < width; i++ ) {
                for (let j = 0; j < height; j++ ) {
                    let x1 = i / ( width  - 1 ),
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
        }, // border()

        noise_plasma: function ( layerDefinition, width, height ) {
            return noise.noise_plasma(width);
        },

        // better use the number-Shortcut like { "topLayer" : 256 }
        flat: function ( layerDefinition, width, height ) {
            let color = layerDefinition.color || 128;
            return Array.from( {length: width * height}, () => color / 256 );
        },

        sine: function ( layerDefinition, width, height ) {
            let imageData = new Array( width * height ),
                color = 0,
                period = width / layerDefinition.period / 6.2832 || width / 31.4156,
                offsetX = layerDefinition.offsetX || 0,
                offsetY = layerDefinition.offsetY || 0;
            for (let x = 0; x < width; x++ ) {
                for (let y = 0; y < height; y++ ) {

                    switch ( layerDefinition.direction ) {
                        case 'vertical':
                            color = Math.sin((x - offsetX)/period);
                            break;
                        case 'horizontal':
                            color = Math.sin((y - offsetY)/period);
                            break;
                        case 'rectangles':
                            color = Math.sin(((y - offsetY) * (x - offsetX))/period);
                            break;
                        case 'diagonalUp':
                            color = Math.sin(((y - offsetY) + (x - offsetX))/period);
                            break;
                        case 'diagonalDown':
                            color = Math.sin((y - offsetY - x - offsetX)/period);
                            break;
                        default: /* concentric */
                            color = Math.sin( Math.sqrt(((x - offsetX) * (x - offsetX)) + ((y - offsetY) * (y - offsetY)))/period );
                    }
                    imageData[y * width + x] = (color / 2) + 0.5;
                }
            }
            return imageData
            
        }, // sine()

        slope: function ( layerDefinition, width, height ) {
            let pattern = new Array(width * height);
            for (let x = 0; x < width; x++) {
                for (let y = 0; y < height; y++) {
                    // ToDo: changing directions must be possible
                    let position = y * width + x ;
                    pattern[position] = y / (height - 1);
                }
            }
            return pattern;
        }, // slope()

        noise_2D: function ( layerDefinition, width, height ) {
            let noise, 
                pattern = new Array(),
                flattenedArray;

            if (layerDefinition.direction === "vertical") {
                let noise = Array.from( {length: height}, () => Math.random() );
                for (let i = 0; i < width; i++) {
                    pattern.push(noise);
                }
            } else {
                let noise = Array.from( {length: width}, () => Math.random() );
                for (let i = 0; i < height; i++) {
                    pattern.push(Array.from( {length: height}, () => noise[i] ));
                }
            }
            flattenedArray = [].concat.apply([], pattern);
            return flattenedArray;
        }, // noise_2D()

        whiteNoise: function ( layerDefinition, width, height ) {
            return Array.from( {length: width * height}, () => Math.random() );
        },

    } // createPattern.prototype

    return createPattern;

});
