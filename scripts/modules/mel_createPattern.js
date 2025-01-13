import noise from './mel_noise.js';
// import canvas from './mel_canvas.js';

// http://youmightnotneedjquery.com/
// http://codeblog.cz/vanilla/inside.html#set-element-html
// https://github.com/daneden/animate.css

function createPattern (layerDefinition, width, height, reusableImages) {
    let pattern = {};

    if (layerDefinition.pattern && this[layerDefinition.pattern.name]) {
        if (window.consoleVerbose) {
            console.log("createPattern 1: ", layerDefinition.pattern.name);
        }
        pattern = this[layerDefinition.pattern.name]( layerDefinition.pattern, width, height );
    } else if (this[layerDefinition.patternName]) {
        if (window.consoleVerbose) {
            console.log("createPattern 2: ", layerDefinition.patternName);
        }
        pattern = this[layerDefinition.patternName]( layerDefinition, width, height );
    } else {
        let patternName = layerDefinition.patternName;
        if (layerDefinition.pattern) { patternName = layerDefinition.pattern.name }
        console.error("createPattern: \"", patternName, "\" does not exist.", layerDefinition);
        pattern = this["flat"]({color: 0}, width, height);
    }

    return pattern;
}; // createPattern()

createPattern.prototype = {

    _convertByteToPercent: function (integer) {
        //console.log('hallo');
        return integer / 255;
    },

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
        //return noise.diamondSquare(layerDefinition.frequency, width, height);
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
        layerDefinition.direction = layerDefinition.direction || "to bottom";
        // to bottom, to top, to left, and to right,
        layerDefinition.colorBegin = this._convertByteToPercent(layerDefinition.colorBegin) || 0;
        layerDefinition.colorEnd = this._convertByteToPercent(layerDefinition.colorEnd) || 1;

        /*
        Geradengleichung (Normalform): y = mx + n 
        m = (y2 - y1) / (x2 - x1) = (colorEnd - colorBegin) / (width - 0)
        n = colorBegin
            =>
        y = ((colorEnd - colorBegin) / width) * xPos + colorBegin
        */

        if (layerDefinition.direction === "to bottom") {
            for (let x = 0; x < width; x++) {
                for (let y = 0; y < height; y++) {
                    let position = y * width + x ;
                    pattern[position] = ((layerDefinition.colorEnd - layerDefinition.colorBegin) / height) * y + layerDefinition.colorBegin;
                }
            }
        } else if (layerDefinition.direction === "to top") {
            for (let x = 0; x < width; x++) {
                for (let y = 0; y < height; y++) {
                    let position = y * width + x ;
                    pattern[position] = ((layerDefinition.colorBegin - layerDefinition.colorEnd) / height) * y + layerDefinition.colorEnd;
                }
            }
        } else if (layerDefinition.direction === "to right") {
            for (let x = 0; x < width; x++) {
                for (let y = 0; y < height; y++) {
                    let position = y * width + x ;
                    pattern[position] = ((layerDefinition.colorEnd - layerDefinition.colorBegin) / width) * x + layerDefinition.colorBegin;
                }
            }
        } else if (layerDefinition.direction === "to left") {
            for (let x = 0; x < width; x++) {
                for (let y = 0; y < height; y++) {
                    let position = y * width + x ;
                    pattern[position] = ((layerDefinition.colorBegin - layerDefinition.colorEnd) / width) * x + layerDefinition.colorEnd;
                }
            }
        }
        return pattern;
    }, // slope()

    labyrinth: function ( layerDefinition, width, height ) {
        let pattern = new Array(width * height).fill(0);

        /*
        const direction = layerDefinition.direction || "to bottom";
        // to bottom, to top, to left, and to right,
        const colorBegin = this._convertByteToPercent(layerDefinition.colorBegin) || 0;
        layerDefinition.colorEnd = this._convertByteToPercent(layerDefinition.colorEnd) || 1;
        */

        // Labyrinth
        let punkteAbstand = 4;
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
    }, // noise_white()
    
    random_walker: function ( layerDefinition, width, height ) {
        let pattern = new Array(width * height).fill(0);

        let walkerPos = {
            x: Math.floor(width/2),
            y: Math.floor(height/2)
        };

        let walkerColor = 0;
        function walker (colour) {
            const impact = layerDefinition.impact || 5;

            walkerPos.x = (walkerPos.x + Math.round(Math.random()*2 - 1 ) + width) % width;
            walkerPos.y = (walkerPos.y + Math.round(Math.random()*2 - 1 ) + height) % height;
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
        
        for (let i = 0; i < 1 * height * width; i++) {
            walkerColor += 0.0000000125;
            walker(walkerColor);
        }
        return pattern;
    }, // random_walker()

}; // createPattern.prototype

export default createPattern;
