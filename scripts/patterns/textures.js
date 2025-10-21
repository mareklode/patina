const textures = {
    wood: `{
        "width": 250,
        "patina": {
            "type": "layers",
            "combineMode": {
                "name": "distort",
                "radius": 550
            },
            "layerBottom": {
                "type": "createPattern",
                "patternConfig": {
                    "name": "wave",
                    "frequency": "25",
                    "direction": "horizontal"
                }
            },
            "layerTop": {
                "type": "layers",
                "layerBottom": {
                    "type": "createPattern",
                    "patternConfig": {
                        "name": "noise_plasma",
                        "frequency": "5"
                    }
                },
                "layerTop": {
                    "type": "createPattern",
                    "patternConfig": {
                        "name": "noise_1D",
                        "frequency": 10,
                        "direction": "horizontal"
                    }
                },
                "filter": [
                    {
                        "name": "blur",
                        "radius": 6
                    }
                ],
                "combineMode": {
                    "name": "add"
                }
            }
        }
    }`
};