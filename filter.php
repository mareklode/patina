<?php 
    $h1 = 'filter';
    include '_header.php' 
?>

        <div class="pattern">

            <a href="filter/blur"
                class="js-module pattern__thumbnails pattern__thumbnails--clickable" 
                data-module-name="patina" 
                data-module-data='{
                    "width": 256,
                    "height": 256,
                    "reusableImages"    : [
                        { 
                            "id"            : "reetroof_300", 
                            "type"          : "preloadImage",
                            "url"           : "images/reetroof_300.jpg"
                        }
                    ],
                    "patina": {
                        "type"          : "reuseImage",
                        "reuseId"       : "reetroof_300",
                        "filter"        : [{ "name": "blur", "radius": 5 }]
                    }
                }'
            >filter : blur</a>

            <a href="filter/brightness"
                class="js-module pattern__thumbnails pattern__thumbnails--clickable" 
                data-module-name="patina" 
                data-module-data='{
                    "width": 256,
                    "height": 256,
                    "reusableImages"    : [
                        { 
                            "id"            : "reetroof_300", 
                            "type"          : "preloadImage",
                            "url"           : "images/reetroof_300.jpg"
                        }
                    ],
                    "patina": {
                        "type"          : "reuseImage",
                        "reuseId"       : "reetroof_300",
                        "filter"        : [{ "name": "brightness", "brightness": 3 }]
                    }
                }'
            >filter : brightness</a>

            <a href="filter/contrast"
                class="js-module pattern__thumbnails pattern__thumbnails--clickable" 
                data-module-name="patina" 
                data-module-data='{
                    "width": 256,
                    "height": 256,
                    "reusableImages"    : [
                        { 
                            "id"            : "reetroof_300", 
                            "type"          : "preloadImage",
                            "url"           : "images/reetroof_300.jpg"
                        }
                    ],
                    "patina": {
                        "type"          : "reuseImage",
                        "reuseId"       : "reetroof_300",
                        "filter"        : [{ "name": "contrast", "m": 4, "x": 0.33 }]
                    }
                }'
            >filter : contrast</a>

            <a href="filter/invert"
                class="js-module pattern__thumbnails pattern__thumbnails--clickable" 
                data-module-name="patina" 
                data-module-data='{
                    "reusableImages"    : [
                        { 
                            "id"            : "reetroof_300", 
                            "type"          : "preloadImage",
                            "url"           : "images/reetroof_300.jpg"
                        }
                    ],
                    "patina": {
                        "type"          : "reuseImage",
                        "reuseId"       : "reetroof_300",
                        "filter"        : [{ "name": "invert" }]
                    }
                }'
            >filter : invert</a>

            <a href="filter/threshold"
                class="js-module pattern__thumbnails pattern__thumbnails--clickable" 
                data-module-name="patina" 
                data-module-data='{
                    "width": 256,
                    "height": 256,
                    "reusableImages"    : [
                        { 
                            "id"            : "reetroof_300", 
                            "type"          : "preloadImage",
                            "url"           : "images/reetroof_300.jpg"
                        }
                    ],
                    "patina": {
                        "type"          : "reuseImage",
                        "reuseId"       : "reetroof_300",
                        "filter"        : [{ "name": "threshold", "threshold": 0.5 }]
                    }
                }'
            >filter : threshold</a>

        </div>
<?php include "_footer.php" ?>