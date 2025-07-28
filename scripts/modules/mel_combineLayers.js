function combineArrays(layerBottom, layerTop, width, combineMode = {}) {
    let modulo = function (divided, m) {
        // modulo(index - 1, tll)
        return ((divided % m) + m) % m;
    }
    let arrayPos = function (x, y, width) {
        return x + y * width;
    }
    if (combineMode.name === 'distort') {
        let multiplier = combineMode.radius || 32,
            length = layerTop.length,
            tll = length,
            height = length / width,
            x, y, vectorX, vectorY, xNew, yNew;
        return layerBottom.map(function (value, index) {
            let x = index % width,
                y = (index - x) / width,
                leftPosX = (x - 1) % width,
                rightPosX = (x + 1) % width,
                topPosY = (y - 1) % height,
                bottomPosY = (y + 1) % height;
            if (leftPosX < 0) {
                leftPosX = width + leftPosX;
            }
            if (topPosY < 0) { topPosY = height + topPosY; }

            let left = layerTop[arrayPos(leftPosX, y, width)],
                right = layerTop[arrayPos(rightPosX, y, width)],
                top = layerTop[arrayPos(x, topPosY, width)],
                bottom = layerTop[arrayPos(x, bottomPosY, width)],
                vectorX = Math.round((right - left) * multiplier),
                vectorY = Math.round((bottom - top) * multiplier),
                vector = index + vectorX + (vectorY * width);
            if (vectorX < 0) { vectorX = width + vectorX; }
            if (vectorY < 0) { vectorY = height + vectorY; }
            return layerBottom[modulo(vector, layerBottom.length)];
        });
    } else if (combineMode.name === 'subtract') {
        return layerBottom.map(function (value, index) {
            const result = layerTop[index] - value;
            return (result > 0 ? result : 0);
        });
    } else if (combineMode.name === 'multiply') {
        return layerBottom.map(function (value, index) {
            return (layerTop[index] * value);
        });
    } else if (combineMode.name === 'burn') { // todo: dodge
        return layerBottom.map(function (value, index) {
            return ((1 + layerTop[index]) * value);
        });
    } else if (combineMode.name === 'add') {
        let opacity = combineMode.opacity || 1;
        return layerBottom.map(function (value, index) {
            return (value + (layerTop[index] * opacity));
        });
    } else {
        // overlay (fifty-fifty)
        return layerBottom.map(function (value, index) {
            return (value + layerTop[index]) / 2;
        });
    }
}; // combineArrays()

function combineLayers(layerBottom, layerTop, width, combineMode) {
    // could be way more sophisticated. And than deserves an extra file
    let resultingImage,
        isArrayBottomLayer = Array.isArray(layerBottom),
        isArrayTopLayer = Array.isArray(layerTop);

    if (isArrayBottomLayer && isArrayTopLayer) {
        resultingImage = combineArrays(layerBottom, layerTop, width, combineMode);
    } else {
        // at least one of the images has color channels. the result has color channels.
        let bl = {}, tl = {};
        resultingImage = {};

        if (isArrayBottomLayer) {
            bl.colorRed = layerBottom;
            bl.colorGreen = layerBottom;
            bl.colorBlue = layerBottom;
            bl.colorAlpha = layerBottom;
        } else {
            bl = layerBottom;
        }

        if (isArrayTopLayer) {
            tl.colorRed = layerTop;
            tl.colorGreen = layerTop;
            tl.colorBlue = layerTop;
            tl.colorAlpha = layerTop;
        } else {
            tl = layerTop;
        }

        resultingImage.colorRed = combineArrays(bl.colorRed, tl.colorRed, width, combineMode);
        resultingImage.colorGreen = combineArrays(bl.colorGreen, tl.colorGreen, width, combineMode);
        resultingImage.colorBlue = combineArrays(bl.colorBlue, tl.colorBlue, width, combineMode);
        resultingImage.colorAlpha = combineArrays(bl.colorAlpha, tl.colorAlpha, width, combineMode);
    } // if isArray

    return resultingImage;
} // combineLayers()

export default combineLayers;