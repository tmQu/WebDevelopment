var infoWindow = null;

function popUpLocationInfo(map) {
  const closeBtn = document.getElementById("close-button");

  closeBtn.addEventListener("click", closeInfoWindow);

  map.addListener("click", function (event) {
    var clickedLat = event.latLng.lat();
    var clickedLng = event.latLng.lng();

    displayLocationInfo(clickedLat, clickedLng, map);
  });

  map.addListener("bounds_changed", function () {
    closeInfoWindow();
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
        results[0].formatted_address = results[0].formatted_address;

        var title = results[0].address_components[1].long_name;
        var address = results[0].formatted_address;
        //var types = results[0].types;

        var contentString =
          '<div class="container">' +
            '<div class="title">' +
              '<h5>' +
              title +
              '</h5>' +
            '</div>' +
            '<div class="address">' +
              '<p><span style="font-weight: bold;">Địa chỉ: </span>' +
              address +
              '</p>' +
            '</div>'+
          '</div>';
        
          var iwOuter = $('.gm-style-iw');
          //Remove background and pointer
          iwOuter.each(function(i,e) {
              var el = $(e);
              var iwBackground = el.prev();
              // Remove the background shadow DIV
              iwBackground.children(':nth-child(2)').css({'display' : 'none'});
              // Remove the white background DIV
              iwBackground.children(':nth-child(4)').css({'display' : 'none'});
          });
          
        infoWindow.setContent(contentString);

        infoWindow.setPosition({ lat: latitude, lng: longitude });
        infoWindow.open(map);
      } else {
        console.log("Không tìm thấy thông tin.");
      }
    } else {
      console.log("Lỗi khi lấy thông tin vị trí: " + status);
    }
  });
}

function closeInfoWindow() {
  if (infoWindow !== null) {
    infoWindow.close();
  }
}

export default popUpLocationInfo;
