/* OGD Wien Beispiel */

let stephansdom = {
    lat: 48.208493,
    lng: 16.373118,
    title: "Stephansdom"
};

let startLayer = L.tileLayer.provider("BasemapAT.grau")

let map = L.map("map", {
    center: [ stephansdom.lat, stephansdom.lng ], 
    zoom: 12,
    layers: [
        startLayer
    ]
});

let layerControl = L.control.layers({
    "BasemapAT Grau": startLayer, 
    "Basemap Standard": L.tileLayer.provider ("BasemapAT.basemap"),
    "Basemap High-DPI": L.tileLayer.provider ("BasemapAT.highdpi"), 
    "Basemap Gelände": L.tileLayer.provider ("BasemapAT.terrain"), 
    "Basemap Oberfläche": L.tileLayer.provider ("BasemapAT.surface"), 
    "Basemap Orthofoto": L.tileLayer.provider ("BasemapAT.orthofoto"), 
    "Basemap Beschriftung": L.tileLayer.provider ("BasemapAT.overlay"), 
    "Basemap mit Orthofoto und Beschriftung": L.layerGroup([
        L.tileLayer.provider ("BasemapAT.orthofoto"), 
        L.tileLayer.provider ("BasemapAT.overlay"),
    ])
}).addTo(map);

layerControl.expand();

/*
let sightLayer = L.featureGroup();
layerControl.addOverlay(sightLayer, "Sehenswürdigkeiten");

let mrk = L.marker([ stephansdom.lat, stephansdom.lng]).addTo(sightLayer);

sightLayer.addTo(map);
*/


// Maßstab hinzufügen
L.control.scale({
    imperial: false,
}).addTo(map);

L.control.fullscreen().addTo(map);

//Minimap
let miniMap = new L.Control.MiniMap(
    L.tileLayer.provider("BasemapAT"), {
        toggleDisplay: true
    }
).addTo(map);

// Sehenswürdigkeiten
async function loadSites(url) {
   let response = await fetch(url);
   let geojson = await response.json(); 
   //console.log(geojson);

   let overlay = L.featureGroup();
   layerControl.addOverlay(overlay, "Sehenswürdigkeiten");
   overlay.addTo(map); //damit wird entschieden ob die Checkbox standardmäßig an- oder ausgeschaltet ist

   L.geoJSON(geojson).addTo(overlay);
}
loadSites ("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:SEHENSWUERDIGOGD&srsName=EPSG:4326&outputFormat=json");

// Haltestellen Vienna Sightseeing
async function loadStops(url) {
    let response = await fetch(url);
    let geojson = await response.json(); 
    //console.log(geojson);
 
    let overlay = L.featureGroup();
    layerControl.addOverlay(overlay, "Haltestellen Vienna Sightseeing");
    overlay.addTo(map); //damit wird entschieden ob die Checkbox standardmäßig an- oder ausgeschaltet ist
 
    L.geoJSON(geojson).addTo(overlay);
 }
loadStops ("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:TOURISTIKHTSVSLOGD&srsName=EPSG:4326&outputFormat=json");

