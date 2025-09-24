'use strict';

const noise = {
    // https://sdm.scad.edu/faculty/mkesson/vsfx419/wip/best/winter12/jonathan_mann/noise.html
    diamondSquare: function (frequency, width, height) {
        function noiseMapWidth () {
            let powerOfTwo = 2;
            while (powerOfTwo < width) {
                powerOfTwo *= 2;
            }
            return powerOfTwo;
        }
    }, // diamondSquare()
    noise_plasma: function (width, frequency) {

        frequency = frequency || 1;
        let max = 0,
            min = 0,
            aktX, aktY,
            noiseMapWidth = (function () {
                let powerOfTwo = 2;
                while (powerOfTwo < width) {
                    powerOfTwo *= 2;
                }
                return powerOfTwo;
            })(),
            b = noiseMapWidth, // die jeweils aktuelleBreite der Unterquadrate
            bh = b / 2, // halbe Breite (oft benutzte Zahl)
            displacementDistance,
            averageColor, range = b,
            chunkSize = b / 2,// * b,
            noiseMap = [],
            threshold = noiseMapWidth / frequency;

        // creating the array
        for (let step = 0; step <= b; step++) {
            noiseMap[step] = [];
        }
        // setting the corners to the same color
        noiseMap[0][0] = 0;
        noiseMap[b][0] = 0;
        noiseMap[0][b] = 0;
        noiseMap[b][b] = 0;

        // repeating the displacement steps down to pixel level
        while (b >= 2) {
            // console.log(b);

            // diamondStep:
            // take a square (first is the whole area),
            // calculate average of corners,
            // add random number (displacement distance)
            // and assign new value to center of the square
            for (aktX = 0; aktX < noiseMapWidth; aktX = aktX + b) {
                for (aktY = 0; aktY < noiseMapWidth; aktY = aktY + b) {
                    if (b > threshold) {
                        displacementDistance = 0;
                        averageColor = 0;
                    } else {
                        // set range for displacement distance
                        if (b < chunkSize) {
                            range = b * 1.414 + (1 / b) + 3.1415;
                        } else {
                            range = 0;
                        }
                        displacementDistance = this.randomFromTo(-range, range);

                        // calculate average of the corners
                        averageColor = (noiseMap[aktX][aktY]
                            + noiseMap[aktX + b][aktY]
                            + noiseMap[aktX][aktY + b]
                            + noiseMap[aktX + b][aktY + b]
                        ) / 4;
                    }
                    try {
                        // assign new value to center of the square
                        noiseMap[aktX + bh][aktY + bh] = averageColor + displacementDistance;

                        // need min & max for stretching to color space
                        if (noiseMap[aktX + bh][aktY + bh] > max) max = noiseMap[aktX + bh][aktY + bh];
                        if (noiseMap[aktX + bh][aktY + bh] < min) min = noiseMap[aktX + bh][aktY + bh];
                    } catch (e) {
                        console.error(aktX, aktY, bh, e);
                    }
                }
            }

            // squareStep:
            // take a diamond
            // add random number (displacement distance) to average of corners
            // and assign new value to center of the diamond
            for (aktX = 0; aktX < ((noiseMapWidth - 1)); aktX = aktX + b) {
                for (aktY = 0; aktY < ((noiseMapWidth - 1)); aktY = aktY + b) {
                    if (b > threshold) {
                        displacementDistance = 0;
                        averageColor = 0;
                    } else {
                        if (b < chunkSize) {
                            range = b + (1 / b) + 3.1415;
                        } else {
                            range = 0;
                        }

                        let feldOben;
                        if (aktY == 0) {
                            feldOben = noiseMap[aktX + bh][noiseMapWidth - bh];
                        } else {
                            feldOben = noiseMap[aktX + bh][aktY - bh];
                        }

                        // calculate average of the corners
                        averageColor = (noiseMap[aktX][aktY]
                            + noiseMap[aktX + b][aktY]
                            + feldOben
                            + noiseMap[aktX + bh][aktY + bh]
                        ) / 4;

                        displacementDistance = this.randomFromTo(-range, range);
                    }
                    // assign new value to center of the square
                    noiseMap[aktX + bh][aktY] = averageColor + displacementDistance;

                    if (noiseMap[aktX + bh][aktY] > max) max = noiseMap[aktX + bh][aktY];
                    if (noiseMap[aktX + bh][aktY] < min) min = noiseMap[aktX + bh][aktY];

                    let feldLinks;
                    if (aktX == 0) {
                        feldLinks = noiseMap[noiseMapWidth - bh][aktY + bh];
                    } else {
                        feldLinks = noiseMap[aktX - bh][aktY + bh];
                    }

                    if (b > threshold) {
                        displacementDistance = 0;
                        averageColor = 0;
                    } else {

                        // calculate average of the corners
                        averageColor = (noiseMap[aktX][aktY]
                            + noiseMap[aktX + b][aktY]
                            + noiseMap[aktX + bh][aktY + bh]
                            + feldLinks
                        ) / 4;
                        displacementDistance = this.randomFromTo(-range, range);
                        // assign new value to center of the square
                    }
                    noiseMap[aktX][aktY + bh] = averageColor + displacementDistance;

                    // need min & max for stretching to color space
                    if (noiseMap[aktX][aktY + bh] > max) max = noiseMap[aktX][aktY + bh];
                    if (noiseMap[aktX][aktY + bh] < min) min = noiseMap[aktX][aktY + bh];
                }
            }

            // copy border colors to opposite border
            for (let i = 0; i <= noiseMapWidth; i++) {
                noiseMap[noiseMapWidth][i] = noiseMap[0][i];
                noiseMap[i][noiseMapWidth] = noiseMap[i][0];
            }
            b = b / 2;
            bh = b / 2;
        } // while

        // stretching to color space
        const stretchFromZeroTo = 1, // or 255
            by = stretchFromZeroTo / (max - min); // how much to stretch

        for (let i = 0; i < noiseMapWidth; i++) {
            for (let j = 0; j < noiseMapWidth; j++) {
                noiseMap[i][j] = (noiseMap[i][j] - min) * by;
            }
        }

        let noiseString = new Array();
        for (let y = 0; y < noiseMapWidth; y++) {
            // here the end of every line gets sliced off, 
            // if the canvas width is not a power of 2
            noiseString = noiseString.concat(noiseMap[y].slice(0, width));
        }
        // debugger
        return noiseString;

    }, // noise_plasma()

    randomFromTo: function (from, to) {
        return (Math.random() * (to - from)) + from;
    } // randomFromTo()

}

export default noise;
