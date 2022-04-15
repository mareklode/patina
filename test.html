<!doctype html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width">
  
      <title>test | Patina | mareklode</title>

  <meta property="og:title" content="test | Patina | mareklode" />
  <meta property="og:image" content="http://mareklode.de/bilder/page/v3/v3_rost4.png" />
  <meta property="og:description" content="Patina: procedually generated background images in JavaScript. test" />
  <meta name="description" content="Patina: procedually generated background images in JavaScript. test">

  <link rel="stylesheet" type="text/css" href="css/normalize.min.css">
  <link rel="stylesheet" href="css/main.css">

  
  <style>
      .pattern__thumbnails { float: left; margin: 0; line-height: 64px; color: purple; text-align: center; }
  </style>

</head>
<body class="content">

    <header class="header">
        <div class="header__logo">
            Patina
        </div>
    </header>

    <nav class="navigation">
        <a class="navigation__link" href=".">Home</a>
        <a class="navigation__link" href="howto.html">HowTo</a>
        <a class="navigation__link" href="filter.html">filter</a>
        <a class="navigation__link" href="reusableImages.html">reusableImages</a>
        <a class="navigation__link" href="examples.html">examples</a>
        <a class="navigation__link" href="test.html">test</a>
    </nav>

    <main class="content__block">

        <div class="pattern__thumbnails--128" style="background-size: contain; float: left;" id="reusableImage_firstBorder"></div>
        <div class="pattern__thumbnails--128" style="background-size: contain; float: left;" id="reusableImage_secondBorder"></div>
        <div class="pattern__thumbnails--128" style="background-size: contain; float: left;" id="reusableImage_subtractedBorder"></div>
        <div class="pattern__thumbnails--128" style="background-size: contain; float: left;" id="reusableImage_plasmaNoise"></div>

        <div class="pattern">

            <div class="js-module pattern__thumbnails pattern__thumbnails--512" 
                style="background-color: #7d9cb1; height: 256px;"
                data-require-name="patina" 
                data-require-data='{
                    "__width"          : 512,
                    "__height"         : 256,
                    "reusableImages" : [
                        {
                            "id"            : "firstBorder",
                            "type"          : "createPattern",
                            "patternName"   : "border",
                            "filter"        : [
                                { "name": "brightness", "brightness": -1.5 }
                            ]
                        },
                        { 
                            "id"            : "secondBorder",
                            "type"          : "createPattern",
                            "patternName"   : "border",
                            "filter"        : [{ "name": "contrast", "x": 0.33, "m": 2 }]
                        },
                        { 
                            "id"            : "plasmaNoise",
                            "type"          : "createPattern",
                            "pattern"       : {
                                "name"          : "noise_plasma",
                                "frequency"     : 2
                            }
                        },
                        { 
                            "id"            : "subtractedBorder", 
                            "type"          : "combine",
                            "combineMode"   : { "name": "subtract" },
                            "topLayer"      : {
                                "type"          : "reuseImage",
                                "reuseId"       : "firstBorder"
                            },
                            "bottomLayer"   : {
                                "type"          : "reuseImage",
                                "reuseId"       : "secondBorder"
                            },
                            "filter"        : [
                                { "name": "brightness", "brightness": 0.5 },
                                { "name": "contrast", "x": 0.15, "m": 3 }
                            ]
                        },
                        { 
                            "id"            : "multipliedNoise", 
                            "type"          : "combine",
                            "combineMode"   : { "name": "subtract" },
                            "topLayer"      : {
                                "type"          : "reuseImage",
                                "reuseId"       : "subtractedBorder"
                            },
                            "bottomLayer"   : {
                                "type"          : "reuseImage",
                                "reuseId"       : "plasmaNoise",
                                "filter"        : [{ "name": "contrast", "m": 1.5, "x": 0.4 }]
                            },
                            "filter"        : [{ "name": "push" }]
                        }
                    ],
                    "patina": {
                        "type"  : "colorChannels",
                        "red"   : 210,
                        "green" : 110,
                        "blue"  : 70,
                        "alpha" : {
                            "type"  : "combine",
                            "combineMode" : { "name": "subtract" },
                            "topLayer"      : {
                                "type"          : "reuseImage",
                                "reuseId"       : "multipliedNoise",
                                "filter"        : [{ "name": "contrast", "m": 2, "x": 0.33 }]
                            },
                            "bottomLayer"   : {
                                "type"          : "createPattern",
                                "patternName"   : "noise_white",
                                "filter"        : [{ "name": "brightness", "brightness": 2 }]
                            }
                        }
                    }
                }'
            ></div>

        </div>
    </main>

    <script type="module" src="scripts/main.js"></script>

</body>
</html>
