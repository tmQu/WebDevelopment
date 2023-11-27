import search from "./search.js";

import billboard from './billboard.js'
function initMap() {
    const map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 10.762622, lng: 106.660172 },
        zoom: 13,
        mapTypeControl: false,
    });

    search(map);
    billboard(map);
}

window.initMap = initMap;
// window.initAutocomplete = search;