<?php 
    // localhost or mareklode.de
    $url_host = $_SERVER['HTTP_HOST'];

    // Alles nach dem UrlHost
    $url_request = array_reverse(explode('/', $_SERVER['REQUEST_URI']));

    $breadcrumb = [];
    foreach ($url_request as $arg) {
        if ($arg != '') {
            array_push($breadcrumb, ucfirst($arg));
        }
    }

    $title = '';
    foreach ($breadcrumb as $arg) {
        if ($arg != '') {
            $title .= $arg." | ";
        }
    }
    $title .= 'mareklode';

    $thisPageDescription = $h1;
    if (count($breadcrumb) == 1) {
        $thisPageDescription = '';
    }
?>
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width">
    <base href="http://localhost/patina/"><?php/* das fliegt beim build prozess raus */?>

    <title><?= $title ?></title>

<?php if (!isset($headerSimple)) { ?>
    <meta property="og:title" content="<?= $title ?>">
    <meta property="og:image" content="http://mareklode.de/bilder/page/v3/v3_rost4.png">
    <meta property="og:description" content="Patina: procedually generated background images in JavaScript. <?= $thisPageDescription ?>.">
    <meta name="description" content="Patina: procedually generated background images in JavaScript. <?= $thisPageDescription ?>.">
    <meta name="theme-color" content="#28330a">
<?php } ?>

    <link rel="stylesheet" type="text/css" href="css/normalize.min.css">
    <link rel="stylesheet" href="css/main.css">

</head>

<?php
    $bodyClass = '';
    if (count($breadcrumb) == 1) {
        $bodyClass = ' pagemode_homepage';
    }
?>
<body class="content<?= $bodyClass ?>">

<?php if (isset($headerSimple)) { ?>
    <header class="header">
        <div class="header__logo">
            Patina
        </div>
    </header>

    <nav class="navigation" 
<?php } else { ?>
    <header class="header js-module" 
        data-module-name="patina" 
        data-module-data="template_header">
        <a href="." 
            class="header__logo js-module" 
            data-module-name="patina" 
            data-module-data="template_header_logo_image" 
            title="Homepage">
            <img src="images/page/header__logo--PatinaFont-rough_@2x.png" class="header__logo__image" alt="Patina">
        </a><?php 

        if (count($breadcrumb) == 1) { ?>  
        <p class="header__claim">Procedurally generated images, inside your browser.</p> <?php 
        } ?> 
    </header>
    
    <nav class="navigation js-module" 
<?php } ?>
         data-module-name="patina" 
         data-module-data='template_navigation'>
        <a class="navigation__link" href=".">Home</a>
        <a class="navigation__link" href="howto">HowTo</a>
        <a class="navigation__link" href="createPattern">createPattern</a>
        <a class="navigation__link" href="filter">filter</a>
        <span class="navigation__nowrap">
            <a class="navigation__link" href="reusableImages">reusableImages</a>
            <a class="navigation__link" href="examples">examples</a>
            <a class="navigation__link" href="test">test</a>
        </span>
    </nav>

    <main class="content__block">

        <h1><?= $h1 ?></h1>

