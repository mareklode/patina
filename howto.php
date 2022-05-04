<?php
    $h1 = 'How to use it';
    include '_header.php' 
?>

        <p class="copy alert">
            This HowTo is outdated since i updated the way the JavaScript modules are getting loaded.
            I threw out require.js and  now use native <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules">JavaScript modules</a>
            that are supported by all the modern browsers.
        </p>

        <p class="copy">
            In its current state this project is too complicated to use and it has a long way to go to before being useful for anybody, including me.
            But if you're curious here is how it works.
        </p>

        <h2>The minimalistic example</h2>

        <p class="copy">
            "Patina" runs inside the browser, so you need a HTML-file. 
            Copy the following code and save it in your root folder as "minimalistic_example.html".
        </p>

        <!--p class="copy code">
        <script src="https://gist.github.com/mareklode/f11ff05387858d9da8906feff79dfc38.js"></script>
        </p-->

        <pre class="code">
&lt;!DOCTYPE html>
&lt;html lang="en">
    &lt;head>
    &lt;meta charset="utf-8">
    &lt;title>Patina | the minimalistic example&lt;/title>
    &lt;/head>

    &lt;body>
        &lt;div id="js-patina-goes-here" style="width: 64px; height: 64px;" >&lt;/div>
    &lt;/body>

    &lt;script>
    const target = document.getElementById('js-patina-goes-here');
    const pixelPaintingInstructions =
        `{ "patina" : {
            "type"          : "createPattern",
            "patternName"   : "noise_1D"
        }}`;
    import('./scripts/modules/mel_patina.js')
        .then((patina) => {
            new patina.default(target, pixelPaintingInstructions);
        });
    &lt;/script>
&lt;/html></pre>

        <p class="copy">Have a look at the <a href="minimalistic_example">minimalistic example</a> in action.</p>

        <h2>The JavaScript</h2>

        <p class="copy">
            For the patina to work you need two JavaScript files. First download patina.js and save it in a folder called "scripts".
            <br>
            <a href="scripts/patina.js" class="button" style="display: inline-block; margin-top: 0.5em" data-info="patina/build_patina_js.html">download patina.js</a>
        </p>

        <p class="copy">
        </p>

        <p class="copy">
            <!-- get rid of this with https://github.com/requirejs/almond -->
            Within the "scripts"-folder create a subfolder named "vendor".
            Download the latest requireJs and save it under "scripts/vendor".
            <br>
            <a href="https://requirejs.org/docs/download.html" class="button" style="display: inline-block; margin-top: 0.5em;">latest require.js</a>
        </p>

        <p class="copy">
            Your file structure should look something like this now.
        </p>

        <pre class="code">
WWW
├── scripts
│   ├── vendor
│   │   └── require.js
│   └── patina.js
└── patina_test.html</pre>

        <h2>Explanation</h2>

        <p class="copy">
            Open patina_test.html in a text editor and include
            the following line at the bottom of your html-file. 
            (data-main="scripts/patina" is the path to patina.js without the file extension)
        </p>
        <pre class="code">
&lt;script data-main="scripts/patina" src="scripts/vendor/require.js">&lt;/script></pre>
            
        <p class="copy">
            You also need a &lt;div> or any other HTML-element that you want to decorate with patina.
        </p>

        <pre class="code">
&lt;div id="js-patina-goes-here" style="width: 64px; height: 64px;" >&lt;/div></pre>

        <p class="copy">
            Now you can call the patina-function and apply a randomly generated background image to your &lt;div> like this:
        </p>

        <pre class="code">
&lt;script>
    require(['patina'], function( patina ) {
        const target = document.getElementById('js-patina-goes-here');
        const pixelPaintingInstructions =
	    `{"patina" : {
                "type"          : "createPattern",
                "patternName"   : "noise_1D"
            } }`;
        new patina(target, pixelPaintingInstructions);
    });
&lt;/script></pre>

        <h2>Pixel Painting Instructions</h2>

        <p class="copy">
            The "pixelPaintingInstructions" in the example above is the data structure, that defines how the patina is being created. 
            This is a very basic example and the Pixel Painting Instructions can get very unmanageable.
        </p>

        <a class="button button__nextPage" href="pixelPaintingInstructions" style="padding: 4vw;">
            Next: How to create the Pixel Painting Instructions.
        </a>
        <a href="2do">.</a>
        <a href="LICENSE">.</a>
        <a href="README.md">.</a>

<?php include "_footer.php" ?>