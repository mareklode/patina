function backgroundImage( parameters ) {

    /* Usage

        var background = new backgroundImage({
            selector: '#displaycanvas', // defaults to 'body'
            noiseMode: 'color', // defaults to gray
            chunkSize: 550, // for noise
            height: 256, // defaults to selector-Element dimensions
            width: 256, // defaults to selector-Element dimensions
            alpha: 30 // 0-255 defaults to 255
            wood: 17
        });

        $( '#displaycanvas' ).bind(
            'click',
            function() {
                hauwech.filter({
                    selector: this
                });
            }
        );

    */

    this._parameters = parameters || {};

    if (this._parameters.selector) {
        this.$selector = $(this._parameters.selector);
    } else {
        this.$selector = $('body');
    }

    // set the sizes or use the destinations dimensions
    this.w = this._parameters.width || this.$selector.innerWidth();
    this.h = this._parameters.height || this.$selector.innerHeight();

    this.alpha = this._parameters.alpha || false;

    this.noiseMode = this._parameters.noiseMode || 'gray';
    this.noiseMap = [];
    this.noiseMapSize = 2;
    this.chunkSize = this._parameters.chunkSize || this.w*this.h;

    this._init = function() {
        this.canvas = this._newcanvas();

        // noisemap will be an exponent of 2
        // and square for diamond-square
        while (true) {
            this.noiseMapSize *=2;
            if ( this.noiseMapSize >= this.w && this.noiseMapSize >= this.h ) break;
        }
        this.diamondSquareNoise();

        if ( this.noiseMode == 'gray' ){
            this.stretchNoiseToCanvas( 'setGray' );
        } else {
            this.stretchNoiseToCanvas( 'setRed' );
            this.diamondSquareNoise();
            this.stretchNoiseToCanvas( 'setGreen' );
            this.diamondSquareNoise();
            this.stretchNoiseToCanvas( 'setBlue' );
        }

        if ( parameters['wood'] ){
            this.NoiseBodyBackground( parameters['wood'] );
        }

        if ( parameters['woodHeader'] ){
            this.NoiseToWood( parameters['woodHeader'] );
        }

        if ( this.alpha ) {
            this.apply( 'setAlpha', this.canvas, this.alpha ); // 2Do this.alpha auf 256 setzen?
        } else {
            this.apply( 'setAlpha', this.canvas, 256 );
        }
        this.canvas.paintit( this.$selector );
    } // _init()

    // that function is used publicly to change an existing background entity
    this.filter = function( parameters ) {
        if ( parameters['noiseMode'] ){
            if ( parameters['chunkSize'] ) {
                this.diamondSquareNoise( parameters['chunkSize'] );
            } else {
                this.diamondSquareNoise();
            }
            switch ( parameters['noiseMode'] ){
                case "red":
                    this.stretchNoiseToCanvas( 'setRed' );
                    break;
                case "green":
                    this.stretchNoiseToCanvas( 'setGreen' );
                    break;
                case "blue":
                    this.stretchNoiseToCanvas( 'setBlue' );
                    break;
                case "color":
                    this.stretchNoiseToCanvas( 'setRed' );
                    this.diamondSquareNoise();
                    this.stretchNoiseToCanvas( 'setGreen' );
                    this.diamondSquareNoise();
                    this.stretchNoiseToCanvas( 'setBlue' );
                    break;
                default:
                    // set all 3 color channels
                    this.stretchNoiseToCanvas( 'setGray' );
                    // this.apply( 'setAlpha', this.canvas, 255 );
            }
        }
        if ( parameters['alpha'] ){
            this.apply( 'setAlpha', this.canvas, parameters['alpha'] );
        }
        if ( parameters['wood'] ){
            this.NoiseToWood( parameters['wood'] );
        }
        this.canvas.paintit( this.$selector );
    } // filter()

    this._newcanvas = function() {
        var newcanvas = document.createElement('canvas');
        newcanvas.width = this.w;
        newcanvas.height = this.h;

        newcanvas.context = newcanvas.getContext('2d');
        newcanvas.img = newcanvas.context.createImageData(this.w, this.h);

        newcanvas.paintit = function( $selector ) {
            newcanvas.context.putImageData( newcanvas.img, 0, 0 );
            $selector.css({
                backgroundImage: 'url(' + newcanvas.toDataURL('image/png') + ')',
                backgroundRepeat: 'repeat'
            });
        }

        return newcanvas;
    } // newcanvas()

    this.setGray = function( imgdata, position, value ) {
        imgdata[ position ] = value;   //r
        imgdata[ position +1] = value; //g
        imgdata[ position +2] = value; //b
        // imgdata[ position +3] = 255;  //a
    } // setGray()
    this.setRed = function( imgdata, position, value ) {
        imgdata[ position ] = value;   //r
    } // setRed()
    this.setGreen = function( imgdata, position, value ) {
        imgdata[ position +1] = value; //g
    } // setGreen()
    this.setBlue = function( imgdata, position, value ) {
        imgdata[ position +2] = value; //b
    } // setBlue()

    this.setAlpha = function( imgdata, position, value ) {
        imgdata[ position +3] = value;  //a
    } // setAlpha()

    this.greynoise = function( imgdata, position ) {
        grey = Math.random() * 255;
        imgdata[ position ] = grey;   //r
        imgdata[ position +1] = grey; //g
        imgdata[ position +2] = grey; //b
        imgdata[ position +3] = 255;  //a
    } // greynoise()

    // to me this is magic stuff.
    // calling functions by the string of their name
    this._callafunction = function( func, imgdata, position, value ){
        // obviously you can call a function with too many parameters, weird
        this[func]( imgdata, position, value );
    } // callafunction()
    this.apply = function( filter, canvasobject, value ) {
        var value = value || null,
            imgdata = canvasobject.img.data,
            position;
        for ( i = 0; i < this.w; i++ ) {
            for ( j = 0; j < this.h; j++ ) {
                position = ( j * this.w + i ) * 4;
                this._callafunction( filter, imgdata, position, value );
            }
        }
    } // apply()

    // helperfunction, i do need this for perlin noise
    this.randomFromTo = function( from, to ) {
        return ( Math.random() * ( to - from ) ) + from;
    } // randomFromTo()

    this.diamondSquareNoise = function( chunkSize ) {
        var color = color || false,
            max=0,
            min=0,
            aktX,aktY,
            b = this.noiseMapSize, // die jeweils aktuelleBreite der Unterquadrate
            bh = b/2, // halbe Breite (oft benutzte Zahl)
            displacementDistance,
            averageColor, range;

        // creating the array
        for ( step = 0; step <= this.noiseMapSize; step++) {
            this.noiseMap[step] = [];
        }
        // setting the corners to the same color
        this.noiseMap[0][0] = 0;
        this.noiseMap[b][0] = 0;
        this.noiseMap[0][b] = 0;
        this.noiseMap[b][b] = 0;

        // repeating the displacement steps down to pixel level
        while (b >= 2) {

            // diamondStep:
            // take a square (first is the whole area),
            // calculate average of corners,
            // add random number (displacement distance)
            // and assign new value to center of the square
            for ( aktX = 0; aktX < this.noiseMapSize; aktX=aktX+b ){
                for ( aktY = 0; aktY < this.noiseMapSize; aktY=aktY+b ){
                    // set range for displacement distance
                    if ( b < this.chunkSize) {
                        range = b * 1.414;
                    } else {
                        range = 0;
                    }
                    displacementDistance = this.randomFromTo( -range , range );

                    // calculate average of the corners
                    averageColor = ( this.noiseMap[aktX][aktY]
                                   + this.noiseMap[aktX+b][aktY]
                                   + this.noiseMap[aktX][aktY+b]
                                   + this.noiseMap[aktX+b][aktY+b]
                                   ) / 4;
                    // assign new value to center of the square
                    this.noiseMap[aktX+bh][aktY+bh] = averageColor + displacementDistance;

                    // need min & max for stretching to color space
                    if (this.noiseMap[aktX+bh][aktY+bh]>max) max=this.noiseMap[aktX+bh][aktY+bh];
                    if (this.noiseMap[aktX+bh][aktY+bh]<min) min=this.noiseMap[aktX+bh][aktY+bh];
                }
            }

            // squareStep:
            // take a diamond
            // alle rauten nehmen, mitte auslenken (quadrate erzeugen)
            for ( aktX=0; aktX < ( (this.noiseMapSize-1) ); aktX=aktX+b ){
                for ( aktY=0; aktY< ( (this.noiseMapSize-1) ); aktY=aktY+b ){
                    if ( b < this.chunkSize ) {
                        range = b;
                    } else {
                        range = 0;
                    }

                    if ( aktY == 0 ){
                        feldOben = this.noiseMap[aktX+bh][this.noiseMapSize-bh];
                    } else {
                        feldOben = this.noiseMap[aktX+bh][aktY-bh];
                    }

                    // calculate average of the corners
                    averageColor = ( this.noiseMap[aktX][aktY]
                                   + this.noiseMap[aktX+b][aktY]
                                   + feldOben
                                   + this.noiseMap[aktX+bh][aktY+bh]
                                   ) / 4;
                    displacementDistance = this.randomFromTo( -range , range );
                    // assign new value to center of the square
                    this.noiseMap[aktX+bh][aktY] = averageColor + displacementDistance;

                    if (this.noiseMap[aktX+bh][aktY]>max) max=this.noiseMap[aktX+bh][aktY];
                    if (this.noiseMap[aktX+bh][aktY]<min) min=this.noiseMap[aktX+bh][aktY];

                    if (aktX == 0){
                        feldLinks = this.noiseMap[this.noiseMapSize-bh][aktY+bh];
                    } else {
                        feldLinks = this.noiseMap[aktX-bh][aktY+bh];
                    }
                    // calculate average of the corners
                    averageColor = ( this.noiseMap[aktX][aktY]
                                   + this.noiseMap[aktX+b][aktY]
                                   + this.noiseMap[aktX+bh][aktY+bh]
                                   + feldLinks
                                   ) / 4;
                    displacementDistance = this.randomFromTo( -range, range );
                    // assign new value to center of the square
                    this.noiseMap[aktX][aktY+bh]=averageColor + displacementDistance;

                    // need min & max for stretching to color space
                    if (this.noiseMap[aktX][aktY+bh]>max) max=this.noiseMap[aktX][aktY+bh];
                    if (this.noiseMap[aktX][aktY+bh]<min) min=this.noiseMap[aktX][aktY+bh];
                }
            }

            // borders
            for ( i=0; i<=this.noiseMapSize; i++){
                this.noiseMap[this.noiseMapSize][i]=this.noiseMap[0][i];
                this.noiseMap[i][this.noiseMapSize]=this.noiseMap[i][0];
            }
            b = b/2;
            bh = b/2;
        } // while

        // stretching to color space
        var position,
            stretchFromZeroTo = 1, // or 255
            by = stretchFromZeroTo / (max - min); // how much to stretch
        for ( i = 0; i <= this.noiseMapSize; i++ ) {
            for ( j = 0; j <= this.noiseMapSize; j++ ) {
                position = ( j * this.w + i ) * 4;
                this.noiseMap[i][j] = ( this.noiseMap[i][j]-min )*by;
            }
        }

    } // diamondSquareNoise()

    this.stretchNoiseToCanvas = function( whichColorChannelFunction ) {
        whichColorChannelFunction = whichColorChannelFunction || 'setGray';
        var imgdata = this.canvas.img.data,
            position,
            withFactor = this.noiseMapSize/this.w,
            heightFactor = this.noiseMapSize/this.h;

        for ( i = 0; i <= this.w; i++ ) {
            for ( j = 0; j <= this.h; j++ ) {
                position = ( j * this.w + i ) * 4;
                this._callafunction(
                    whichColorChannelFunction, // setRed setGreen setBlue setGray
                    imgdata, // it was faster than this.canvas.img.data
                    position,
                    // nearest neighbour, that's why it's created bigger
                    this.noiseMap[ Math.round(i*withFactor) ][ Math.round(j*heightFactor) ] *226 + (Math.random() *30)
                );
            }
        }

    } // stretchNoiseToCanvas()

    // if i have a initial Value between 0...255, then 255 is the range
    // and i wanna map this onto a smaller Range, say from 100 to 150
    // so 0 gets 100, 255 gets 150 and 128 gets 125 -> use this function :)
    // range can't be 0
    this.shrinkRange = function( initialValue, from, to, range ) {
        return from + ( (initialValue * ( to-from )) / range );
    }

    /*
    body_hintergrund
    c5b68b 	rgb(197, 182, 139)
    e4d9b9  rgb(228, 217, 185)
    */
    this.NoiseBodyBackground = function( howManyAnnualRings ) {
        var imgdata = this.canvas.img.data,
            position, wood,
            withFactor = this.noiseMapSize/this.w,
            heightFactor = this.noiseMapSize/this.h;

        for ( i = 0; i <= this.w; i++ ) {
            for ( j = 0; j <= this.h; j++ ) {
                position = ( j * this.w + i ) * 4;
                wood = (
                Math.sin(
                    this.noiseMap[ Math.round(i*withFactor) ][ Math.round(j*heightFactor) ]
                    * 3.1416
                    * howManyAnnualRings
                ) +1 ) *127;
                /*
                woodRed   = this.shrinkRange( wood, 197, 228, 256 );
                woodGreen = this.shrinkRange( wood, 182, 217, 256 );
                woodBlue  = this.shrinkRange( wood, 139, 185, 256 );*/
                woodRed   = this.shrinkRange( wood, 197, 217, 256 );
                woodGreen = this.shrinkRange( wood, 178, 210, 256 );
                woodBlue  = this.shrinkRange( wood, 139, 179, 256 );
                this._callafunction( 'setRed', imgdata, position, woodRed );
                this._callafunction( 'setGreen', imgdata, position, woodGreen );
                this._callafunction( 'setBlue', imgdata, position, woodBlue );
            }
        }

    } // NoiseToWood()

    /*
    header_hintergrund
    1c1609  rgb(28, 22, 9)
    654916  rgb(101, 73, 22)
    */
    this.NoiseToWood = function( howManyAnnualRings ) {
        var imgdata = this.canvas.img.data,
            position, wood,
            withFactor = this.noiseMapSize/this.w,
            heightFactor = this.noiseMapSize/this.h;

        for ( i = 0; i <= this.w; i++ ) {
            for ( j = 0; j <= this.h; j++ ) {
                position = ( j * this.w + i ) * 4;
                wood = (
                Math.sin(
                    this.noiseMap[ Math.round(i*withFactor) ][ Math.round(j*heightFactor) ]
                    * 3.1416
                    * howManyAnnualRings
                ) +1 ) *127;
                woodRed   = this.shrinkRange( wood, 54, 85, 256 );
                woodGreen = this.shrinkRange( wood, 42, 58, 256 );
                woodBlue  = this.shrinkRange( wood, 14, 21, 256 );
                this._callafunction( 'setRed', imgdata, position, woodRed );
                this._callafunction( 'setGreen', imgdata, position, woodGreen );
                this._callafunction( 'setBlue', imgdata, position, woodBlue );
            }
        }

    } // NoiseToWood()

    this._init();

} // backgroundImage()
