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

/* 
    Find and execute JavaScript-triggers in HTML-tags.
    These triggers consist of a CSS class named "js-module" and a 
    data attribute with the name of the module to execute: 
    data-module-name="patina" (located in ./modules)
*/
mel.jsTriggers = () => {
    let nodeList = document.querySelectorAll(".js-module");
    console.log('JavaScript-triggers in HTML-tags:', nodeList.length, nodeList);

    nodeList.forEach((domElement) => {
        const moduleName = domElement.getAttribute('data-module-name');
        const moduleData = domElement.getAttribute('data-module-data');

        (function (domElement, moduleName, moduleData) { // to eliminate the race condition
            import(modulesPath + moduleName + '.js?v=' + cacheBusterVersion)
                .then((module) => {
                    new module.default(domElement, moduleData);

                    domElement.classList.remove('js-module');
                    domElement.classList.add('js-module-processed');
                })
                .catch(err => console.error(moduleName, ' does not exist? ', domElement));
        })(domElement, moduleName, moduleData);
    })
}

// the function can be triggered from anywhere to allow for dynamic use
mel.jsTriggers();