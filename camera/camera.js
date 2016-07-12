
var cocText = document.getElementById("coc");
var apertureInput = document.getElementById("aperture");
var focalInput = document.getElementById("focal");
var cropInput = document.getElementById("crop");
var distanceInput = document.getElementById("distance");
var sizeInput = document.getElementById("size");
var megapixelInput = document.getElementById("megapixel");
var sensorInput = document.getElementById("sensor");
var fnumInput = document.getElementById("fnum");
var n0Input = document.getElementById("n0");
var cf0Input = document.getElementById("cf0");
var m0Input = document.getElementById("m0");
var t0Input = document.getElementById("t0");

var calcButton = document.getElementById("calc");

var hyperOutput = document.getElementById("hyper");
var dnOutput = document.getElementById("dn");
var dfOutput = document.getElementById("df");
//var blurOutput = document.getElementById("blur");
var expoOutput = document.getElementById("expo");
var eqvOutput = document.getElementById("eqv");
var pixelOutput = document.getElementById("pixel");
var hfovOutput = document.getElementById("hfov");
var vfovOutput = document.getElementById("vfov");
var angleOutput = document.getElementById("angle");

//var BLUR_COC = 0.2; //mm
var FF_SQUARE = 864; //mm2
var FF_LENGTH = 36; //mm
var FF_HIGHT = 24; //mm

calcButton.addEventListener("click", calc);
sensorInput.addEventListener("change", setCrop);
cropInput.addEventListener("input", setSensor);
apertureInput.addEventListener("input", setFnum);
fnumInput.addEventListener("change", setAperture);

function calc() {
    setHyper();
    setDof();
    setExpo();
    setEquivalent();
    setPixel();
    setFov();
    setAngle();
}

function setCrop() {
    switch (sensorInput.value) {
        case "select sensor":
            cropInput.value = "";
            break;
        case "1/10\"":
            cropInput.value = 27.04;
            break;
        case "1/8\"":
            cropInput.value = 21.65;
            break;
        case "1/6\"":
            cropInput.value = 14.14;
            break;
        case "1/4\"":
            cropInput.value = 10.81;
            break;
        case "1/3.6\"":
            cropInput.value = 8.65;
            break;
        case "1/3.2\"":
            cropInput.value = 7.61;
            break;
        case "1/3\"":
            cropInput.value = 7.21;
            break;
        case "1/2.7\"":
            cropInput.value = 6.44;
            break;
        case "1/2.5\"":
            cropInput.value = 6.02;
            break;
        case "1/2.3\"":
            cropInput.value = 5.64;
            break;
        case "1/2\"":
            cropInput.value = 5.41;
            break;
        case "1/1.8\"":
            cropInput.value = 4.84;
            break;
        case "1/1.7\"":
            cropInput.value = 4.55;
            break;
        case "1/1.6\"":
            cropInput.value = 4.3;
            break;
        case "2/3\"":
            cropInput.value = 3.93;
            break;
        case "1/1.2\"":
            cropInput.value = 3.24;
            break;
        case "1\"":
            cropInput.value = 2.72;
            break;
        case "4/3\"":
            cropInput.value = 2;
            break;
        case "1.5\"":
            cropInput.value = 1.85;
            break;
        case "Canon APS-C":
            cropInput.value = 1.61;
            break;
        case "APS-C":
            cropInput.value = 1.53;
            break;
        case "APS-H":
            cropInput.value = 1.29;
            break;
        case "Full-frame":
            cropInput.value = 1;
            break;
    }
}

function setAperture() {
    switch (fnumInput.value) {
        case "select":
            apertureInput.value = "";
            break;
        default:
            apertureInput.value = Math.round(parseFloat(fnumInput.value)*10)/10;
    }
}

function setSensor() {
    sensorInput.value = "select sensor";
}

function setFnum() {
    fnumInput.value = "select";
}

function setEquivalent() {

    var focal = parseFloat(focalInput.value);
    var crop = parseFloat(cropInput.value);

    var eqv = Math.round(focal * crop);

    if (!isNaN(eqv)) {
        eqvOutput.innerHTML = eqv + "mm";
    } else {
        eqvOutput.innerHTML = "";
    }

}

function setPixel() {

    var crop = parseFloat(cropInput.value);
    var megapixel = parseFloat(megapixelInput.value);

    var pixel = Math.round(Math.sqrt(FF_SQUARE / crop / crop / megapixel) * 100) / 100;

    if (!isNaN(pixel)) {
        pixelOutput.innerHTML = pixel + "&mu;m";
    } else {
        pixelOutput.innerHTML = "";
    }

}

