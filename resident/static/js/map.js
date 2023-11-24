import search from "./search.js";

function initMap() {
    const map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 10.762622, lng: 106.660172 },
        zoom: 13,
        mapTypeControl: false,
    });

    search(map);
}

window.initMap = initMap;
// window.initAutocomplete = search;