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
        mapIframe.src = 'https://maps.google.com/maps?q=' + location.lat + ',' + location.lng + '&z=15&output=embed';

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

document.addEventListener('DOMContentLoaded', function () {
  const editBoardForm = document.getElementById('editBoardForm');
  const editQuantity = document.getElementById('editQuantity');
  const editAdvertisementForm = document.getElementById('editAdvertisementForm');
  const editLocationCategory = document.querySelectorAll('input[name="locationCategory"]');
  const editReason = document.getElementById('editReason');
  const editUploadImage = document.getElementById('editUploadImage');

  editBoardForm.addEventListener('submit', function (event) {
    // Đặt biến flag để kiểm tra việc validate
    let isValid = true;

    // Kiểm tra Số lượng
    if (editQuantity.value === '') {
      isValid = false;
      alert('Vui lòng nhập Số lượng.');
      event.preventDefault();
    }

    // Kiểm tra Loại bảng quảng cáo
    if (editAdvertisementForm.value === '') {
      isValid = false;
      alert('Vui lòng chọn Loại bảng quảng cáo.');
      event.preventDefault();
    }

    // Kiểm tra Loại đất (ít nhất một phải được chọn)
    let isLocationCategorySelected = false;
    editLocationCategory.forEach((checkbox) => {
      if (checkbox.checked) {
        isLocationCategorySelected = true;
      }
    });
    if (!isLocationCategorySelected) {
      isValid = false;
      alert('Vui lòng chọn ít nhất một Loại đất.');
      event.preventDefault();
    }

    // Kiểm tra Lý do
    if (editReason.value === '') {
      isValid = false;
      alert('Vui lòng nhập Lý do.');
      event.preventDefault();
    }

    // Kiểm tra Ảnh đính kèm (ít nhất một tệp phải được chọn)
    if (editUploadImage.files.length === 0) {
      isValid = false;
      alert('Vui lòng chọn ít nhất một Ảnh đính kèm.');
      event.preventDefault();
    }

    // Nếu không hợp lệ, ngăn chặn việc gửi form
    if (!isValid) {
      event.preventDefault();
    }
  });
});
