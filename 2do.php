<?php
    $h1 = 'ToDo';
    $headerSimple = true;
    include '_header.php' 
?>

        <!--p class="copy nurZumTesten bringtDenBuildprozessDurcheinander">
            <a href=".">home</a><br />
            <a href="filter.php">filter.php</a><br />
            <a href="filter">filter</a><br />
            <a href="filter/">filter/</a><br />
            <a href="filter/blur">filter/blur</a><br />
            <a href="filter/blur/">filter/blur/</a><br />

            <p class="copy"><a href="http://localhost/patinastatic/">this static-site</a></p>
        </p-->

        <pre class="code">
    das ist ein Zwischenschritt, bis ich dem buildprozess vertraue
cd ~/WWW/localhost/patinastatic/ 
    leeren
rm -r localhost
    dynamische Seite von localhost/patina/ nach localhost/patinastatic holen
wget --recursive --convert-links --page-requisites --html-extension localhost/patina/
    die Scripte und Bilder kommen nur teilweise mit, die müssen extra kopiert werden.
cp -r ../patina/scripts/ ./localhost/patina/
cp -r ../patina/images/ ./localhost/patina/
cp -r ../patina/css/ ./localhost/patina/
cp -r ../patina/LICENSE ./localhost/patina/

<!--	jetzt alles zusammen rüber zur website
cp -r ./localhost/patina ../mareklode/ .-->
        </pre>
        
        <ul class="copy">
            <li>reusable images are not always fully loaded, resulting in error message and faulty patina
            <li>rewrite the howto for JavaScript modules</li>
            <li>build_patina_js.html is still using require </li>
            <li>animations</li>
            <li>http://html2canvas.hertzen.com/ && https://github.com/eligrey/FileSaver.js</li>
            <li>compare noise algorithm names: https://www.gamasutra.com/view/feature/131507/a_realtime_procedural_universe_.php</li>
        </ul>

<?php include "_footer.php" ?>