<?php 
    $h1 = 'Creating the Pixel Painting Instructions';
    include '_header.php' 
?>

        <p class="copy">
            The Pixel Painting Instructions describe a data structure that defines how the patina is being created. 
            It is a binary tree, where the end-nodes are images or patterns that are then combined, two at a time, to create the patina.
        </p>

        

        <p class="copy">
            This is a very basic example and the Pixel Painting Instructions can get very unmanageable. 
            To help you, here are the basic structure and building blocks.
        </p>

        <h3>the basic structure</h3>

        <pre class="code">
{
    "width"     : 256,
    "height"    : 256,
    "patina"    : {

    }
}</pre>

        <h3>building blocks</h3>

        <ul class="copy">
            <li><a href="createPattern">createPattern</a></li>
            <li>combine</li>
            <li>reusableImages</li>
            <li><a href="filter">filter</a></li>
            <li></li>
        </ul>

        <p class="copy">
            Specified by a data structure written in JSON, the browser will render a new background image every time you reload the page.
        </p>

        <pre class="code">"patina" : {
    "type"          : "createPattern",
    "patternName"   : "noise_plasma"    
}</pre>

        <p class="copy">will become:</p>

        <div class="pattern">
            <a href="createPattern/noise_plasma"
                class="js-module pattern__thumbnails pattern__thumbnails--clickable"
                data-module-name="patina" 
                data-module-data='{
                    "patina": {
                        "type"          : "createPattern",
                        "patternName"   : "noise_plasma"
                    }
                }'
            >createPattern noise_plasma</a>
            <a href="createPattern/noise_plasma"
                class="js-module pattern__thumbnails pattern__thumbnails--clickable"
                data-module-name="patina" 
                data-module-data='{
                    "patina": {
                        "type"          : "createPattern",
                        "patternName"   : "noise_plasma"
                    }
                }'
            >createPattern noise_plasma</a>
            <a href="createPattern/noise_plasma"
                class="js-module pattern__thumbnails pattern__thumbnails--clickable" 
                data-module-name="patina" 
                data-module-data='{
                    "patina": {
                        "type"          : "createPattern",
                        "patternName"   : "noise_plasma"
                    }
                }'
            >createPattern noise_plasma</a>
            <a href="createPattern/noise_plasma"
                class="js-module pattern__thumbnails pattern__thumbnails--clickable"
                data-module-name="patina" 
                data-module-data='{
                    "patina": {
                        "type"          : "createPattern",
                        "patternName"   : "noise_plasma"
                    }
                }'
            >createPattern noise_plasma</a>
            <a href="createPattern/noise_plasma"
                class="js-module pattern__thumbnails pattern__thumbnails--clickable"
                data-module-name="patina" 
                data-module-data='{
                    "patina": {
                        "type"          : "createPattern",
                        "patternName"   : "noise_plasma"
                    }
                }'
            >createPattern noise_plasma</a>
        </div>

        <div class="pixelPaintingInstructions">

            <span class="PPI-branch PPI-branch--fourChildren" style="width: 100%;">  
                <div class="PPI-root js-module" 
                    data-module-name="patina" 
                    data-module-data='{
                        "width" :   256,
                        "height":   256,
                        "reusableImages" : [
                            { 
                                "id"            : "greyNoise", 
                                    "type"          : "combine",
                                    "combineMode"   : { "name": "distort", "radius": 800 },
                                    "topLayer"      : {
                                        "type"          : "createPattern",
                                        "patternName"   : "wave",
                                        "direction"     : "concentric",
                                        "frequency"     : 3
                                    },
                                    "bottomLayer"   : {
                                        "type"          : "createPattern",
                                        "patternName"   : "wave",
                                        "direction"     : "vertical", 
                                        "frequency"     : 3
                                    }
                                
                            }
                        ],
                        "patina": {
                            "type"  : "colorChannels",
                            "red"   : {
                                "type"          : "combine",
                                "combineMode"   : { "name": "distort", "radius": 32 },
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
                                "combineMode"   : { "name": "distort", "radius": 32 },
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
                                "combineMode"   : { "name": "distort", "radius": 32 },
                                "topLayer"      : {
                                    "type"          : "createPattern",
                                    "patternName"   : "noise_plasma"
                                },
                                "bottomLayer"   : {
                                    "type"      :   "reuseImage",
                                    "reuseId"   :   "greyNoise"
                                }
                            },
                            "alpha" :  128
                        }
                    }' >
                    patina<br>
                    type: colorChannels<br>
                    width: 256<br>
                    height: 256
                </div>

                <span class="PPI-branch PPI-branch--left">
                    <div class="PPI-node">node: red<br>combine</div>

                    <span class="PPI-branch">
                        <div class="PPI-node">topLayer</div>

                    </span>
                    <span class="PPI-branch">
                        <div class="PPI-node">bottomLayer</div>

                    </span>
                </span>
                <span class="PPI-branch PPI-branch--left">
                    <div class="PPI-node">green</div>

                    <span class="PPI-branch">
                        <div class="PPI-node">node</div>
                    </span>
                    <span class="PPI-branch">
                        <div class="PPI-node">node</div>
                    </span>
                </span>
                <span class="PPI-branch PPI-branch--right">
                    <div class="PPI-node">blue</div>

                    <span class="PPI-branch">
                        <div class="PPI-node">node</div>

                        <span class="PPI-branch">
                            <div class="PPI-node">node</div>

                        </span>
                        <span class="PPI-branch">
                            <div class="PPI-node">node</div>

                        </span>

                    </span>
                    <span class="PPI-branch">
                        <div class="PPI-node">node</div>

                        <span class="PPI-branch">
                            <div class="PPI-node">node</div>

                        </span>
                        <span class="PPI-branch">
                            <div class="PPI-node">node</div>

                        </span>

                    </span>
                </span>
                <span class="PPI-branch PPI-branch--right">
                    <div class="PPI-node">alpha: 128</div>
                </span>
            </span>
        </div>

        <br style="clear: both;">
        

<?php include "_footer.php" ?>