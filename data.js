const dataModuleData = {
    "width"          : 512,
    "height"         : 256,
    "resolution"     : "hires",
    "reusableImages" : [
        {
            "id"            : "firstBorder",
            "type"          : "createPattern",
            "patternName"   : "border",
            "filter"        : [
                { "name": "brightness", "brightness": -1.5 }
            ]
        },
    ],
    "patina": {

        "type"  : "combine",
        "combineMode" : { 
            "name"      : "add",
            "opacity"   : 0.5
        },
        "topLayer"      : {
            "type"          : "reuseImage",
            "reuseId"       : "firstBorder",
            "filter"        : [{ "name": "contrast", "m": 2, "x": 0.33 }]
        },
        "bottomLayer" : {
            "type"          : "combine",
            "combineMode"   : { "name": "subtract" },
            "topLayer"      : {},
            "bottomLayer"   : {}
        }
    }
};