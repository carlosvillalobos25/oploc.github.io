document.getElementById("macro-clear").addEventListener("click", function() { clear_macro() });
document.getElementById("micro-clear").addEventListener("click", function() { clear_micro() });

let latGi = document.getElementById("latGi");
let latMi = document.getElementById("latMi");
let latSi = document.getElementById("latSi");
let lonGi = document.getElementById("lonGi");
let lonMi = document.getElementById("lonMi");
let lonSi = document.getElementById("lonSi");
let latGf = document.getElementById("latGf");
let latMf = document.getElementById("latMf");
let latSf = document.getElementById("latSf");
let lonGf = document.getElementById("lonGf");
let lonMf = document.getElementById("lonMf");
let lonSf = document.getElementById("lonSf");


const macro_map = L.map('macro-map').setView([28.18, -105.47], 12);
const micro_map = L.map('micro-map').setView([28.18, -105.47], 13);

const macro_tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(macro_map);

const micro_tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(micro_map);

micro_map.on('moveend', function onDragEnd(){
    clearMap(macro_map);
    setMicroOnMacro();
});

function clearMap(m) {
    for(i in m._layers) {
        if(m._layers[i]._path != undefined) {
            try {
                m.removeLayer(m._layers[i]);
            }
            catch(e) {
                alert("problem with " + e + m._layers[i]);
            }
        }
    }
}

function setMicroOnMacro() {
    macro_info.update(micro_map.getBounds())
    
    var latN = micro_map.getBounds().getNorth();
    var latS = micro_map.getBounds().getSouth();
    var lonE = micro_map.getBounds().getEast();
    var lonW = micro_map.getBounds().getWest();

    clearMap(macro_map);

    var area = L.polygon([
		[latN, lonW],
		[latN, lonE],
		[latS, lonE],
        [latS, lonW]
	], {color:'red'}).addTo(macro_map);
}

var polyline = null;
var polylineArr = [];
var pointer1 = null;
var pointer2 = null;

var popup = L.popup();

function onMapClick(e) {
    
    micro_map.eachLayer((layer) => {
            if ((layer == micro_tiles) == false) {
                layer.remove();
            }
        });

    polylineArr.push(e.latlng);
    if (pointer1 == null) {
        pointer1 = polylineArr[0];
    } else {
        pointer2 = polylineArr[-1];
        polyline = L.polyline(polylineArr, {color:'red', weight: 7}).addTo(micro_map);
    }
    
    micro_info.update();
}

micro_map.on('click', onMapClick);


var micro_info = L.control();

micro_info.onAdd = function () {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

micro_info.update = function () {
    this._div.innerHTML = '<h4 style="text-align:center;">COORDENADAS<br/>GEOGRÁFICAS</h4>' + 
        (polylineArr.length > 0 ? 
        (Math.round(1000000 * polylineArr[0].lng) / 1000000).toString() + ', '+ (Math.round(1000000 * polylineArr[0].lat) / 1000000).toString()
        : 'Punto Inicial') + '<br/>' + 
        (polylineArr.length > 1 ? 
        (Math.round(1000000 * polylineArr[polylineArr.length-1].lng) / 1000000).toString() + ', '+ (Math.round(1000000 * polylineArr[polylineArr.length-1].lat) / 1000000).toString()
        : 'Punto Final');
    
    if (polylineArr.length > 1) {
        setP2(polylineArr[polylineArr.length-1].lat, polylineArr[polylineArr.length-1].lng);
    } else if (polylineArr.length == 1) {
        setP1(polylineArr[0].lat, polylineArr[0].lng);
    }
    
};

function setP1(lat, lon) {
    latGi.innerText = getGrades(lat);
    latMi.innerText = getMinutes(lat);
    latSi.innerText = getSeconds(lat);
    lonGi.innerText = getGrades(lon);
    lonMi.innerText = getMinutes(lon);
    lonSi.innerText = getSeconds(lon);
}

function setP2(lat, lon) {
    latGf.innerText = getGrades(lat);
    latMf.innerText = getMinutes(lat);
    latSf.innerText = getSeconds(lat);
    lonGf.innerText = getGrades(lon);
    lonMf.innerText = getMinutes(lon);
    lonSf.innerText = getSeconds(lon);
}

function getGrades(ang) {
    let i;
    ang < 0 ? i = -1 : i = 1;
    ang = Math.abs(ang);
    return i * Math.floor(ang);
}

function getMinutes(ang) {
    ang = Math.abs(ang);
    ang = 60 * (ang - Math.floor(ang));
    return Math.floor(ang);
}

function getSeconds(ang) {
    let min;
    let sec;
    ang = Math.abs(ang);
    min = 60 * (ang - Math.floor(ang));
    sec = 60 * (min - Math.floor(min));
    return Math.round(sec * 100) / 100;
}

function copyP1() {
    let text = latGi.innerText + "\t" + lonGi.innerText + "\n" + 
    latMi.innerText + "\t" + lonMi.innerText + "\n" + 
    latSi.innerText + "\t" + lonSi.innerText;
    var dummy = document.createElement("textarea");
    // to avoid breaking orgain page when copying more words
    // cant copy when adding below this code
    // dummy.style.display = 'none'
    document.body.appendChild(dummy);
    //Be careful if you use texarea. setAttribute('value', value), which works with "input" does not work with "textarea". – Eduard
    dummy.value = text;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
}

function copyP2() {
    let text = latGf.innerText + "\t" + lonGf.innerText + "\n" + 
    latMf.innerText + "\t" + lonMf.innerText + "\n" + 
    latSf.innerText + "\t" + lonSf.innerText;
    var dummy = document.createElement("textarea");
    // to avoid breaking orgain page when copying more words
    // cant copy when adding below this code
    // dummy.style.display = 'none'
    document.body.appendChild(dummy);
    //Be careful if you use texarea. setAttribute('value', value), which works with "input" does not work with "textarea". – Eduard
    dummy.value = text;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
}


micro_info.addTo(micro_map);


var macro_info = L.control();

macro_info.onAdd = function () {
    this._div = L.DomUtil.create('div', 'macro_info'); // create a div with a class "info"
    this.update();
    return this._div;
};

macro_info.update = function (bounds) {
    var WN = (Math.round(micro_map.getBounds().getWest() * 10000) / 10000).toString() + ", " + (Math.round(micro_map.getBounds().getNorth() * 10000) / 10000).toString();
    var ES = (Math.round(micro_map.getBounds().getEast() * 10000) / 10000).toString() + ", " + (Math.round(micro_map.getBounds().getSouth() * 10000) / 10000).toString();

    this._div.innerHTML = '<h4 style="text-align:center;">COORDENADAS<br/>GEOGRÁFICAS</h4>' +  (bounds ?
        WN + '<br/>' + ES
        : '');
};

macro_info.addTo(macro_map);

setMicroOnMacro();

function clear_macro() {
    clearMap(macro_map);
    macro_info.update("")
}

function clear_micro() {
    micro_map.eachLayer((layer) => {
        if (layer != micro_tiles) {
            layer.remove();
        }
    });
    pointer1 = null;
    pointer2 = null;
    polyline = null;
    polylineArr = [];
    micro_info.update();
}

const macrom = L.control.bigImage({position: 'bottomleft'}).addTo(macro_map);
const microm = L.control.bigImage({position: 'bottomleft'}).addTo(micro_map);
macrom.hideControlPanel();
microm.hideControlPanel();

document.getElementById("macro-print").addEventListener("click", function() {
    macrom.onPrint('macrolocalizacion.png');
    microm.onPrint('microlocalizacion.png');
});