<?php
    $h1 = 'reusableImages';
    include '_header.php' 
?>

        <p class="copy">The only way to use a pixel array at two different points inside the data structure (two different color channels for example) is to use "reusableImages". Better Explanation follows.</p>

        <div class="pattern">

            <h2>noise_plasma</h2>
            <pre style="width: 512px;max-width: 90%;"
                class="js-module pattern__thumbnails" 
                data-module-name="patina" 
                data-module-data='{
                    "width": 256,
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
                                "patternName"   : "slope"
                            }
                        }
                    ],
                    "patina": {
                        "type"  : "colorChannels",
                        "red"   : {
                            "type"      :   "reuseImage",
                            "reuseId"   :   "greyNoise"
                        },
                        "green" : {
                            "type"      :   "reuseImage",
                            "reuseId"   :   "greyNoise"
                        },
                        "blue"  :  {
                            "type"      :   "reuseImage",
                            "reuseId"   :   "greyNoise"
                        },
                        "alpha" :  {
                            "type"      :   "reuseImage",
                            "reuseId"   :   "greyNoise"
                        }
                    }
                }'
            ></pre>      
            
            <h2>combining two images</h2>
            <pre class="js-module pattern__thumbnails" 
                data-module-name="patina" 
                data-module-data='{
                    "reusableImages"    : [
                        { 
                            "id"            : "reetroof", 
                            "type"          : "preloadImage",
                            "url"           : "images/reetroof_300.jpg"
                        },
                        { 
                            "id"            : "zweiBaeume_300", 
                            "type"          : "preloadImage",
                            "url"           : "images/zweiBaeume_300.jpg"
                        }
                    ],
                    "patina": {
                        "type"      : "combine",
                        "topLayer"  : {
                            "type"          : "reuseImage",
                            "reuseId"       : "reetroof"
                        },
                        "bottomLayer"  : {
                            "type"          : "reuseImage",
                            "reuseId"       : "zweiBaeume_300"
                        }
                    }
                }'
            ></pre>

            <p class="copy">
                Load images, distort or combine them, apply <a href="filter">filters</a>.
            </p>
    
            <div class="pattern">
                <div class="js-module pattern__thumbnails" 
                    data-module-name="patina" 
                    data-module-data='{
                        "reusableImages"    : [
                            { 
                                "id"            : "reetroof", 
                                "type"          : "preloadImage",
                                "url"           : "images/reetroof_300.jpg"
                            },
                            { 
                                "id"            : "zweiBaeume_300", 
                                "type"          : "preloadImage",
                                "url"           : "images/zweiBaeume_300.jpg"
                            }
                        ],
                        "patina": {
                            "type"      : "combine",
                            "combineMode"   : { "name": "distort", "radius": 256 },
                            "topLayer"  : {
                                "type"          : "createPattern",
                                "patternName"   : "noise_plasma",
                                "filter"        : [{ "name": "blur", "radius": 5 }]
                            },
                            "bottomLayer"  : {
                                "type"          : "reuseImage",
                                "reuseId"       : "zweiBaeume_300"
                            }
                        }
                    }'
                ></div>
            </div>
        </div>

<?php include "_footer.php" ?>