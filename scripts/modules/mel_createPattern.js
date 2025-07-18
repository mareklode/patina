import noise from './mel_noise.js';
// import canvas from './mel_canvas.js';

// http://youmightnotneedjquery.com/
// http://codeblog.cz/vanilla/inside.html#set-element-html
// https://github.com/daneden/animate.css

function createPattern (layerDefinition, width, height) {
    let pattern = {};

    // sometimes instead of pattern: { name: and so on } you can use the shortcut patternName: "name" without parameters
    let patternName = layerDefinition?.patternName || layerDefinition?.patternConfig?.name;

    if (this[patternName]) {
        if (window.consoleVerbose) {
            console.log("createPattern", patternName);
        }
        pattern = this[patternName]( layerDefinition?.patternConfig, width, height );
    } else {
        console.error("createPattern: \"", patternName, "\" does not exist.", layerDefinition);
        pattern = this["flat"]({color: 0}, width, height);
    }

    return pattern;
}; // createPattern()

createPattern.prototype = {

    _convertByteToPercent: function (integer) {
        return integer / 255;
    },

    border: function ( layerDefinition, width, height ) {
        let pattern = new Array( width * height );
        for (let i = 0; i < width; i++ ) {
            for (let j = 0; j < height; j++ ) {
                const linearX = i / ( width  - 1 );
                const linearY = j / ( height - 1 );
                
                // https://www.wolframalpha.com/ <-- plot (2*x)^2 - 4x + 1
                const circularX = Math.pow(2 * linearX, 2) - (4 * linearX) + 1;
                const circularY = Math.pow(2 * linearY, 2) - (4 * linearY) + 1;

                // https://easings.net/#easeInCirc
                pattern[j * width + i] = (
                    1 - Math.sqrt(1 - Math.pow(circularX, 2)) +
                    1 - Math.sqrt(1 - Math.pow(circularY, 2)) 
                ) / 2;
            }
        }
        return pattern;
    }, // border()

    noise_plasma: function ( layerDefinition, width, height ) {
        return noise.noise_plasma(width, layerDefinition?.frequency); // frequency defaults to 1
        //return noise.diamondSquare(layerDefinition?.frequency, width, height);
    },

    // better use the number-Shortcut like { "layerTop" : 256 }
    flat: function ( layerDefinition, width, height ) {
        const color = layerDefinition?.color || layerDefinition?.frequency || 128;
        return Array.from( {length: width * height}, () => color / 256 );
    },

    wave: function ( layerDefinition, width, height ) {
        const pattern = new Array( width * height );

        const frequency = width / layerDefinition?.frequency / 6.2832 || width / 31.4156; // default: 5 waves per width
        const offsetX = layerDefinition?.offsetX || width / 2;
        const offsetY = layerDefinition?.offsetY || width / 2;

        let color = 0;
        for (let x = 0; x < width; x++ ) {
            for (let y = 0; y < height; y++ ) {

                switch ( layerDefinition?.direction ) {
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
                pattern[y * width + x] = (-color / 2) + 0.5;
            }
        }
        return pattern
        
    }, // wave()

    slope: function ( layerDefinition, width, height ) {
        const pattern = new Array(width * height);

        const direction = layerDefinition?.direction || "to bottom"; // to bottom, to top, to left, and to right,
        const colorBegin = this._convertByteToPercent(layerDefinition?.colorBegin) || 0;
        const colorEnd = this._convertByteToPercent(layerDefinition?.colorEnd) || 1;

        /*
        Geradengleichung (Normalform): y = mx + n 
        m = (y2 - y1) / (x2 - x1) = (colorEnd - colorBegin) / (width - 0)
        n = colorBegin
            =>
        y = ((colorEnd - colorBegin) / width) * xPos + colorBegin
        */

        if (direction === "to bottom" || direction === "vertical") {
            for (let x = 0; x < width; x++) {
                for (let y = 0; y < height; y++) {
                    let position = y * width + x ;
                    pattern[position] = ((colorEnd - colorBegin) / height) * y + colorBegin;
                }
            }
        } else if (direction === "to top") {
            for (let x = 0; x < width; x++) {
                for (let y = 0; y < height; y++) {
                    let position = y * width + x ;
                    pattern[position] = ((colorBegin - colorEnd) / height) * y + colorEnd;
                }
            }
        } else if (direction === "to right" || direction === "horizontal") {
            for (let x = 0; x < width; x++) {
                for (let y = 0; y < height; y++) {
                    let position = y * width + x ;
                    pattern[position] = ((colorEnd - colorBegin) / width) * x + colorBegin;
                }
            }
        } else if (direction === "to left") {
            for (let x = 0; x < width; x++) {
                for (let y = 0; y < height; y++) {
                    let position = y * width + x ;
                    pattern[position] = ((colorBegin - colorEnd) / width) * x + colorEnd;
                }
            }
        }
        return pattern;
    }, // slope()

    labyrinth: function ( layerDefinition, width, height ) {
        let pattern = new Array(width * height).fill(0);

        /*
        const direction = layerDefinition?.direction || "to bottom";
        // to bottom, to top, to left, and to right,
        const colorBegin = this._convertByteToPercent(layerDefinition?.colorBegin) || 0;
        layerDefinition?.colorEnd = this._convertByteToPercent(layerDefinition?.colorEnd) || 1;
        */

        // Labyrinth
        let punkteAbstand = layerDefinition?.frequency || 4;
        for (let x = 0; x < width / punkteAbstand; x++) {
            for (let y = 0; y < height / punkteAbstand; y++) {
                let xRichtung = 0;
                let yRichtung = 0;
                switch (Math.floor(Math.random() * 4)) {
                    case 0: xRichtung = 1; break;
                    case 1: xRichtung = -1; break;
                    case 2: yRichtung = 1; break;
                    case 3: yRichtung = -1; break;
                }
                for (let linie = 0; linie < punkteAbstand; linie++) {
                    let xPos = x * punkteAbstand + linie * xRichtung;
                    let yPos = y * punkteAbstand + linie * yRichtung;
                    pattern[yPos * width + xPos] = 1;
                }
            }
        }
        return pattern;
    }, // labyrinth()

    noise_1D: function ( layerDefinition, width, height ) {
        const pattern = new Array();

        const direction = layerDefinition?.direction;

        if (direction === "horizontal") {
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
        let flattenedArray = [].concat.apply([], pattern);
        return flattenedArray;
    }, // noise_1D()

    noise_white: function ( layerDefinition, width, height ) {
        return Array.from( {length: width * height}, () => Math.random() );
    }, // noise_white()
    
    random_walker: function ( layerDefinition, width, height ) {
        const pattern = new Array(width * height).fill(0);

        const impact = layerDefinition?.impact || 5;

        // start at the center
        const walkerPos = {
            x: Math.floor(width/2),
            y: Math.floor(height/2)
        };

        let walkerColor = 0;
        function walker (colour) {
            walkerPos.x = (walkerPos.x + Math.round(Math.random()*2 - 1 ) + width) % width; // wraps around at the edges
            walkerPos.y = (walkerPos.y + Math.round(Math.random()*2 - 1 ) + height) % height; // wraps around at the edges
            /*         
            let farbe = myCanvas.getImgData(walkerPos.x, walkerPos.y);
            //console.log(farbe);
            if (farbe[0] > 2 || true) { farbe[0] *= 1 + (impact * .1  ); } else { farbe[0] = 0; }
            if (farbe[1] > 2 || true) { farbe[1] *= 1 + (impact * .125);  } else { farbe[1] = 0; }
            if (farbe[2] > 2 || true) { farbe[2] *= 1 + (impact * colour); } else { farbe[2] = 0; }
            myCanvas.setImgData(walkerPos.x, walkerPos.y, ...farbe);
            */
            pattern[walkerPos.y * width + walkerPos.x] += (impact * colour);

        }
        
        const numberOfSteps = 1 * height * width;
        for (let i = 0; i < numberOfSteps; i++) {
            walkerColor += .0125 / numberOfSteps;
            walker(walkerColor);
        }
        return pattern;
    }, // random_walker()
    
    rays: function ( layerDefinition, width, height ) {
        const pattern = new Array(width * height);

        const count = layerDefinition?.count || layerDefinition?.frequency || 16;
        const offsetX = layerDefinition?.offsetX || 0;
        const offsetY = layerDefinition?.offsetY || 0;
        const sharpen = layerDefinition?.sharpen || 10;
        const rotation = layerDefinition?.rotation || 0;

        // https://easings.net/ // with functions
        function easeInOutExponent(x, exponent) {
            return x < 0.5 ? Math.pow(2, exponent - 1) * Math.pow(x, exponent) : 1 - Math.pow(-2 * x + 2, exponent) / 2;
        }

        let centerX = Math.round((width / 2) + offsetX);
        let centerY = Math.round((height / 2) + offsetY);

        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                let vector = [x - centerX, y - centerY];
                // https://stackoverflow.com/questions/32219051/how-to-convert-cartesian-coordinates-to-polar-coordinates-in-js
                let colorAlpha = Math.atan2(vector[0], vector[1]) * (180 / Math.PI) + 180 + rotation ; // and convert radians to degrees
                
                let rayWidth = 360 / count;
                let fractionOfRayWidth = (colorAlpha % rayWidth) / rayWidth;

                let position = y * width + x ;
                if (sharpen) {
                    pattern[position] = easeInOutExponent(Math.abs(fractionOfRayWidth - .5) * 2, sharpen);
                } else {
                    // fast mode, just black and white
                    pattern[position] = Math.abs(fractionOfRayWidth - .5) > 0.25 ? 1 : 0;
                }
            }
        }
        return pattern;
    }, // rays() 
        
}; // createPattern.prototype
        
export default createPattern;
