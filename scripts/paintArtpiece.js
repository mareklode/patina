'use strict';

import canvas from './modules/mel_canvas.js';

const randomSeed = 30 || Math.random() * 1000000|0; // 
console.log(randomSeed, Math.random());

function paintArtpiece () {

    if (Math.seedrandom) {
        Math.seedrandom(randomSeed);
    }
        
    let artPiece = { 
        domelement: document.querySelector('#canvas') 
    };

    artPiece.width  = artPiece.domelement.offsetWidth;
    artPiece.height = artPiece.domelement.offsetHeight;
    

    let myCanvas = new canvas( artPiece.width, artPiece.height );

    console.log(artPiece.width, artPiece.height);
    artPiece.domelement.appendChild(myCanvas.el);

    let minimum, maximum;
    function minimumMaximum (value) {
        if (typeof minimum === "undefined" || value < minimum) {
            minimum = value;
        }
        if (typeof maximum === "undefined" || value > maximum) {
            maximum = value;
        }
    }
    
    // verlauf
    for (let x = 0; x < artPiece.width; x++) {
        for (let y = 0; y < artPiece.height; y++) {
            let position = (x + (y * artPiece.width)) *4 ;
            myCanvas.el.img.data[position]     = (y / artPiece.height) * 90; // Math.floor(Math.random() * 32) + 100;
            myCanvas.el.img.data[position + 1] = ((artPiece.width-y) / artPiece.height) * 20; // Math.floor(Math.random() * 32) + 100;
            myCanvas.el.img.data[position + 2] = (x / (artPiece.width + artPiece.height)) * 150; // Math.floor(Math.random() * 32) + 100;
            //minimumMaximum(myCanvas.img.data[position + 2]);
            myCanvas.el.img.data[position + 3] = 255;
        }
    }

    //console.log(minimum, maximum);
    
    // random gekrissel
    for (let i = 0, len = artPiece.width * artPiece.height; i < len; i++) {
        myCanvas.el.img.data[i * 4]     *= Math.random() / 2 + .75;
        myCanvas.el.img.data[i * 4 + 1] *= Math.random() / 2 + .75;
        myCanvas.el.img.data[i * 4 + 2] *= Math.random() + 1;
        myCanvas.el.img.data[i * 4 + 3] = 256;
    }
    
    // Labyrinth
    let punkteAbstand = 4;
    for (let x = 0; x < artPiece.width / punkteAbstand; x++) {
        for (let y = 0; y < artPiece.height / punkteAbstand; y++) {
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
                let farbe = myCanvas.getImgData(xPos, yPos);
                myCanvas.setImgData( 
                    xPos, 
                    yPos, 
                    farbe[0] + 16,
                    farbe[1] + 16,
                    farbe[2] + 16,
                    256
                );    
            }
        }
    }
     
    if (Math.seedrandom) {
        Math.seedrandom(randomSeed);
    }

    let walkerPos = {
        x: Math.floor(artPiece.width/2),
        y: Math.floor(artPiece.height/2)
    };

    let walkerColor = 0;
    function walker (colour) {
        const impact = 0.5;

        walkerPos.x = (walkerPos.x + Math.round(Math.random()*2 - 1 ) +artPiece.width) % artPiece.width;
        walkerPos.y = (walkerPos.y + Math.round(Math.random()*2 - 1 ) +artPiece.height) % artPiece.height;
        let farbe = myCanvas.getImgData(walkerPos.x, walkerPos.y);
        //console.log(farbe);
        if (farbe[0] > 2 || true) { farbe[0] *= 1 + (impact * .1  ); } else { farbe[0] = 0; }
        if (farbe[1] > 2 || true) { farbe[1] *= 1 + (impact * .125);  } else { farbe[1] = 0; }
        if (farbe[2] > 2 || true) { farbe[2] *= 1 + (impact * colour); } else { farbe[2] = 0; }
        myCanvas.setImgData(walkerPos.x, walkerPos.y, ...farbe);

    }
    
    function animateWalker (handler) {
        walker();
        myCanvas.context.putImageData( myCanvas.img, 0, 0 );
        window.requestAnimationFrame(animateWalker);
    }
        
    
    if (true) {
        //console.log(artPiece.height * artPiece.width);
        for (let i = 0; i < 3.75 * artPiece.height * artPiece.width; i++) {
            walkerColor += 0.0000000125;
            walker(walkerColor);
        }
    } else {
        animateWalker();
    }

    let timeStop = Date.now();

    console.log('vergangene Zeit = ', timeStop-timeStart); 
    /*
    1555 ms für mit seedrandom 
     680 ms mit builtin random
    */
    console.log(myCanvas.el);
    myCanvas.el.context.putImageData( myCanvas.el.img, 0, 0 );
}

let timeStart = Date.now();
paintArtpiece();

