require.config({
    baseUrl: 'scripts',
    paths: {
        patina:         'mel/mel_patina',
        canvas:         'mel/mel_canvas',
        createPattern:  'mel/mel_createPattern',
        noise:          'mel/mel_noise',
        filter:         'mel/mel_filter',
    }
});

let mel = {};

let setupPage = function () {

    console.info('ToDo: preloadImages AND reusablePatterns');

    /* find and execute JavaScript-triggers in HTML-tags */
    let nodeList = document.querySelectorAll(".js-require");
    console.log('JavaScript-triggers in HTML-tags:', nodeList.length, nodeList);
    for (let nl = 0; nl < nodeList.length; nl++) {
        let el = nodeList[nl],
            requireName = el.getAttribute('data-require-name'),
            requireData = el.getAttribute('data-require-data');

        (function (el, requireName,requireData) { // to eliminate the race condition
            require([requireName], function( requireName ) {
                if (typeof requireName === 'function') {
                    new requireName(el, requireData);
                    el.classList.remove('js-require');
                    el.classList.add('js-require-processed');
                } else {
                    console.log(requireName, ' does not exist?');
                }
            });
        })(el, requireName, requireData);
    }

    mel.kkeys = [];
    mel.konami = "38,38,40,40,37,39,37,39,66,65";
    mel.easteregg = function () {
        mel.onlyLog('Konami');
    }

    document.addEventListener('keydown', function(e) {
    
      mel.kkeys.push( e.keyCode );
    
      if ( mel.kkeys.toString().indexOf( mel.konami ) >= 0 ) {
        mel.kkeys = [];        
        mel.easteregg();
      }
    
    });

};

setupPage();

const patina = function(target, json) {
    require(['main'], function() {
        require(['patina'], function( patina ) {
            new patina(target, json);
        });
    });
};