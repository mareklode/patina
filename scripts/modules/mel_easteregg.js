'use strict';

function easteregg (domElement, paraeters) {
    mel.kkeys = [];
    mel.konami = "arrowup,arrowup,arrowdown,arrowdown,arrowleft,arrowright,arrowleft,arrowright,b,a";

    mel.easteregg = function () {
        /*
        Here i will do stuff. Later.
        */
        console.log('Konami');
    }

    document.addEventListener('keydown', function (e) {
        mel.kkeys.push(e.key.toLowerCase());
        if (mel.kkeys.toString().indexOf(mel.konami) >= 0) {
            mel.kkeys = [];
            mel.easteregg();
        }
    });
}

export default easteregg;