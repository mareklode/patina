'use strict';

const templates = {
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
                "patternName"   : "wave",
                "direction"     : "rectangles",
                "frequency"     : 4,
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
                "patternName"   : "border"
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
                            "patternName"   : "wave",
                            "direction"     : "horizontal",
                            "frequency"     : 60
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
                        "patternName"   : "wave",
                        "direction"     : "vertical",
                        "frequency"     : 67
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