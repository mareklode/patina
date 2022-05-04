<?php 
    $h1 = 'Patina';
    include '_header.php' 
?>

    <p class="copy">
        "Patina is a thin layer that variously forms on the surface of [metals] 
        or any similar acquired change of a surface through age and exposure." <br>
        <small>https://en.wikipedia.org/wiki/Patina</small>   
    </p>

    <p class="copy">
        This "Patina" is a JavaScript tool that lets you create worn out looking surfaces. 
        Combine simple noise <a href="createPattern">patterns</a> to create complex textures with JavaScript.
    </p>

    <div class="pattern">

        <a href="createPattern/border" class="pattern__thumbnails pattern__thumbnails--128 pattern__thumbnails--clickable pattern__thumbnails--nomargin" 
            id="reusableImage_combine_border" style="background-size: contain;">createPattern border</a>

        <span class="pattern__textInbetween">+</span>

        <a href="createPattern/wave" class="pattern__thumbnails pattern__thumbnails--128 pattern__thumbnails--clickable pattern__thumbnails--nomargin" 
            id="reusableImage_combine_wave"
        >createPattern wave</a>

        <span class="pattern__textInbetween">+</span>

        <a href="createPattern/noise_1D" class="pattern__thumbnails pattern__thumbnails--128 pattern__thumbnails--clickable pattern__thumbnails--nomargin" 
            id="reusableImage_combine_noise1D_horizontal"
        >createPattern noise_1D</a>

        <span class="pattern__textInbetween">+</span>

        <a href="createPattern/noise_1D" class="pattern__thumbnails pattern__thumbnails--128 pattern__thumbnails--clickable pattern__thumbnails--nomargin" 
            id="reusableImage_combine_noise1D_vertical"
        >createPattern noise_1D</a>

        <span class="pattern__textInbetween">=</span>

        <div class="js-module pattern__thumbnails pattern__thumbnails--256 pattern__thumbnails--nomargin   " 
            data-module-name="patina" 
            data-module-data='{
                "width": 256,
                "height": 256,
                "reusableImages": [
                    {
                        "id"            : "combine_border",
                        "type"          : "createPattern",
                        "patternName"   : "border",
                        "filter"        : [{ "name": "brightness", "brightness": -1.25 }]
                    },
                    {
                        "id"            : "combine_wave",
                        "type"          : "createPattern",
                        "patternName"   : "wave",
                        "direction"     : "rectangles",
                        "frequency"     : 16,
                        "filter"        : [{ "name": "brightness", "brightness": 1 }]
                    },
                    {
                        "id"            : "combine_noise1D_horizontal",
                        "type"          : "createPattern",
                        "patternName"   : "noise_1D", 
                        "direction"     : "vertical"
                    },
                    {
                        "id"            : "combine_noise1D_vertical",
                        "type"          : "createPattern",
                        "patternName"   : "noise_1D", 
                        "direction"     : "horizontal"
                    },
                    {
                        "id"            : "NoiseBorder",
                        "type"          : "combine",
                        "topLayer"      : {
                            "type"          : "reuseImage",
                            "reuseId"       : "combine_border"
                        },
                        "bottomLayer"   : { 
                            "type"          : "combine",
                            "topLayer"      : {
                                "type"          : "combine",
                                "topLayer"      : {
                                    "type"          : "reuseImage",
                                    "reuseId"       : "combine_noise1D_horizontal"
                                },
                                "bottomLayer"   : { 
                                    "type"          : "reuseImage",
                                    "reuseId"       : "combine_noise1D_vertical"
                                }
                            },
                            "bottomLayer"   : { 
                                "type"          : "combine",
                                "topLayer"      : {
                                    "type"          : "reuseImage",
                                    "reuseId"       : "combine_border"
                                },
                                "bottomLayer"   : { 
                                    "type"          : "reuseImage",
                                    "reuseId"       : "combine_wave"
                                }
                            }
                        }
                    }
                ],
                "patina": {
                    "type"      : "reuseImage",
                    "reuseId"   : "NoiseBorder",
                    "filter"        : [
                        { "name": "contrast", "x": 0.45, "m": 2 },
                        { "name": "brightness", "brightness": 2 }
                    ]
                }
            }'
        ></div>
    </div>

    <p class="copy"> 
        It's neither efficient nor practical, but possible and fun for me. 
        It is very much work in progress and i have to simplify lots of things before it is usable for anybody.
    </p>

    <h2>Don't use it on a webpage</h2>

    <p class="copy">
        This technology is not meant to be used on a websites like i use it on this one here. 
        In my opinion JavaScript should be used to enhance the usability of a page and this is not what Patina does.
        Patina is purely decorative and because of its randomness it does not carry any information.
        On the web, we should not use the users device for calculating decorative pixels.
    </p>

    <h2>Use it to generate art</h2>

    <p class="copy">
        What Patina could be used for.
        Pixel based effects. Games or effects or organic art. I should really add the possibility to save the generated images.
    </p>

<?php include "_footer.php" ?>