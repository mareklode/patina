import noise from './mel_noise.js';

// http://codeblog.cz/vanilla/inside.html#set-element-html
// https://github.com/daneden/animate.css

async function createPattern (layerDefinition, width, height) {
    let pattern = {};

    let waitMilliseconds = function (delay) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve();
            }, delay);
        });
    };

    // sometimes instead of pattern: { name: and so on } you can use the shortcut patternName: "name" without parameters
    let patternName = layerDefinition?.patternName || layerDefinition?.patternConfig?.name;

    if (patternName in createPattern.prototype) {
        mel.printTime(`createPattern: ${patternName}`);
        // Warten, falls die Methode asynchron ist
        await waitMilliseconds(50); // So the Page stays responsive while calculating patinas

        pattern = await createPattern.prototype[patternName](layerDefinition?.patternConfig, width, height);
    } else {
        console.error(`createPattern: "${patternName}" does not exist.`, layerDefinition);
        pattern = await createPattern.prototype["flat"]({ color: 0 }, width, height);
    }

    return pattern;
}; // createPattern()

createPattern.prototype = {
    _convertByteToFractionOfOne: function (integer) {
        return integer / 256;
    },

    async border (layerDefinition, width, height) {
        let pattern = new Array(width * height);
        for (let i = 0; i < width; i++) {
            for (let j = 0; j < height; j++) {
                const linearX = i / (width - 1);
                const linearY = j / (height - 1);

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

    async noise_plasma (layerDefinition, width, height) {
        return noise.noise_plasma(width, layerDefinition?.frequency); // frequency defaults to 1
        //return noise.diamondSquare(layerDefinition?.frequency, width, height);
    },

    // better use the number-Shortcut like { "layerTop" : 256 }
    async flat (layerDefinition, width, height) {
        let color = layerDefinition?.color || layerDefinition?.frequency || 128;
        if (!isNaN(layerDefinition)) {
            color = layerDefinition;
        }
        return Array.from({ length: width * height }, () => color / 256);
    },

    async wave (layerDefinition, width, height) {
        const pattern = new Array(width * height);

        const frequency = width / layerDefinition?.frequency / 6.2832 || width / 31.4156; // default: 5 waves per width
        const offsetX = layerDefinition?.offsetX || width / 2;
        const offsetY = layerDefinition?.offsetY || width / 2;

        let color = 0;
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {

                switch (layerDefinition?.direction) {
                    case 'concentric':
                        color = Math.sin(Math.sqrt(((x - offsetX) * (x - offsetX)) + ((y - offsetY) * (y - offsetY))) / frequency);
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
        return pattern;

    }, // wave()

    async slope (layerDefinition, width, height) {
        const pattern = new Array(width * height);

        const direction = layerDefinition?.direction || "to bottom"; // to bottom, to top, to left, and to right,
        let colorBegin = this._convertByteToFractionOfOne(layerDefinition?.colorBegin);
        if (!colorBegin && colorBegin !== 0) {
            colorBegin = 1;
        }
        let colorEnd = this._convertByteToFractionOfOne(layerDefinition?.colorEnd);
        if (!colorEnd && colorEnd !== 0) {
            colorEnd = 0;
        }

        /*
        Geradengleichung (Normalform): y = mx + n 
        m = (y2 - y1) / (x2 - x1) = (colorEnd - colorBegin) / (width - 0)
        n = colorBegin
            =>
        y = ((colorEnd - colorBegin) / width) * xPos + colorBegin
        */

        if (direction === "to top") {
            for (let x = 0; x < width; x++) {
                for (let y = 0; y < height; y++) {
                    let position = y * width + x;
                    pattern[position] = ((colorBegin - colorEnd) / height) * y + colorEnd;
                }
            }
        } else if (direction === "to right" || direction === "horizontal") {
            for (let x = 0; x < width; x++) {
                for (let y = 0; y < height; y++) {
                    let position = y * width + x;
                    pattern[position] = ((colorEnd - colorBegin) / width) * x + colorBegin;
                }
            }
        } else if (direction === "to left") {
            for (let x = 0; x < width; x++) {
                for (let y = 0; y < height; y++) {
                    let position = y * width + x;
                    pattern[position] = ((colorBegin - colorEnd) / width) * x + colorEnd;
                }
            }
        } else { // default: direction === "to bottom" || direction === "vertical") 
            for (let x = 0; x < width; x++) {
                for (let y = 0; y < height; y++) {
                    let position = y * width + x;
                    pattern[position] = ((colorEnd - colorBegin) / height) * y + colorBegin;
                }
            }
        }
        return pattern;
    }, // slope()

    async labyrinth (layerDefinition, width, height) {
        let pattern = new Array(width * height).fill(0);

        // Labyrinth
        let punkteAbstand = layerDefinition?.spacing || 4;
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
                    if (xPos >= 0 && xPos < width && yPos >= 0 && yPos < height) {
                        pattern[yPos * width + xPos] = 1;
                    }
                }
            }
        }
        return pattern;
    }, // labyrinth()

    async noise_1D (layerDefinition, width, height) {
        const pattern = [];

        const direction = layerDefinition?.direction;

        if (direction === "horizontal") {
            let noise = Array.from({ length: height }, () => Math.random());
            for (let i = 0; i < width; i++) {
                pattern.push(Array.from({ length: width }, () => noise[i]));
            }
        } else { // vertical
            let noise = Array.from({ length: width }, () => Math.random());
            for (let i = 0; i < height; i++) {
                pattern.push(noise);
            }
        }
        let flattenedArray = [].concat.apply([], pattern);
        return flattenedArray;
    }, // noise_1D()

    async noise_white (layerDefinition, width, height) {
        return Array.from({ length: width * height }, () => Math.random());
    }, // noise_white()

    async random_walker (layerDefinition, width, height) {
        const pattern = new Array(width * height).fill(0);

        const impact = layerDefinition?.impact || 5;
        const steps = layerDefinition?.steps || 1; // this times the nuber of pixels in the patina

        // start at the center (no, start )
        const walkerPos = {
            x: Math.floor(Math.min(height, width) / 2),
            y: Math.floor(Math.min(height, width) / 2)
        };

        let walkerColor = 0;
        function walker (colour) {
            walkerPos.x = (walkerPos.x + Math.round(Math.random() * 2 - 1) + width) % width; // wraps around at the edges
            walkerPos.y = (walkerPos.y + Math.round(Math.random() * 2 - 1) + height) % height; // wraps around at the edges
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

        const numberOfSteps = steps * height * width;
        for (let i = 0; i < numberOfSteps; i++) {
            walkerColor += .0125 / numberOfSteps;
            walker(walkerColor);
        }
        return pattern;
    }, // random_walker()

    async rays (layerDefinition, width, height) {
        const pattern = new Array(width * height);

        const count = layerDefinition?.count || layerDefinition?.frequency || 16;
        const offsetX = layerDefinition?.offsetX || 0;
        const offsetY = layerDefinition?.offsetY || 0;
        const sharpen = layerDefinition?.sharpen || 10;
        const rotation = layerDefinition?.rotation || 0;

        // https://easings.net/ // with functions
        function easeInOutExponent (x, exponent) {
            return x < 0.5 ? Math.pow(2, exponent - 1) * Math.pow(x, exponent) : 1 - Math.pow(-2 * x + 2, exponent) / 2;
        }

        let centerX = Math.round((width / 2) + offsetX);
        let centerY = Math.round((height / 2) + offsetY);

        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                let vector = [x - centerX, y - centerY];
                // https://stackoverflow.com/questions/32219051/how-to-convert-cartesian-coordinates-to-polar-coordinates-in-js
                let colorAlpha = Math.atan2(vector[0], vector[1]) * (180 / Math.PI) + 180 + rotation; // and convert radians to degrees

                let rayWidth = 360 / count;
                let fractionOfRayWidth = (colorAlpha % rayWidth) / rayWidth;

                let position = y * width + x;
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

// ============ PARAMETER METADATA ============
// Describes what parameters each pattern function requires
createPattern.parameterMetadata = {
    flat: {
        name: 'Flat Color',
        description: 'Solid single color',
        parameters: {
            color: { type: 'number', min: 0, max: 256, default: 128, description: 'Color value (0-256)' },
        }
    },
    border: {
        name: 'Border',
        description: 'Border effect from edges',
        parameters: {}
    },
    wave: {
        name: 'Wave',
        description: 'Wave patterns',
        parameters: {
            direction: { type: 'select', values: ['concentric', 'horizontal', 'rectangles', 'diagonalUp', 'diagonalDown', 'vertical'], default: 'vertical', description: 'Wave direction' },
            frequency: { type: 'number', min: 1, max: 50, default: 5, description: 'Waves per width' },
            offsetX: { type: 'number', default: null, nullable: true, description: 'Horizontal offset (center if null)' },
            offsetY: { type: 'number', default: null, nullable: true, description: 'Vertical offset (center if null)' },
        }
    },
    slope: {
        name: 'Slope / Gradient',
        description: 'Linear color gradient',
        parameters: {
            direction: { type: 'select', values: ['to top', 'to right', 'to left', 'to bottom', 'horizontal', 'vertical'], default: 'to bottom', description: 'Gradient direction' },
            colorBegin: { type: 'number', min: 0, max: 256, default: 256, description: 'Starting color (0-256)' },
            colorEnd: { type: 'number', min: 0, max: 256, default: 0, description: 'Ending color (0-256)' }
        }
    },
    labyrinth: {
        name: 'Labyrinth',
        description: 'Random maze pattern',
        parameters: {
            spacing: { type: 'number', min: 1, max: 50, default: 4, description: 'Point spacing in pixels' }
        }
    },
    noise_white: {
        name: 'White Noise',
        description: 'Random noise',
        parameters: {}
    },
    noise_1D: {
        name: 'Noise 1D',
        description: 'One-dimensional noise pattern',
        parameters: {
            direction: { type: 'select', values: ['horizontal', 'vertical'], default: 'vertical', description: 'Noise direction' }
        }
    },
    noise_plasma: {
        name: 'Plasma / Perlin Noise',
        description: 'Natural-looking noise (requires mel_noise.js)',
        parameters: {
            frequency: { type: 'number', min: 1, max: 10, step: 1, default: 1, description: 'Noise frequency' }
        }
    },
    random_walker: {
        name: 'Random Walker',
        description: 'Organic pattern from random steps',
        parameters: {
            steps: { type: 'number', min: 1, max: 10, default: 1, description: 'Multiplier for number of steps (times pixel count)' },
            impact: { type: 'number', min: 1, max: 20, default: 5, description: 'Intensity of effect' },
        }
    },
    rays: {
        name: 'Rays',
        description: 'Radial rays from center',
        parameters: {
            count: { type: 'number', min: 1, max: 100, default: 16, description: 'Number of rays' },
            offsetX: { type: 'number', default: 0, description: 'Horizontal center offset' },
            offsetY: { type: 'number', default: 0, description: 'Vertical center offset' },
            sharpen: { type: 'number', min: 0, max: 50, default: 10, description: 'Ray sharpness (0=binary, higher=softer)' },
            rotation: { type: 'number', min: 0, max: 360, default: 0, description: 'Rotation in degrees' }
        }
    }
};

// ============ FORM GENERATOR ============
// Dynamically generates HTML form inputs based on parameter metadata
createPattern.generateParameterForm = function (patternName, patternConfig = {}) {
    const metadata = createPattern.parameterMetadata[patternName];
    if (!metadata) {
        console.warn(`No metadata found for pattern: ${patternName}`);
        return '';
    }

    let html = ""; /* 
    `<!-- fieldset class="pattern-parameters" data-pattern="${patternName}">
        <legend>${metadata.name}</legend>
        <p class="pattern-description">${metadata.description}</p> -->`; */


    Object.entries(metadata.parameters).forEach(([paramKey, paramDef]) => {
        const id = `param_${patternName}_${paramKey}`;
        const required = !paramDef.optional && !paramDef.nullable ? 'required' : '';
        const label = `<label for="${id}">${paramDef.description || paramKey}</label>`;

        if (paramDef.type === 'select') {
            html += `
            ${label}
            <select id="${id}" name="${paramKey}" data-param="${paramKey}" ${required}>
            ${paramDef.values.map(v => {
                const defaultValue = patternConfig[paramKey] || v;
                return `<option value="${v}" ${v === defaultValue ? 'selected' : ''}>${v}</option>`;
            }).join('')}
            </select>
            `;
        } else if (paramDef.type === 'number') {
            const step = paramDef.step || 1;
            const min = paramDef.min !== undefined ? `min="${paramDef.min}"` : '';
            const max = paramDef.max !== undefined ? `max="${paramDef.max}"` : '';
            const value = patternConfig[paramKey] || paramDef.default;
            html += `${label}
                <input id="${id}" type="number" name="${paramKey}" data-param="${paramKey}" value="${value}" step="${step}" ${min} ${max} ${required} />`;
        }
    });

    return html;
    html += `</fieldset>`;
};

// ============ FORM DATA COLLECTOR ============
// Extracts user input from form and builds layerDefinition config
createPattern.getParametersFromForm = function (patternName, formElement) {
    const config = { name: patternName };
    const inputs = formElement.querySelectorAll('[data-param]');

    inputs.forEach(input => {
        const paramKey = input.getAttribute('data-param');
        const paramDef = createPattern.parameterMetadata[patternName].parameters[paramKey];

        let value = input.value;

        // Type conversion
        if (paramDef.type === 'number') {
            value = value === '' ? paramDef.default : parseFloat(value);
        }

        // Skip if value is default or empty
        if (value !== '' && value !== paramDef.default) {
            config[paramKey] = value;
        }
    });

    return config;
};

// ============ PATTERN SELECTOR ============
// Returns array of available patterns with metadata
createPattern.getAvailablePatterns = function () {
    return Object.keys(createPattern.parameterMetadata).map(name => ({
        name,
        ...createPattern.parameterMetadata[name]
    }));
};

export default createPattern;
