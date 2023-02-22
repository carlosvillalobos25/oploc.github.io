document.getElementById("macro-clear").addEventListener("click", function() { clear_macro() });
document.getElementById("micro-clear").addEventListener("click", function() { clear_micro() });

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


var micro_info = L.control();
var macro_info = L.control();

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

micro_info.onAdd = function (micro_map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

micro_info.update = function () {
    this._div.innerHTML = '<h4 style="text-align:center;">COORDENADAS<br/>GEOGRÁFICAS</h4>' + 
        (polylineArr.length > 0 ? '<b>PI:</b> ' + 
        (Math.round(1000000 * polylineArr[0].lng) / 1000000).toString() + ', '+ (Math.round(1000000 * polylineArr[0].lat) / 1000000).toString()
        : 'Punto Inicial') + '<br/>' + 
        (polylineArr.length > 1 ? '<b>PF:</b> ' + 
        (Math.round(1000000 * polylineArr[polylineArr.length-1].lng) / 1000000).toString() + ', '+ (Math.round(1000000 * polylineArr[polylineArr.length-1].lat) / 1000000).toString()
        : 'Punto Final');
};

micro_info.addTo(micro_map);


macro_info.onAdd = function (macro_map) {
    this._div = L.DomUtil.create('div', 'macro_info'); // create a div with a class "info"
    this.update();
    return this._div;
};

macro_info.update = function (bounds) {
    var WN = (Math.round(micro_map.getBounds().getWest() * 10000) / 10000).toString() + ", " + (Math.round(micro_map.getBounds().getNorth() * 10000) / 10000).toString();
    var ES = (Math.round(micro_map.getBounds().getEast() * 10000) / 10000).toString() + ", " + (Math.round(micro_map.getBounds().getSouth() * 10000) / 10000).toString();

    this._div.innerHTML = '<h4 style="text-align:center;">COORDENADAS<br/>GEOGRÁFICAS</h4>' +  (bounds ?
        '<b>NW:</b> ' + WN + '<br/><b>SE:</b> ' + ES
        : '');
};

macro_info.addTo(macro_map);

setMicroOnMacro();
L.control.bigImage({position: 'bottomleft'}).addTo(macro_map, micro_map);
//L.control.bigImage({position: 'bottomleft'}).addTo(micro_map)

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
