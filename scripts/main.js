'use strict';

const modulesPath = './modules/mel_';
const cacheBusterVersion = '7';
window.consoleVerbose = false;

window.mel = {
    startTime: performance.now(),
    printTime: function (string) {
        if (window.consoleVerbose) {
            console.log(performance.now() - window.mel.startTime, string);
        }
    }
};

mel.jsTriggers = () => {
    /* find and execute JavaScript-triggers in HTML-tags */
    let nodeList = document.querySelectorAll(".js-module");
    console.log('JavaScript-triggers in HTML-tags:', nodeList.length, nodeList);
    for (let nl = 0; nl < nodeList.length; nl++) {
        const el = nodeList[nl];
        const moduleName = el.getAttribute('data-module-name');
        const moduleData = el.getAttribute('data-module-data');

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
}

mel.setupPage = function () {

    mel.jsTriggers();

    mel.kkeys = [];
    mel.konami = "arrowup,arrowup,arrowdown,arrowdown,arrowleft,arrowright,arrowleft,arrowright,b,a";
    mel.easteregg = function () {
        console.log('Konami');
    }

    document.addEventListener('keydown', function (e) {
        mel.kkeys.push(e.key.toLowerCase());
        if (mel.kkeys.toString().indexOf(mel.konami) >= 0) {
            mel.kkeys = [];
            mel.easteregg();
        }
    });

};

mel.setupPage();