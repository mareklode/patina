export const emptyExample = { "patina": { "type": "select_Type" } };

export const oneReusableImage = {
    "reusableImages": {
        "test_id": {
            "type": "createPattern",
            "patternConfig": {
                "name": "noise_plasma"
            }
        }
    },
    "patina": {
        "type": "reuseImage",
        "reuseId": "test_id"
    }
};

export const footerExample = {
    "width": 250,
    "patina": {
        "type": "layers",
        "layerTop": {
            "type": "layers",
            "layerTop": {
                "type": "layers",
                "layerTop": {
                    "type": "createPattern",
                    "patternConfig": {
                        "name": "noise_plasma"
                    },
                    "nodeName": "4-createPattern-513"
                },
                "layerBottom": {
                    "type": "createPattern",
                    "patternConfig": {
                        "name": "wave",
                        "direction": "horizontal",
                        "frequency": 60
                    },
                    "nodeName": "4-createPattern-133"
                },
                "nodeName": "3-layers-317"
            },
            "layerBottom": {
                "type": "createPattern",
                "patternName": "slope",
                "filter": [
                    {
                        "name": "brightness",
                        "brightness": -2
                    }
                ],
                "nodeName": "3-createPattern-325"
            },
            "nodeName": "2-layers-551"
        },
        "layerBottom": {
            "type": "layers",
            "layerTop": {
                "type": "createPattern",
                "patternName": "noise_white",
                "nodeName": "3-createPattern-408"
            },
            "layerBottom": {
                "type": "createPattern",
                "patternConfig": {
                    "name": "wave",
                    "direction": "vertical",
                    "frequency": 67
                },
                "nodeName": "3-createPattern-837"
            },
            "nodeName": "2-layers-201"
        },
        "filter": [
            {
                "name": "invert"
            },
            {
                "name": "blur",
                "radius": 1
            },
            {
                "name": "contrast",
                "m": 3,
                "x": 0.625
            }
        ],
        "nodeName": "root"
    },
    "reusableImages": []
};

export const reusableImagesExample = {
    "__width": 512,
    "__height": 256,
    "reusableImages": {
        "firstBorder": {
            "type": "createPattern",
            "patternName": "border",
            "filter": [
                { "name": "brightness", "brightness": -1.5 }
            ]
        },
        "secondBorder": {
            "type": "createPattern",
            "patternName": "border",
            "filter": [{ "name": "contrast", "x": 0.33, "m": 2 }]
        },
        "plasmaNoise": {
            "type": "createPattern",
            "patternConfig": {
                "name": "noise_plasma",
                "frequency": 2
            }
        },
        "subtractedBorder": {
            "type": "layers",
            "combineMode": { "name": "subtract" },
            "layerTop": {
                "type": "reuseImage",
                "reuseId": "firstBorder"
            },
            "layerBottom": {
                "type": "reuseImage",
                "reuseId": "secondBorder"
            },
            "filter": [
                { "name": "brightness", "brightness": 0.5 },
                { "name": "contrast", "x": 0.15, "m": 3 }
            ]
        },
        "multipliedNoise": {
            "type": "layers",
            "combineMode": { "name": "subtract" },
            "layerTop": {
                "type": "reuseImage",
                "reuseId": "subtractedBorder"
            },
            "layerBottom": {
                "type": "reuseImage",
                "reuseId": "plasmaNoise",
                "filter": [{ "name": "contrast", "m": 1.5, "x": 0.4 }]
            },
            "filter": [{ "name": "push" }]
        }
    },
    "patina": {
        "type": "colors",
        "colorRed": 210,
        "colorGreen": 110,
        "colorBlue": 70,
        "colorAlpha": {
            "type": "layers",
            "combineMode": { "name": "subtract" },
            "layerTop": {
                "type": "reuseImage",
                "reuseId": "multipliedNoise",
                "filter": [{ "name": "contrast", "m": 2, "x": 0.33 }]
            },
            "layerBottom": {
                "type": "createPattern",
                "patternName": "noise_white",
                "filter": [{ "name": "brightness", "brightness": 2 }]
            }
        }
    }
};

export const colorsExample = {
    "width": 250,
    "patina": {
        "type": "layers",
        "layerBottom": {
            "type": "createPattern",
            "patternConfig": {
                "name": "rays",
                "frequency": "11"
            }
        },
        "layerTop": {
            "type": "colors",
            "colorRed": {
                "type": "createPattern",
                "patternConfig": {
                    "name": "rays",
                    "frequency": "62"
                }
            },
            "colorGreen": {
                "type": "createPattern",
                "patternConfig": {
                    "name": "noise_plasma",
                    "frequency": 10,
                    "direction": "horizontal"
                }
            },
            "colorBlue": {
                "type": "createPattern",
                "patternConfig": {
                    "name": "flat",
                    "frequency": "110"
                }
            },
            "colorAlpha": {
                "type": "createPattern",
                "patternConfig": {
                    "name": "rays",
                    "frequency": "31"
                }
            },
        },
        "combineMode": {
            "name": "multiply"
        }
    },
    "reusableImages": []
}