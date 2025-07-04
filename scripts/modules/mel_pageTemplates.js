'use strict';

const templates = {

    header_logo_image:  `{
        "reusableImages"    : [
            { 
                "id"            : "marekkeram_256", 
                "type"          : "preloadImage",
                "url"           : "./images/page/header__logo--PatinaFont-rough_white.png",
                "colorChannels" : 1
            }
        ],
        "patina": {
            "type"  : "colorChannels",
            "red"   : 128,
            "green" : 64,
            "blue"  : 32,
            "alpha" : { 
                "type"          : "combine",
                "topLayer"      : {
                    "type"          : "reuseImage",
                    "reuseId"       : "marekkeram_256",
                    "filter"        : [
                        { "name": "blur", "radius": 4.5 },
                        { "name": "contrast", "x": 0.1125, "m": 1.125 }
                    ]
                },
                "bottomLayer"   : {
                    "type"          : "combine",
                    "topLayer"      : {
                        "type"          : "createPattern",
                        "pattern" : { 
                            "name"   : "noise_plasma",
                            "frequency"     : 10
                        },
                        "filter": [
                            { "name": "contrast", "x": 0.456, "m": 3 }
                        ]
                    },
                    "bottomLayer"   : { 
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
    header_logo_before: `{
        "patina": {
            "type"  : "colorChannels",
            "red"   : 255,
            "green" : 0,
            "blue"  : 0,
            "alpha" : {
                "type"          : "createPattern",
                "patternName"   : "border",
                "filter"        : [{ "name": "contrast", "x": 0.33, "m": 2 }]
            }
        }
    }`,
    header_logo_after: `{
        "patina": {
            "type"  : "colorChannels",
            "red"   : 0,
            "green" : 0,
            "blue"  : 0,
            "alpha" : {
                "type"          : "createPattern",
                "patternName"   : "border",
                "filter"        : [{ "name": "contrast", "x": 0.4, "m": 1.2 }]
            }
        }
    }`,
    header:  `{
        "width" : 375,
        "height": 283,
        "patina": {
            "type"  : "colorChannels",
            "red"   : 73,
            "green" : 94,
            "blue"  : 18,
            "alpha" : {
                "type"          : "createPattern",
                "pattern" : { 
                    "name"   : "wave",
                    "direction"     : "rectangles",
                    "frequency"     : 4
                },  
                "filter"        : [
                    { "name": "threshold", "threshold": 0.5 },
                    { "name": "blur", "radius": 1 },
                    { "name": "threshold", "threshold": 0.66 },
                    { "name": "contrast", "m": 0.5, "x": 1.5 }
                ]
            }
        }
    }`,
    navigation: `{
        "patina": {
            "type"          : "combine",
            "topLayer"      : {
                "type"          : "createPattern",
                "patternName"   : "slope",
                "filter"        : [{ "name": "contrast", "x": 0.75, "m": 1 }]
            },
            "bottomLayer"   : {
                "type"          : "createPattern",
                "patternName"   : "noise_white",
                "filter"        : [{ "name": "contrast", "x": 2, "m": 0.25 }]
            }
        }
    }`,
    footer: `{
        "width": 256,
        "patina": {
            "type"  : "colorChannels",
            "red"   : 73,
            "green" : 94,
            "blue"  : 18,
            "alpha" : {
                "type"  :   "combine",
                "topLayer"    : {
                    "type"  :   "combine",
                    "topLayer"    : {
                        "type"  :   "combine",
                        "topLayer"      : {
                            "type"          : "createPattern",
                            "patternName"   : "noise_plasma"
                        },
                        "bottomLayer"   : {
                            "type"          : "createPattern",
                            "pattern" : { 
                                "name"   : "wave",
                                "direction"     : "horizontal",
                                "frequency"     : 60
                            }    
                        }
                    },
                    "bottomLayer" : { 
                        "type"          : "createPattern",
                        "patternName"   : "slope",
                        "filter"        : [{ "name": "brightness", "brightness": -2 }]
                    }
                },
                "bottomLayer" : { 
                    "type"  :   "combine",
                    "topLayer"    : {
                        "type"          : "createPattern",
                        "patternName"   : "noise_white"
                    },
                    "bottomLayer"   : {
                        "type"          : "createPattern",
                        "pattern" : { 
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