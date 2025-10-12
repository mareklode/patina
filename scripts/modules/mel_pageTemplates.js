'use strict';

const templates = {

    header_logo_image: `{
        "reusableImages"    : {
            "marekkeram_256": {
                "type"          : "preloadImage",
                "url"           : "/patina/images/page/header__logo--PatinaFont-rough_white.png",
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
    */
    header: `{    
        "patina": {
            "type": "layers",
            "combineMode": {
                "name": "burn",
                "value": 1.5
            },
            "layerBottom": {
                "type": "layers",
                "combineMode": {
                    "name": "burn"
                },
                "layerTop": {
                    "type": "createPattern",
                    "patternConfig": {
                        "name": "random_walker",
                        "impact": 8,
                        "steps": 4
                    }
                },
                "layerBottom": {
                    "type": "layers",
                    "combineMode": {
                        "name": "burn",
                        "opacity": 0.075
                    },
                    "layerTop": {
                        "type": "layers",
                        "layerBottom": {
                            "type": "createPattern",
                            "patternConfig": {
                                "name": "flat",
                                "frequency": "0"
                            }
                        },
                        "layerTop": {
                            "type": "createPattern",
                            "patternConfig": {
                                "name": "labyrinth",
                                "frequency": 10
                            }
                        },
                        "combineMode": {
                            "name": "overlay"
                        }
                    },
                    "layerBottom": {
                        "type": "colors",
                        "colorRed": {
                            "type": "createPattern",
                            "patternConfig": {
                                "name": "slope",
                                "colorBegin": 0,
                                "colorEnd": 164
                            }
                        },
                        "colorGreen": {
                            "type": "createPattern",
                            "patternConfig": {
                                "name": "noise_white"
                            },
                            "filter": [
                                {
                                    "name": "contrast_new",
                                    "value": 0.025
                                },
                                {
                                    "name": "brightness_new",
                                    "value": -0.3
                                }
                            ]
                        },
                        "colorBlue": {
                            "type": "layers",
                            "combineMode": {
                                "name": "burn",
                                "radius": 64
                            },
                            "layerTop": {
                                "type": "createPattern",
                                "patternConfig": {
                                    "name": "noise_white",
                                    "direction": "rectangles",
                                    "frequency": 10
                                }
                            },
                            "layerBottom": {
                                "type": "createPattern",
                                "patternConfig": {
                                    "name": "slope",
                                    "colorBegin": 0,
                                    "colorEnd": 70,
                                    "direction": "horizontal"
                                }
                            }
                        },
                        "colorAlpha": {
                            "type": "createPattern",
                            "patternConfig": {
                                "name": "flat",
                                "color": 255
                            }
                        }
                    }
                }
            },
            "layerTop": {
                "type": "createPattern",
                "patternConfig": {
                    "name": "border",
                    "frequency": 10
                },
                "filter": [
                    {
                        "name": "invert"
                    },
                    {
                        "name": "brightness_new",
                        "value": -0.85
                    }
                ]
            },
            "filter": [
                {
                    "name": "alpha"
                }
            ]
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