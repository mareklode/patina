<?php 
    $h1 = 'createPattern';
    include '_header.php' 
?>

        <p class="copy">Every Patina begins with one or more simple Patterns that can be combined into complex surfaces.</p>

        <div class="pattern">

            <a href="createPattern/border"
                class="js-module pattern__thumbnails pattern__thumbnails--clickable" 
                data-module-name="patina" 
                data-module-data='{
                    "patina": {
                        "type"          : "createPattern",
                        "patternName"   : "border"
                    }
                }'
            >createPattern : border</a>

            <a href="createPattern/noise_plasma"
                class="js-module pattern__thumbnails pattern__thumbnails--clickable" 
                data-module-name="patina" 
                data-module-data='{
                    "width": 256,
                    "height": 256,
                    "patina": {
                        "type"          : "createPattern",
                        "patternName"   : "noise_plasma"
                    }
                }'
            >createPattern : noise_plasma</a>

            <a href="createPattern/flat"
                class="js-module pattern__thumbnails pattern__thumbnails--clickable" 
                data-module-name="patina" 
                data-module-data='{
                    "width": 256,
                    "height": 256,
                    "patina": 128
                }'
            >createPattern : flat</a>

            <a href="createPattern/noise_white"
                class="js-module pattern__thumbnails pattern__thumbnails--clickable" 
                data-module-name="patina" 
                data-module-data='{
                    "patina"    : {
                        "type"          : "createPattern",
                        "patternName"   : "noise_white"   
                    }
                }'
            >createPattern : noise_white</a>

            <a href="createPattern/wave"
                class="js-module pattern__thumbnails pattern__thumbnails--clickable" 
                data-module-name="patina" 
                data-module-data='{
                    "width"     : 256,
                    "height"    : 256,
                    "patina"    : {
                        "type"          : "createPattern",
                        "patternName"   : "wave"
                    }
                }'
            >createPattern : wave</a>

            <a href="createPattern/slope"
                class="js-module pattern__thumbnails pattern__thumbnails--clickable" 
                data-module-name="patina" 
                data-module-data='{
                    "patina"    : {
                        "type"          : "createPattern",
                        "patternName"   : "slope"
                    }
                }'
            >createPattern : slope</a>

            <a href="createPattern/noise_1D"
                class="js-module pattern__thumbnails pattern__thumbnails--clickable" 
                data-module-name="patina" 
                data-module-data='{
                    "patina": {
                        "type"          : "createPattern",
                        "patternName"   : "noise_1D"
                    }
                }'
            >createPattern : noise_1D</a>

        </div><!-- .pattern -->
<?php include "_footer.php" ?>