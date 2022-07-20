<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>paint Artpiece</title>

    <style>
      body { margin: 0; height: 100vh; }
      #canvas { 
        width: 100%; 
        height: 100vh;
        overflow: hidden;
        background-repeat: no-repeat;
      }
    </style>
  </head>

  <body>
    <div id="canvas"></div>
  </body>

  <script src="//cdnjs.cloudflare.com/ajax/libs/seedrandom/3.0.5/seedrandom.min.js"></script>
  <script type="module" src="scripts/paintArtpiece.js"></script>

</html>