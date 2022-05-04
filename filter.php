<!doctype html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width">
  
      <title>filter  | Patina | mareklode</title>

  <meta property="og:title" content="filter | Patina | mareklode" />
  <meta property="og:image" content="http://mareklode.de/bilder/page/v3/v3_rost4.png" />
  <meta property="og:description" content="Patina: procedually generated background images in JavaScript. filter" />
  <meta name="description" content="Patina: procedually generated background images in JavaScript. filter">

  <link rel="stylesheet" type="text/css" href="css/normalize.min.css">
  <link rel="stylesheet" href="css/main.css">

</head>
<body class="content">

    <header class="header js-module" 
        data-require-name="patina" 
        data-require-data="template_header">
        <a href="." 
            class="header__logo js-module" 
            data-require-name="patina" 
            data-require-data="template_header_logo_image" 
            title="Homepage">
            <img src="images/page/header__logo--PatinaFont-rough_@2x.png" class="header__logo__image" alt="Patina" style="opacity: 1;">
        </a>
    </header>

    <nav class="navigation js-module" 
         data-require-name="patina" 
         data-require-data='template_navigation'>
        <a class="navigation__link" href=".">Home</a>
        <a class="navigation__link" href="howto.html">HowTo</a>
        <a class="navigation__link" href="filter.html">filter</a>
        <a class="navigation__link" href="reusableImages.html">reusableImages</a>
        <a class="navigation__link" href="examples.html">examples</a>
        <a class="navigation__link" href="test.html">test</a>
    </nav>

    <main class="content__block">

        <h1>filter</h1>

        <div class="pattern">

            <a href="filter_blur.html"
                class="js-module pattern__thumbnails pattern__thumbnails--clickable" 
                data-require-name="patina" 
                data-require-data='{
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

            <a href="filter_brightness.html"
                class="js-module pattern__thumbnails pattern__thumbnails--clickable" 
                data-require-name="patina" 
                data-require-data='{
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

            <a href="filter_contrast.html"
                class="js-module pattern__thumbnails pattern__thumbnails--clickable" 
                data-require-name="patina" 
                data-require-data='{
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

            <a href="filter_invert.html"
                class="js-module pattern__thumbnails pattern__thumbnails--clickable" 
                data-require-name="patina" 
                data-require-data='{
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

            <a href="filter_threshold.html"
                class="js-module pattern__thumbnails pattern__thumbnails--clickable" 
                data-require-name="patina" 
                data-require-data='{
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
    </main><!-- .content__block -->

    <footer class="footer js-module"
            data-require-name="patina"
            data-require-data="template_footer">
        &copy; 2022 Marek Lode &nbsp; | &nbsp; 
        <a href="https://github.com/mareklode/patina">
            <img class="footer__githublogo" src="images/page/GitHub-Mark-32px.png" alt="GitHub Logo" />
            This Project on GitHub
        </a>
    </footer>

    <script type="module" src="scripts/main.js"></script>
</body>
</html>