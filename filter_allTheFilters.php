<?php
    $filter_name = rtrim($_GET['f'], "/"); // wird von der .htaccess als GET-Parameter übergeben

    $h1 = 'filter : '.$filter_name;
    include '_header.php'; 


    include "patina_contentStaticSite.php";
    print('        <p class="copy">'.$patina_descriptions["filter"][$filter_name].'</p>');
?> 

        <h2>Basic Example</h2>

        <pre class="code">"patina" : {
            "type"          : "filter",
            "patternName"   : "noise_plasma",
            "filter"        : [{ "name": "<?= $filter_name ?>" }]
        }</pre>

        <div class="pattern">
            <div class="js-module pattern__thumbnails pattern__thumbnails--256"
                data-module-name="patina"
                data-module-data='{
                    "patina": {
                        "type"          : "createPattern",
                        "patternName"   : "noise_plasma",
                        "filter"        : [{ "name": "<?= $filter_name ?>" }]
                    }
                }'
            ></div>
        </div><!-- .pattern -->

<?php
    print $patina_contentStaticSite[$filter_name];
?>

<?php include "_footer.php" ?>