import canvas from './mel_canvas.js';
import noise from './mel_noise.js';

// http://youmightnotneedjquery.com/
// http://codeblog.cz/vanilla/inside.html#set-element-html
// https://github.com/daneden/animate.css

function createPattern (layerDefinition, width, height, reusableImages) {
    let pattern = {};

    if (layerDefinition.pattern && this[layerDefinition.pattern.name]) {
        if (window.consoleVerbose) {
            console.log("createPattern: ", layerDefinition.pattern.name);
        }
        pattern = this[layerDefinition.pattern.name]( layerDefinition.pattern, width, height );
    } else if (this[layerDefinition.patternName]) {
        if (window.consoleVerbose) {
            console.log("createPattern: ", layerDefinition.patternName);
        }
        pattern = this[layerDefinition.patternName]( layerDefinition, width, height );
    } else {
        let patternName = layerDefinition.patternName;
        if (layerDefinition.pattern) { patternName = layerDefinition.pattern.name }
        console.error("createPattern: \"", patternName, "\" does not exist.", layerDefinition);
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
        return noise.noise_plasma(width, layerDefinition.frequency);
    },

    // better use the number-Shortcut like { "topLayer" : 256 }
    flat: function ( layerDefinition, width, height ) {
        let color = layerDefinition.color || 128;
        return Array.from( {length: width * height}, () => color / 256 );
    },

    wave: function ( layerDefinition, width, height ) {
        let imageData = new Array( width * height ),
            color = 0,
            frequency = width / layerDefinition.frequency / 6.2832 || width / 31.4156, // default: 5 waves per width
            offsetX = layerDefinition.offsetX || 0,
            offsetY = layerDefinition.offsetY || 0;
        for (let x = 0; x < width; x++ ) {
            for (let y = 0; y < height; y++ ) {

                switch ( layerDefinition.direction ) {
                    case 'concentric':
                        color = Math.sin( Math.sqrt(((x - offsetX) * (x - offsetX)) + ((y - offsetY) * (y - offsetY))) / frequency );
                        break;
                    case 'horizontal':
                        color = Math.sin((y - offsetY) / frequency);
                        break;
                    case 'rectangles':
                        color = Math.sin(((y - offsetY) * (x - offsetX)) / frequency);
                        break;
                    case 'diagonalUp':
                        color = Math.sin(((y - offsetY) + (x - offsetX)) / frequency);
                        break; 
                    case 'diagonalDown':
                        color = Math.sin((y - offsetY - x - offsetX) / frequency);
                        break;
                    default: /* vertical */
                        color = Math.sin((x - offsetX) / frequency);
                }
                imageData[y * width + x] = (-color / 2) + 0.5;
            }
        }
        return imageData
        
    }, // wave()

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

    noise_1D: function ( layerDefinition, width, height ) {
        let noise, 
            pattern = new Array(),
            flattenedArray;

        if (layerDefinition.direction === "horizontal") {
            let noise = Array.from( {length: height}, () => Math.random() );
            for (let i = 0; i < width; i++) {
                pattern.push(Array.from( {length: width}, () => noise[i] ));
            }
        } else { // vertical
            let noise = Array.from( {length: width}, () => Math.random() );
            for (let i = 0; i < height; i++) {
                pattern.push(noise);
            }
        }
        flattenedArray = [].concat.apply([], pattern);
        return flattenedArray;
    }, // noise_1D()

    noise_white: function ( layerDefinition, width, height ) {
        return Array.from( {length: width * height}, () => Math.random() );
    },

} // createPattern.prototype

export default createPattern;