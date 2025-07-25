'use strict';

const templates = {

    header_logo_image:  `{
        "reusableImages"    : {
            "marekkeram_256": {
                "type"          : "preloadImage",
                "url"           : "/mareklode/patina/images/page/header__logo--PatinaFont-rough_white.png",
                "colors" : 1
            }
        },
        "patina": {
            "type"  : "colors",
            "colorRed"   : 128,
            "colorGreen" : 64,
            "colorBlue"  : 32,
            "colorAlpha" : { 
                "type"          : "layers",
                "layerTop"      : {
                    "type"          : "reuseImage",
                    "reuseId"       : "marekkeram_256",
                    "filter"        : [
                        { "name": "blur", "radius": 4.5 },
                        { "name": "contrast", "x": 0.1125, "m": 1.125 }
                    ]
                },
                "layerBottom"   : {
                    "type"          : "layers",
                    "layerTop"      : {
                        "type"          : "createPattern",
                        "patternConfig" : { 
                            "name"   : "noise_plasma",
                            "frequency"     : 10
                        },
                        "filter": [
                            { "name": "contrast", "x": 0.456, "m": 3 }
                        ]
                    },
                    "layerBottom"   : { 
                        "type"          : "createPattern",
                        "patternName"   : "border",
                        "filter": [
                            {"name": "invert"},
                            { "name": "contrast", "x": 0.85, "m": 6 }
                        ]
                    }
                },
                "filter"        : [
                    { "name": "contrast", "x": 0.875, "m": 3 }
                ]
            }
        }
    }`,
    /*
    header_logo_before: `{
        "patina": {
            "type"  : "colors",
            "colorRed"   : 255,
            "colorGreen" : 0,
            "colorBlue"  : 0,
            "colorAlpha" : {
                "type"          : "createPattern",
                "patternName"   : "border",
                "filter"        : [{ "name": "contrast", "x": 0.33, "m": 2 }]
            }
        }
    }`,
    */
    header_logo_after: `{
        "width" : 750,
        "height": 100,

        "patina": {
            "type": "colors",
            "colorRed": 150,
            "colorGreen": 90,
            "colorBlue": 50,
            "colorAlpha": {
                "type": "layers",
                "layerTop": {
                    "type": "createPattern",
                    "patternConfig": {
                        "name": "noise_plasma",
                        "frequency": 10
                    }
                },
                "layerBottom": {
                    "type": "createPattern",
                    "patternName": "border"
                },
                "combineMode": {
                    "name": "burn"
                }
            }
        }
    }`,
    header:  `{
        "width" : 375,
        "height": 283,
        "patina": {
            "type"  : "colors",
            "colorRed"   : 73,
            "colorGreen" : 94,
            "colorBlue"  : 18,
            "colorAlpha" : {
                "type"          : "createPattern",
                "patternConfig" : { 
                    "name"   : "wave",
                    "direction"     : "rectangles",
                    "frequency"     : 4
                },  
                "filter"        : [
                    { "name": "threshold", "value": 0.5 },
                    { "name": "blur", "value": 0.578 },
                    { "name": "threshold", "value": 0.575 },
                    { "name": "brightness_new", "value": -0.75 }
                ]
            }
        }
    }`,
    navigation: `{
        "patina": {
            "type"          : "layers",
            "layerTop"      : {
                "type"          : "createPattern",
                "patternName"   : "slope",
                "filter"        : [{ "name": "contrast", "x": 0.75, "m": 1 }]
            },
            "layerBottom"   : {
                "type"          : "createPattern",
                "patternName"   : "noise_white",
                "filter"        : [{ "name": "contrast", "x": 2, "m": 0.25 }]
            }
        }
    }`,
    footer: `{
        "width": 256,
        "patina": {
            "type"  : "colors",
            "colorRed"   : 73,
            "colorGreen" : 94,
            "colorBlue"  : 18,
            "colorAlpha" : {
                "type"  :   "layers",
                "layerTop"    : {
                    "type"  :   "layers",
                    "layerTop"    : {
                        "type"  :   "layers",
                        "layerTop"      : {
                            "type"          : "createPattern",
                            "patternName"   : "noise_plasma"
                        },
                        "layerBottom"   : {
                            "type"          : "createPattern",
                            "patternConfig" : { 
                                "name"   : "wave",
                                "direction"     : "horizontal",
                                "frequency"     : 60
                            }    
                        }
                    },
                    "layerBottom" : { 
                        "type"          : "createPattern",
                        "patternName"   : "slope",
                        "filter"        : [{ "name": "brightness", "brightness": -2 }]
                    }
                },
                "layerBottom" : { 
                    "type"  :   "layers",
                    "layerTop"    : {
                        "type"          : "createPattern",
                        "patternName"   : "noise_white"
                    },
                    "layerBottom"   : {
                        "type"          : "createPattern",
                        "patternConfig" : { 
                            "name"   : "wave",
                            "direction"     : "vertical",
                            "frequency"     : 67
                        }
                    }
                },
                "filter"        : [
                    { "name": "invert" },
                    { "name": "blur", "radius": 1 },
                    { "name": "contrast", "m": 3, "x": 0.625 }
                ]
            }
        }
    }`
};

export default templates;