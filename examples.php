<?php
    $h1 = 'examples (wait for it...)';
    include '_header.php' 
?>

        <div class="pattern">

            <div style="width: 512px;"
                class="js-module  pattern__thumbnails" 
                data-module-name="patina" 
                data-module-data='{
                    "width"     : 256,
                    "height"    : 256,
                    "patina"    : {
                        "type"          : "combine",
                        "topLayer"      : {
                            "type"          : "createPattern",
                            "patternName"   : "border"
                        },
                        "bottomLayer"      : {
                            "type"          : "combine",
                            "topLayer"      : {
                                "type"          : "createPattern",
                                "patternName"   : "noise_plasma"
                                },
                            "bottomLayer"      : {
                                "type"          : "createPattern",
                                "patternName"   : "noise_white"
                            }
                        },
                        "filter"        : [{ "name": "contrast" }]
                    }
                }'
            ></div><!-- patina -->
    
            <div style="background: orangered; width: 512px; height: 512px; margin: 1vw;"
                class="js-module" 
                data-module-name="patina" 
                data-module-data='{
                    "width": 512,
                    "reusableImages" : [
                        { 
                            "id"            : "greyNoise", 
                            "type"          : "combine",
                            "topLayer"      : {
                                "type"          : "createPattern",
                                "patternName"   : "noise_plasma"
                            },
                            "bottomLayer"   : {
                                "type"          : "createPattern",
                                "patternName"   : "noise_white"
                            }, 
                            "filter"        : [{ "name": "blur"}]
                        },
                        { 
                            "id"            : "bottomLayer", 
                            "type"          : "reuseImage",
                            "reuseId"       : "greyNoise",
                            "filter"        : [{ "name": "threshold", "threshold": 0.5 }]
                        }
                    ],
                    "patina": {
                        "type"  : "colorChannels",
                        "red"   : {
                            "type"      : "reuseImage",
                            "reuseId"   : "bottomLayer"
                        },
                        "green" : {
                            "type"      : "reuseImage",
                            "reuseId"   : "bottomLayer"
                        },
                        "blue"  : {
                            "type"      : "reuseImage",
                            "reuseId"   : "greyNoise"
                        },
                        "alpha"     : 255
                    }
                }'
            ></div><!-- patina -->
            
            <div class="js-module pattern__thumbnails pattern__thumbnails--512" 
                data-module-name="patina" 
                data-module-data='{
                    "reusableImages" : [
                        { 
                            "id"            : "greyNoise", 
                                "type"          : "combine",
                                "combineMode"   : { "name": "distort", "radius": 1600 },
                                "topLayer"      : {
                                    "type"          : "createPattern",
                                    "patternName"   : "wave",
                                    "direction"     : "concentric",
                                    "frequency"     : 6
                                },
                                "bottomLayer"   : {
                                    "type"          : "createPattern",
                                    "patternName"   : "wave",
                                    "direction"     : "vertical", 
                                    "frequency"     : 6
                                }
                            
                        }
                    ],
                    "patina": {
                        "type"  : "colorChannels",
                        "red"   : {
                            "type"          : "combine",
                            "combineMode"   : { "name": "distort", "radius": 64 },
                            "topLayer"      : {
                                "type"          : "createPattern",
                                "patternName"   : "noise_plasma"
                            },
                            "bottomLayer"   : {
                                "type"      :   "reuseImage",
                                "reuseId"   :   "greyNoise"
                            }
                        },
                        "green" : {
                            "type"          : "combine",
                            "combineMode"   : { "name": "distort", "radius": 64 },
                            "topLayer"      : {
                                "type"          : "createPattern",
                                "patternName"   : "noise_plasma"
                            },
                            "bottomLayer"   : {
                                "type"      :   "reuseImage",
                                "reuseId"   :   "greyNoise"
                            }
                        },
                        "blue"  :  {
                            "type"          : "combine",
                            "combineMode"   : { "name": "distort", "radius": 64 },
                            "topLayer"      : {
                                "type"          : "createPattern",
                                "patternName"   : "noise_plasma"
                            },
                            "bottomLayer"   : {
                                "type"      :   "reuseImage",
                                "reuseId"   :   "greyNoise"
                            }
                        },
                        "alpha" :  256
                    }
                }'
            ></div>

        </div><!-- pattern -->

        <div class="pattern">

            <div class="js-module pattern__thumbnails pattern__thumbnails--512" 
                data-module-name="patina" 
                data-module-data='{
                    "width"          : 128,
                    "height"         : 128,
                    "reusableImages" : [
                        {
                            "id"            : "plasmaNoise",
                            "type"          : "createPattern",
                            "patternName"   : "noise_plasma"
                        },
                        { 
                            "id"            : "greyNoise", 
                            "type"          : "combine",
                            "combineMode"   : { "name": "distort", "radius": 1024 },
                            "topLayer"      : {
                                "type"          : "createPattern",
                                "patternName"   : "noise_plasma",
                                "filter"        : [{ "name": "blur", "radius": 8 }]
                            },
                            "bottomLayer"   : {
                                "type"          : "reuseImage",
                                "reuseId"       : "plasmaNoise"
                            }
                        }
                    ],
                    "patina": {
                        "type"  : "colorChannels",
                        "blue"  : {
                            "type"          : "combine",
                            "combineMode"   : { "name": "distort", "radius": 1024 },
                            "topLayer"      : {
                                "type"          :   "reuseImage",
                                "reuseId"       :   "greyNoise"
                            },
                            "bottomLayer"   : {
                                "type"          : "reuseImage",
                                "reuseId"       : "plasmaNoise"
                            }
                        },
                        "red"   : {
                            "type"          : "reuseImage",
                            "reuseId"       : "greyNoise"
                        },
                        "green" :  {
                            "type"          : "reuseImage",
                            "reuseId"       : "greyNoise"
                        },
                        "alpha" :  256
                    }
                }'
            ></div>
        </div>

        <div class="pattern">
            <div id="js_patina_fromTextarea" 
                class="pattern__thumbnails pattern__thumbnails--256"
                style="padding: 0;">
                <img src="images/marekkeram_256.png" />
            </div
            ><button id="js_patina_CallToAction" class="button button__applyPatinaTextarea">&UpperLeftArrow;<br>Calculate Patina from textarea</button>
        
            <textarea id="js_patina_textarea" rows="50" style="width: 100%;">
{
    "reusableImages"    : [
        { 
            "id"            : "marekkeram_256", 
            "type"          : "preloadImage",
            "url"           : "images/marekkeram_256.png",
            "colorChannels" : 1
        }
    ],
    "patina": {
        "type"          : "combine",
        "topLayer"      : {
            "type"          : "createPattern",
            "pattern"   : {
                "name"      : "noise_plasma",
                "frequency" : 6
            }
        },
        "bottomLayer"   : { 
            "type"          : "combine",
            "topLayer"      : {
                "type"          : "createPattern",
                "patternName"   : "border",
                "filter": [{"name": "contrast"}]
            },
            "bottomLayer"   : { 
                "type"          : "reuseImage",
                "reuseId"       : "marekkeram_256",
                "filter"        : [
                    { "name": "blur", "radius": 4 },
                    { "name": "contrast", "x": 0.45, "m": 3 }
                ]
            }
        },
        "filter"        : [
            { "name": "blur", "radius": 1 },
            { "name": "contrast", "x": 0.4, "m": 5 }
        ]
    }
}
            </textarea>
        
            <script type="module" src="scripts/main.js"></script>
            <script>
                const trigger  = document.getElementById('js_patina_CallToAction');
                const textarea = document.getElementById('js_patina_textarea');
                const target   = document.getElementById('js_patina_fromTextarea');
    
                const calculatePatinaFromTextarea = function () {
                    import('./scripts/modules/mel_patina.js')
                    .then((patina) => {
                        new patina.default(target, textarea.value);
                    });
                };
    
                trigger.addEventListener('click', calculatePatinaFromTextarea);
                calculatePatinaFromTextarea();
            </script>
        </div><!-- .pattern -->


<?php include "_footer.php" ?>