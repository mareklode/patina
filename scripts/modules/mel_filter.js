function filter (image, filterDefinition, width, height) {
    let filteredImage = {};

    if (this[filterDefinition.name]) {
        filteredImage = this[filterDefinition.name](image, filterDefinition, width, height);
    } else {
        console.error("filter: \"", filterDefinition.name, "\" does not exist.");
        filteredImage = image;
    }

    return filteredImage;
}; // filter()

filter.prototype = {


    rotate: function (sourceImage, filterDefinition, width, height) {
        let angle = (filterDefinition.angle || filterDefinition.value || 0) * (Math.PI / -180), // convert to radians and invert for correct direction
            targetImage = [];

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                let newX = Math.round((x - width / 2) * Math.cos(angle) - (y - height / 2) * Math.sin(angle) + width / 2);
                let newY = Math.round((x - width / 2) * Math.sin(angle) + (y - height / 2) * Math.cos(angle) + height / 2);
                if (newX >= 0 && newX < width && newY >= 0 && newY < height) {
                    targetImage[y * width + x] = sourceImage[newY * width + newX];
                } else {
                    targetImage[y * width + x] = 0; // or some default value
                }
            }
        }
        return targetImage;
    }, // rotate()

    flip: function (sourceImage, filterDefinition, width, height) {
        const alignment = filterDefinition.alignment || filterDefinition.value || "vertical";
        let targetImage = [];
        if (alignment === "vertical") {
            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    targetImage[y * width + x] = sourceImage[(height - 1 - y) * width + x];
                }
            }
            return targetImage;
        } else if (alignment === "horizontal") {
            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    targetImage[y * width + x] = sourceImage[y * width + (width - 1 - x)];
                }
            }
            return targetImage;
        } else {
            console.error("flip: alignment \"", alignment, "\" is not supported. Use \"vertical\" or \"horizontal\".");
            return sourceImage;
        }
    }, // flip()

    mirrorHorizontal: function (sourceImage, filterDefinition, width, height) {
        let targetImage = [];
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                let factor = Math.floor(x * 2);
                if (factor >= width) {
                    targetImage[y * width + x] = sourceImage[(y + 2) * width - factor];
                } else {
                    targetImage[y * width + x] = sourceImage[y * width + factor];
                }
            }
        }
        return targetImage;
    }, // mirrorHorizontal()

    blur: function (sourceImage, filterDefinition, width, height) {
        // copied from http://blog.ivank.net/fastest-gaussian-blur.html

        let sigma = filterDefinition.radius || filterDefinition.value || 3, // standard deviation
            n = 3, // number of boxes
            targetImage = [];

        let wIdeal = Math.sqrt((12 * sigma * sigma / n) + 1);  // Ideal averaging filter width
        let wl = Math.floor(wIdeal); if (wl % 2 == 0) wl--;
        let wu = wl + 2;

        let mIdeal = (12 * sigma * sigma - n * wl * wl - 4 * n * wl - 3 * n) / (-4 * wl - 4);
        let m = Math.round(mIdeal);

        let sizes = [];
        for (let i = 0; i < n; i++) sizes.push(i < m ? wl : wu);

        let boxBlur_4 = function (sourceImage, targetImage, w, h, r) {
            for (let i = 0; i < sourceImage.length; i++) targetImage[i] = sourceImage[i];
            boxBlurH_4(targetImage, sourceImage, w, h, r);
            boxBlurT_4(sourceImage, targetImage, w, h, r);
        }
        let boxBlurH_4 = function (sourceImage, targetImage, w, h, r) {
            let iarr = 1 / (r + r + 1);
            for (let i = 0; i < h; i++) {
                let ti = i * w, li = ti, ri = ti + r;
                let fv = sourceImage[ti], lv = sourceImage[ti + w - 1], val = (r + 1) * fv;
                for (let j = 0; j < r; j++) val += sourceImage[ti + j];
                for (let j = 0; j <= r; j++) { val += sourceImage[ri++] - fv; targetImage[ti++] = val * iarr; }
                for (let j = r + 1; j < w - r; j++) { val += sourceImage[ri++] - sourceImage[li++]; targetImage[ti++] = val * iarr; }
                for (let j = w - r; j < w; j++) { val += lv - sourceImage[li++]; targetImage[ti++] = val * iarr; }
            }
        }
        let boxBlurT_4 = function (sourceImage, targetImage, w, h, r) {
            let iarr = 1 / (r + r + 1);
            for (let i = 0; i < w; i++) {
                let ti = i, li = ti, ri = ti + r * w;
                let fv = sourceImage[ti], lv = sourceImage[ti + w * (h - 1)], val = (r + 1) * fv;
                for (let j = 0; j < r; j++) val += sourceImage[ti + j * w];
                for (let j = 0; j <= r; j++) { val += sourceImage[ri] - fv; targetImage[ti] = val * iarr; ri += w; ti += w; }
                for (let j = r + 1; j < h - r; j++) { val += sourceImage[ri] - sourceImage[li]; targetImage[ti] = val * iarr; li += w; ri += w; ti += w; }
                for (let j = h - r; j < h; j++) { val += lv - sourceImage[li]; targetImage[ti] = val * iarr; li += w; ti += w; }
            }
        }

        boxBlur_4(sourceImage, targetImage, width, height, (sizes[0] - 1) / 2);
        boxBlur_4(targetImage, sourceImage, width, height, (sizes[1] - 1) / 2);
        boxBlur_4(sourceImage, targetImage, width, height, (sizes[2] - 1) / 2);

        return targetImage;
    }, // blur()

    // for color channels, why does this sometimes produce lines? or dots?
    alpha: function (image, filterDefinition) {
        let opacity = filterDefinition?.opacity || 1;
        /*
        for (let i = 0; i< image.length/4; i++) {
            image[i*5] = opacity;
        };*/
        return image.map(function (value, index) {
            if (index % 4 === 0) {
                return opacity;
            } else {
                return value;
            }
        });
    },

    // the brightness function keeps black and white and manipulates the color-curve between them
    // ToDo: naming of contrast and brightness are confusing / misleading
    brightness: function (image, filterDefinition) {
        let brightness = filterDefinition.brightness || 0;

        if (brightness < 0) {
            // for brightness =-2 : https://www.wolframalpha.com/ <-- Plot[x^0.25, {x, 0, 1}]
            brightness = (-1 / (brightness - 1));
        } else {
            // for brightness = 0 : https://www.wolframalpha.com/ <-- Plot[x^1, {x, 0, 1}]
            // for brightness = 2 : https://www.wolframalpha.com/ <-- Plot[x^3, {x, 0, 1}]
            brightness += 1;
        }
        return image.map(function (value) {
            return value ** brightness;
        });

    }, // brightness()


    //   y
    //    \                /
    //     \              /
    //      \            /
    //       \          /
    //        \        /
    //         \      /
    //          \    /
    //           \  /
    //            \/        x
    // just for black and white (0-1) for now, ToDo: color version (0-255)
    ramp: function (image, filterDefinition) {
        return image.map(function (value) {
            return Math.abs((value * -2) + 1);
        });
    }, // ramp()

    brightness_new: function (image, filterDefinition) {
        let brightness = filterDefinition.value || 0;
        return image.map(function (value) {
            return value + brightness;
        });

    }, // brightness()

    contrast: function (image, filterDefinition) {
        let y = 0.5, // always
            m = filterDefinition.m || 1, // slope
            x = filterDefinition.x || 0.5,
            n = y - m * x;

        return image.map(function (value) {
            let y = m * value + n; // linear equation
            if (y < 0) { return 0; }
            if (y > 1) { return 1; }
            return y;
        });
    },
    contrast_new: function (image, filterDefinition) {
        // https://easings.net/ // with functions
        function easeInOutExponent (x, exponent) {
            return x < 0.5 ? Math.pow(2, exponent - 1) * Math.pow(x, exponent) : 1 - Math.pow(-2 * x + 2, exponent) / 2;
        }
        let exponent = filterDefinition.value || 2;

        return image.map(function (value) {
            let y = easeInOutExponent(value, exponent);
            return y;
        });
    }, // contrast()

    invert: function (image) {
        return image.map(function (value) {
            return -value + 1;
        });
    }, // invert()

    // maximize the color range of the array to 0..1
    push: function (image) {
        /*
        const max = Math.max(...image),
                min = Math.min(...image),
        this breaks for large arrays and the standard loop is faster
        see https://jsperf.com/find-min-max-of-array
        */
        let max = image[0];
        for (let i = 1; i < image.length; ++i) {
            if (image[i] > max) {
                max = image[i];
            }
        }

        let min = image[0];
        for (let i = 1; i < image.length; ++i) {
            if (image[i] < min) {
                min = image[i];
            }
        }

        const by = 1 / (max - min);

        return image.map(function (value) {
            return (value - min) * by;
        })
    }, // push()

    threshold: function (image, filterDefinition) {
        let threshold = filterDefinition.threshold || filterDefinition.value || 0.5;
        return image.map(function (value) {
            return value > threshold ? 1 : 0;
        })
    }, // threshold()

    _getPixel: function (x, y) {
        return this.image[y * this.width + x];
    }, // _getPixel()

    _setPixel: function (x, y, color) {
        this.image[y * this.width + x] = color;
    }, // _setPixel()

}; // filter.prototype

export default filter;
