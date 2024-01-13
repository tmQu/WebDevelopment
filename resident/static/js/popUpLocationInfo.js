var infoWindow = null;

function popUpLocationInfo(map) {
  const closeBtn = document.getElementById("close-button");

  closeBtn.addEventListener("click", closeInfoWindow);

  map.addListener("click", function (event) {
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
        results[0].formatted_address = results[0].formatted_address;

        var title = results[0].address_components[1].long_name;
        var address = results[0].formatted_address;

        var detailAddress = results[0].formatted_address.split(", ");

        var ward;
        var district;
        if (detailAddress.length < 4) {
          ward = '';
        }
        else {
          ward = detailAddress[detailAddress.length - 4];
        }
        district = detailAddress[detailAddress.length - 3];

        if (district == 'Quận 2' || district == 'Quận 9') {
          district = 'Thủ Đức'
        }

        //var types = results[0].types;
        console.log(results[0]);
        var contentString =
          // `<div class="container"> 
          //   <div class="title">
          //     <h5>
          //     ${title}
          //     <a class="btn" href=""><i class="bi bi-exclamation-octagon"></i></a>
          //     </h5>
          //   </div>
          //   <div class="address">
          //     <p><span style="font-weight: bold;">Địa chỉ: </span>
          //     ${address}
          //     </p>
          //   </div>
          // </div>`
          `<div class="card" style="background: linear-gradient(90deg, #c8e0f8, #e4f8f0); border: none;">
          <div class="card-body pb-0">
            <div class="d-flex justify-content-between">
              <p class="mb-0 h5" style="font-weight: bold;">${title} <a class="btn btn-report" href="http://localhost:3000/static/html/locationReport.html?lat=${latlng.lat}&lng=${latlng.lng}&ward=${ward}&district=${district}"><i class="bi bi-exclamation-octagon"></i></a></p>
              
            </div>
          </div>
          <hr>
          <div class="card-body pt-0">
            <h6 class="font-weight-bold mb-1">${address}</h6>

          </div>
        </div>
      </div>`
        
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
