'use strict';

const modulesPath = './modules/mel_';
const cacheBusterVersion = '4';

let mel = {};

mel.setupPage = function () {

    /* find and execute JavaScript-triggers in HTML-tags */
    let nodeList = document.querySelectorAll(".js-module");
    console.log('JavaScript-triggers in HTML-tags:', nodeList.length, nodeList);
    for (let nl = 0; nl < nodeList.length; nl++) {
        const el = nodeList[nl];
        const moduleName = el.getAttribute('data-require-name');
        const moduleData = el.getAttribute('data-require-data');

        (function (el, moduleName, moduleData) { // to eliminate the race condition
            import(modulesPath + moduleName + '.js?v=' + cacheBusterVersion)
                .then((module) => {
                    new module.default(el, moduleData);

                    el.classList.remove('js-module');
                    el.classList.add('js-module-processed');
                })
                .catch(err => console.error(moduleName, ' does not exist? ', el));
        })(el, moduleName, moduleData);
    }

    mel.kkeys = [];
    mel.konami = "arrowup,arrowup,arrowdown,arrowdown,arrowleft,arrowright,arrowleft,arrowright,b,a";
    mel.easteregg = function () {
        console.log('Konami');
    }

    document.addEventListener('keydown', function(e) {
        mel.kkeys.push( e.key.toLowerCase() );
        if ( mel.kkeys.toString().indexOf( mel.konami ) >= 0 ) {
            mel.kkeys = [];        
            mel.easteregg();
        }
    });

};

mel.setupPage();