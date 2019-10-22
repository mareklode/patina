define([], function() {

    noise = {

        createNoisemap: function (width, height) {
            var noiseMap = {};

            console.log('noise Map _noise.js');

            noiseMap.width = width;
            noiseMap.height = height;
            noiseMap.imgData = [];

            for ( var i=0; i < width; i++ ) {
               noiseMap.imgData[i] = new Array;
            }

            return noiseMap;
        }, // _createNoisemap()

        _zufall: function (noiseMap) {
            var tmpNoiseMap = this.diamondSquareNoise(noiseMap.width);

            for (var i = 0; i < noiseMap.width; i++ ) {
                for (var j = 0; j < noiseMap.height; j++ ) {
                    noiseMap.imgData[i][j] = tmpNoiseMap[i][j];
                }
            }
        }, // zufall()



        // https://sdm.scad.edu/faculty/mkesson/vsfx419/wip/best/winter12/jonathan_mann/noise.html
        diamondSquareNoise: function (width) {

            var max=0,
                min=0,
                aktX,aktY,
                noiseMapWidth = (function() {
                        var powerOfTwo = 2;
                        while (powerOfTwo < width) {
                            powerOfTwo *= 2;
                        }
                        return powerOfTwo;
                    })(),
                b = noiseMapWidth, // die jeweils aktuelleBreite der Unterquadrate
                bh = b/2, // halbe Breite (oft benutzte Zahl)
                displacementDistance,
                averageColor, range = b,
                chunkSize = b/2,// * b,
                noiseMap = [],
                gräbengraben = false;

            // console.log('noiseMapWidth: ', noiseMapWidth);

            // creating the array
            for ( var step = 0; step <= b; step++) {
                noiseMap[step] = [];
            }
            // setting the corners to the same color
            noiseMap[0][0] = 0;
            noiseMap[b][0] = 0;
            noiseMap[0][b] = 0;
            noiseMap[b][b] = 0;

            // repeating the displacement steps down to pixel level
            while (b >= 2) {

                // diamondStep:
                // take a square (first is the whole area),
                // calculate average of corners,
                // add random number (displacement distance)
                // and assign new value to center of the square
                for ( aktX = 0; aktX < noiseMapWidth; aktX=aktX+b ){
                    for ( aktY = 0; aktY < noiseMapWidth; aktY=aktY+b ){
                        // set range for displacement distance
                        if ( b < chunkSize) {
                            range = b * 1.414 + (1/b) +3.1415;
                        } else {
                            range = 0;
                        }
                        displacementDistance = this.randomFromTo( -range , range );

                        // calculate average of the corners
                        averageColor = ( noiseMap[aktX][aktY]
                                       + noiseMap[aktX+b][aktY]
                                       + noiseMap[aktX][aktY+b]
                                       + noiseMap[aktX+b][aktY+b]
                                       ) / 4;
                        try {
                            // assign new value to center of the square
                            noiseMap[aktX+bh][aktY+bh] = averageColor + displacementDistance;

                            // need min & max for stretching to color space
                            if (noiseMap[aktX+bh][aktY+bh]>max) max=noiseMap[aktX+bh][aktY+bh];
                            if (noiseMap[aktX+bh][aktY+bh]<min) min=noiseMap[aktX+bh][aktY+bh];
                        } catch (e) {
                            console.error(aktX, aktY, bh, e);
                        }
                    }
                }

                // squareStep:
                // take a diamond
                // alle rauten nehmen, mitte auslenken (quadrate erzeugen)
                for ( aktX=0; aktX < ( (noiseMapWidth-1) ); aktX=aktX+b ){
                    for ( aktY=0; aktY< ( (noiseMapWidth-1) ); aktY=aktY+b ){
                        if ( b < chunkSize ) {
                            range = b + (1/b) +3.1415;
                        } else {
                            range = 0;
                        }

                        if ( aktY == 0 ){
                            feldOben = noiseMap[aktX+bh][noiseMapWidth-bh];
                        } else {
                            feldOben = noiseMap[aktX+bh][aktY-bh];
                        }

                        // calculate average of the corners
                        averageColor = ( noiseMap[aktX][aktY]
                                       + noiseMap[aktX+b][aktY]
                                       + feldOben
                                       + noiseMap[aktX+bh][aktY+bh]
                                       ) / 4;

                        displacementDistance = this.randomFromTo( -range , range );
                        // assign new value to center of the square
                        noiseMap[aktX+bh][aktY] = averageColor + displacementDistance;

                        if (noiseMap[aktX+bh][aktY]>max) max=noiseMap[aktX+bh][aktY];
                        if (noiseMap[aktX+bh][aktY]<min) min=noiseMap[aktX+bh][aktY];

                        if (aktX == 0){
                            feldLinks = noiseMap[noiseMapWidth-bh][aktY+bh];
                        } else {
                            feldLinks = noiseMap[aktX-bh][aktY+bh];
                        }
                        // calculate average of the corners
                        averageColor = ( noiseMap[aktX][aktY]
                                       + noiseMap[aktX+b][aktY]
                                       + noiseMap[aktX+bh][aktY+bh]
                                       + feldLinks
                                       ) / 4;
                        displacementDistance = this.randomFromTo( -range, range );
                        // assign new value to center of the square
                        noiseMap[aktX][aktY+bh]=averageColor + displacementDistance;

                        // need min & max for stretching to color space
                        if (noiseMap[aktX][aktY+bh]>max) max = noiseMap[aktX][aktY+bh];
                        if (noiseMap[aktX][aktY+bh]<min) min = noiseMap[aktX][aktY+bh];
                    }
                }

                // borders
                for ( i=0; i<=noiseMapWidth; i++){
                    noiseMap[noiseMapWidth][i]=noiseMap[0][i];
                    noiseMap[i][noiseMapWidth]=noiseMap[i][0];
                }
                b = b/2;
                bh = b/2;
            } // while

            if (gräbengraben) {
                console.log(max, min);
                max = Math.abs(max > -min ? max : min) / 4;
                console.log(max);
            }

            // stretching to color space
            var stretchFromZeroTo = 1, // or 255
                by = stretchFromZeroTo / (max - min); // how much to stretch

            for ( i = 0; i < noiseMapWidth; i++ ) {
                for ( j = 0; j < noiseMapWidth; j++ ) {
                    var ausgabe = false;
                    if (Math.random() > 0.995) {
                        ausgabe = true;
                    }
                    if (gräbengraben && noiseMap[i][j] < 0) {
                        noiseMap[i][j] *= -1;
                    }
                    noiseMap[i][j] = ( noiseMap[i][j]-min )*by;
                }
            }

            var noiseString = new Array();
            for (var y = 0; y < width; y++) {
                noiseMap[y].pop(); // every line was one pixel too long. I don't know why.
                noiseString = noiseString.concat(noiseMap[y]);
            }
            // debugger
            return noiseString;

        }, // diamondSquareNoise()

        // helperfunction, i do need this for perlin noise
        randomFromTo: function( from, to ) {
            return ( Math.random() * ( to - from ) ) + from;
        } // randomFromTo()

    }

    return noise;

});
