import search from "./search.js";
import { setMarker } from './marker.js'
import btnCurrentPosition from "./btnCurrentPosition.js";

function initMap() {
    const map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 10.762622, lng: 106.660172 },
        zoom: 13,
        mapTypeControl: false,
    });

    search(map);
    setMarker(map);
    btnCurrentPosition(map);
}

window.initMap = initMap;
// window.initAutocomplete = search;