require.config({
    baseUrl: 'scripts',
    paths: {
        patina:         'mel/mel_patina',
        canvas:         'mel/mel_canvas',
        createPattern:  'mel/mel_createPattern',
        noise:          'mel/mel_noise',
        filter:         'mel/mel_filter',
        templates:      'mel/mel_pageTemplates',
    },
    urlArgs: "bust=v2"
});

let mel = {};

mel.setupPage = function () {

    /* find and execute JavaScript-triggers in HTML-tags */
    let nodeList = document.querySelectorAll(".js-require");
    console.log('JavaScript-triggers in HTML-tags:', nodeList.length, nodeList);
    for (let nl = 0; nl < nodeList.length; nl++) {
        let el = nodeList[nl],
            requireName = el.getAttribute('data-require-name'),
            requireData = el.getAttribute('data-require-data');

        (function (el, requireName, requireData) { // to eliminate the race condition
            require([requireName], function( requireName ) {
                if (typeof requireName === 'function') {
                    new requireName(el, requireData);
                    el.classList.remove('js-require');
                    el.classList.add('js-require-processed');
                } else {
                    console.error(requireName, ' does not exist? ', el);
                }
            });
        })(el, requireName, requireData);
    }

    mel.kkeys = [];
    mel.konami = "38,38,40,40,37,39,37,39,66,65";
    mel.easteregg = function () {
        alert('Konami');
    }

    document.addEventListener('keydown', function(e) {
      mel.kkeys.push( e.keyCode );
      if ( mel.kkeys.toString().indexOf( mel.konami ) >= 0 ) {
        mel.kkeys = [];        
        mel.easteregg();
      }
    });

};

mel.setupPage();