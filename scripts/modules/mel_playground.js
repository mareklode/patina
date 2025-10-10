'use strict';

function playground (domElement, parameters) {
    const trigger = document.getElementById('js_patina_CallToAction');
    const textarea = document.getElementById('js_patina_textarea');
    const target = document.getElementById('js_patina_fromTextarea');

    const calculatePatinaFromTextarea = function () {
        // ich importiere relativ zum base href
        import('./mel_patina.js')
            .then((patina) => {
                new patina.default(target, textarea.value);
            });
    };

    trigger.addEventListener('click', calculatePatinaFromTextarea);
    calculatePatinaFromTextarea();
}

export default playground;