function btnCurrentPosition(map) {
    const geocoder = new google.maps.Geocoder();
    const infowindow = new google.maps.InfoWindow();
    const btnCurrentPosition = document.getElementById("btnCurPosition");

    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(btnCurrentPosition);
    
    btnCurrentPosition.addEventListener("click", () => {
        goToCurrentPosition(geocoder, map, infowindow);
    });
}

function goToCurrentPosition(geocoder, map, infowindow) {
    navigator.geolocation.getCurrentPosition((position) => {
        const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
        };
        geocoder
            .geocode({ location: pos })
            .then(({ results }) => {
                if (results[0]) {
                    map.panTo(pos);

                    const marker = new google.maps.Marker({
                        map,
                        position: pos,
                    });

                    infowindow.setContent(results[0].formatted_address);
                    infowindow.open(map, marker);
                } else {
                    window.alert("No results found");
                }
            })
            .catch((e) => window.alert("Geocoder failed due to: " + e));
    });
}

export default btnCurrentPosition;