function setFov() {

    var focal = parseFloat(focalInput.value);
    var crop = parseFloat(cropInput.value);

    var hfov = Math.round(fovangle(focal, crop, FF_LENGTH)*10)/10;
    var vfov = Math.round(fovangle(focal, crop, FF_HIGHT)*10)/10;
    
    if (!isNaN(hfov)) {
        hfovOutput.innerHTML = hfov + "&deg;";
        vfovOutput.innerHTML = vfov + "&deg;";
    } else {
        hfovOutput.innerHTML = "";
        vfovOutput.innerHTML = "";
    }

}

function setAngle() {

    var distance = parseFloat(distanceInput.value);
    var size = parseFloat(sizeInput.value);

    var angle = Math.round(objectangle(distance, size)*10)/10;

    if (!isNaN(angle)) {
        angleOutput.innerHTML = angle + "&deg;";
    } else {
        angleOutput.innerHTML = "";
    }

}

function setHyper() {

    var coc = parseFloat(cocText.value);
    var aperture = parseFloat(apertureInput.value);
    var focal = parseFloat(focalInput.value);
    var crop = parseFloat(cropInput.value);

    var hyper = Math.round(hyperfocal(coc, aperture, focal, crop) * 100) / 100;

    if (!isNaN(hyper)) {
        hyperOutput.innerHTML = hyper + "m";
    } else {
        hyperOutput.innerHTML = "";
    }

}

function setDof() {

    var coc = parseFloat(cocText.value);
    var aperture = parseFloat(apertureInput.value);
    var focal = parseFloat(focalInput.value);
    var crop = parseFloat(cropInput.value);
    var distance = parseFloat(distanceInput.value);

    var dn = near(coc, aperture, focal, crop, distance);
    var df = far(coc, aperture, focal, crop, distance);
//    var blur = far(BLUR_COC, aperture, focal, crop, distance);

    if (!isNaN(dn)) {

        if (df < 0) {
            dnOutput.innerHTML = Math.round(dn * 100) / 100 + "m";
            dfOutput.innerHTML = "infinity";
        } else if (dn >= df) {
            dnOutput.innerHTML = "out of focus";
            dfOutput.innerHTML = "out of focus";
        } else {
            dnOutput.innerHTML = Math.round(dn * 100) / 100 + "m";
            dfOutput.innerHTML = Math.round(df * 100) / 100 + "m";
        }

//        if (blur < 0) {
//            blurOutput.innerHTML = "infinity";
//        } else if (dn >= df) {
//            blurOutput.innerHTML ="out of focus";
//        } else {
//            blurOutput.innerHTML = Math.round(blur * 100) / 100 + "m";
//        }

    } else {
        dnOutput.innerHTML = "";
        dfOutput.innerHTML = "";
//        blurOutput.innerHTML = "";
    }

}

function setExpo() {

    var aperture = parseFloat(apertureInput.value);
    var crop = parseFloat(cropInput.value);
    var megapixel = parseFloat(megapixelInput.value);
    var n0 = parseFloat(n0Input.value);
    var cf0 = parseFloat(cf0Input.value);
    var m0 = parseFloat(m0Input.value);
    var t0 = parseFloat(t0Input.value);

    var expo = Math.round(exposition(aperture, crop, megapixel, n0, cf0, m0, t0) * 1000) / 1000;

    if (!isNaN(expo)) {
        expoOutput.innerHTML = expo + " sec";
    } else {
        expoOutput.innerHTML = "";
    }

}

function hyperfocal(coc, aperture, focal, crop) {
    return (focal + Math.pow(focal, 2) / aperture / (coc / crop)) / 1000;
}

function near(coc, aperture, focal, crop, distance) {
    return distance * Math.pow(focal, 2) / (Math.pow(focal, 2) + aperture * coc / crop * (distance * 1000 - focal));
}

function far(coc, aperture, focal, crop, distance) {
    return distance * Math.pow(focal, 2) / (Math.pow(focal, 2) - aperture * coc / crop * (distance * 1000 - focal));
}

function exposition(aperture, crop, megapixel, n0, cf0, m0, t0) {
    return t0 * Math.pow(aperture / n0, 2) * (megapixel / m0) * Math.pow(crop / cf0, 2);
}

function fovangle(focal, crop, sensorSize) {
    return 2 * Math.atan(sensorSize / crop / focal / 2) / Math.PI * 180;
}

function objectangle(distance, size) {
    return 2 * Math.atan(size / distance / 2) / Math.PI * 180;
}




