document.getElementById('findAddress').addEventListener('click', function () {
  var address = document.getElementById('address').value;
  var geocodingUrl =
    'https://maps.googleapis.com/maps/api/geocode/json?address=' +
    encodeURIComponent(address) +
    '&key=AIzaSyBzxW5txxZHhPZCjPrOvrjCE8awoF3IP50'; 

  fetch(geocodingUrl)
    .then((response) => response.json())
    .then((data) => {
      if (data.status === 'OK') {
        var location = data.results[0].geometry.location;
        document.getElementById('locationLat').value = location.lat;
        document.getElementById('locationLng').value = location.lng;

        var mapIframe = document.getElementById('googleMap');
        mapIframe.src =
          'https://maps.google.com/maps?q=' +
          location.lat +
          ',' +
          location.lng +
          '&z=15&output=embed';

        // Lấy các chi tiết địa chỉ
        var formatted_address = data.results[0].formatted_address;
        var streetNumber, route, ward, district, city;

        streetNumber = formatted_address.split(',')[0];
        streetNumber = streetNumber.split(' ')[0];
        route = formatted_address.split(',')[0].split(' ').slice(1).join(' ');
        ward = formatted_address.split(',')[1];
        district = formatted_address.split(',')[2];
        city = formatted_address.split(',')[3];
        
        document.getElementById('addrStreetNumber').value = streetNumber.trim();
        document.getElementById('addrRoute').value = route.trim();
        document.getElementById('addrWard').value = ward.trim();
        document.getElementById('addrDistrict').value = district.trim();
        document.getElementById('addrCity').value = city.trim();

      } else {
        alert('Địa chỉ không tìm thấy');
      }
    })
    .catch((error) => console.error('Error:', error));
});

function extractAddressComponents(addressComponents) {
  var result = {
    streetNumber: '',
    route: '',
    city: '',
    ward: '',
    district: '',
  };

  addressComponents.forEach(function (component) {
    if (component.types.includes('street_number')) {
      result.streetNumber = component.long_name;
    } else if (component.types.includes('route')) {
      result.route = component.long_name;
    } else if (component.types.includes('neighborhood')) {
      result.neighborhood = component.long_name;
    } else if (component.types.includes('administrative_area_level_2')) {
      result.district = component.long_name;
    }
  });

  return result;
}

// // Khai báo biến toàn cục cho bản đồ và marker
// let map;
// let marker;

// function initMap() {
//   // Tạo một đối tượng map và hiển thị nó trong thẻ có id là "map"
//   map = new google.maps.Map(document.getElementById("map"), {
//     center: { lat: 0, lng: 0 }, // Điểm trung tâm ban đầu (có thể thay đổi)
//     zoom: 12, // Mức độ phóng ban đầu (có thể thay đổi)
//   });

//   // Bắt sự kiện click trên bản đồ
//   map.addListener("click", function (event) {
//     placeMarker(event.latLng); // Gọi hàm placeMarker() khi click
//   });
// }

// // Hàm để đặt marker tại vị trí được click
// function placeMarker(location) {
//   if (marker) {
//     marker.setPosition(location); // Di chuyển marker đến vị trí mới
//   } else {
//     marker = new google.maps.Marker({
//       position: location,
//       map: map,
//     });
//   }

//   // Lấy thông tin vị trí và hiển thị nó trong ô địa chỉ của bạn
//   reverseGeocode(location);
// }

// // Hàm để lấy thông tin địa chỉ từ vị trí (latitude và longitude)
// function reverseGeocode(location) {
//   const geocoder = new google.maps.Geocoder();
//   geocoder.geocode({ location: location }, function (results, status) {
//     if (status === "OK" && results[0]) {
//       const formattedAddress = results[0].formatted_address;
//       document.getElementById("address").value = formattedAddress;
//     }
//   });
// }
