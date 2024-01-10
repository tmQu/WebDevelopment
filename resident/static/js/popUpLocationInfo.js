var infoWindow = null;

function popUpLocationInfo(map) {
    const closeBtn = document.getElementById('close-button');

    closeBtn.addEventListener('click', closeInfoWindow);

    map.addListener('click', function (event) {
        var clickedLat = event.latLng.lat();
        var clickedLng = event.latLng.lng();

        displayLocationInfo(clickedLat, clickedLng, map);
    });


}

function displayLocationInfo(latitude, longitude, map) {
    if (infoWindow === null) {
        infoWindow = new google.maps.InfoWindow();
    }

    var geocoder = new google.maps.Geocoder();
    var latlng = { lat: latitude, lng: longitude };

    geocoder.geocode({ location: latlng }, function (results, status) {
        if (status === "OK") {
            if (results[0]) {
                results[0].formatted_address = results[0].formatted_address.replace(/,/g, ',<br/>');
                
                var title = results[0].address_components[1].long_name;
                var address = results[0].formatted_address;
                console.log(results[0]);

                var contentString = '<div id="info-content">' +
                    '<h3>' + title + '</h3>' +
                    '<p>' + address + '</p>' +

                    '</div>';

                infoWindow.setContent(contentString);

                infoWindow.setPosition({ lat: latitude, lng: longitude });
                infoWindow.open(map);
            } else {
                console.log('Không tìm thấy thông tin.');
            }
        } else {
            console.log('Lỗi khi lấy thông tin vị trí: ' + status);
        }
    });
}

function closeInfoWindow() {
    if (infoWindow !== null) {
        infoWindow.close();
    }
}

export default popUpLocationInfo;