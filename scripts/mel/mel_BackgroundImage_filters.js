define([], function() {

    var backgroundImage_filters = {

        border: function ( canvas, data ) {
            var position,
                j, i,
                r = data.color.r,
                g = data.color.g,
                b = data.color.b;

            for ( i = 0; i < canvas.width; i++ ) {
                canvas.imgData(
                    i, 0,
                    r, g, b,
                    this._randomByte()
                ); // oben
                canvas.imgData(
                    i, canvas.height-1,
                    r, g, b,
                    this._randomByte()
                ); // unten
            }
            i = 0;
            for ( j = 0; j < canvas.height; j++ ) {
                canvas.imgData(
                    0, j,
                    r, g, b,
                    this._randomByte()
                ); // links
                canvas.imgData(
                    canvas.width - 1, j,
                    r, g, b,
                    this._randomByte()
                ); // rechts
            }
        },
        blur: function ( data ) {},
        distort: function ( myCanvas, data, noiseMap, tmpCanvas ) {
            for (var i = 0; i < myCanvas.width; i++ ) {
                for (var j = 0; j < myCanvas.height; j++ ) {
                    var pos = this._directionFromNoise(myCanvas, i, j),
                        col;

                    col = myCanvas.getImgData(
                        i + Math.round(pos.x * data.radius),
                        j + Math.round(pos.y * data.radius)
                    )[0]

                    tmpCanvas.imgData(
                        i, j,
                        col, col, col,
                        255
                    );
                }
            }
            myCanvas.img.data.set( tmpCanvas.img.data );
        }, // distort ()

        scatter: function ( myCanvas, data, noiseMap, tmpCanvas ) {
            for (var i = 0; i < myCanvas.width; i++ ) {
                for (var j = 0; j < myCanvas.height; j++ ) {
                    var col = myCanvas.getImgData(
                            i + Math.round(Math.random() * data.radius),
                            j + Math.round(Math.random() * data.radius)
                        );
                    tmpCanvas.imgData(
                        i, j,
                        col[0], col[1], col[2],
                        col[3]
                    );
                }
            }
            myCanvas.img.data.set( tmpCanvas.img.data );
        }, // scatter()

        opacity: function ( canvas, data ) {
            for (var i = 0; i < canvas.width; i++ ) {
                for (var j = 0; j < canvas.height; j++ ) {
                    canvas.imgDataAlpha( i, j, data.opacity);
                }
            }
        },

        _randomByte: function () {
            return Math.floor(Math.random()*255);
        },

        _directionFromNoise: function (myCanvas, x, y) {
            var xSlope, ySlope;

            if ( true ) {
                xSlope =
                    myCanvas.getImgData( x+1, y-1 )[0] +
                    myCanvas.getImgData( x+1, y   )[0] +
                    myCanvas.getImgData( x+1, y+1 )[0] -
                    myCanvas.getImgData( x-1, y-1 )[0] -
                    myCanvas.getImgData( x-1, y   )[0] -
                    myCanvas.getImgData( x-1, y+1 )[0];

                ySlope =
                    myCanvas.getImgData( x-1, y+1 )[0] +
                    myCanvas.getImgData( x  , y+1 )[0] +
                    myCanvas.getImgData( x+1, y+1 )[0] -
                    myCanvas.getImgData( x-1, y-1 )[0] -
                    myCanvas.getImgData( x  , y-1 )[0] -
                myCanvas.getImgData( x+1, y-1 )[0];
            } else {
                xSlope =
                    myCanvas.getImgData( x-1, y-1 )[0] +
                    myCanvas.getImgData( x-1, y   )[0] +
                    myCanvas.getImgData( x-1, y+1 )[0] -
                    myCanvas.getImgData( x+1, y-1 )[0] -
                    myCanvas.getImgData( x+1, y   )[0] -
                    myCanvas.getImgData( x+1, y+1 )[0];

                ySlope =
                    myCanvas.getImgData( x-1, y-1 )[0] +
                    myCanvas.getImgData( x  , y-1 )[0] +
                    myCanvas.getImgData( x+1, y-1 )[0] -
                    myCanvas.getImgData( x-1, y+1 )[0] -
                    myCanvas.getImgData( x  , y+1 )[0] -
                    myCanvas.getImgData( x+1, y+1 )[0];
            }
            return {
                x: xSlope / 100,
                y: ySlope / 100
            }
        }

    } // backgroundImage_filters

    return backgroundImage_filters;

});
