// import btnCurrentPosition from './btnCurrentPosition.js';
// import popUpLocationInfo from './popUpLocationInfo.js';
// import getAdvertisementBoards from './clusterMarker.js';
// import filter from './filter.js';

async function search(map) {
  // Create the search box and link it to the UI element.
  const input = document.getElementById('pac-input');
  const { SearchBox } = await google.maps.importLibrary('places');
  const searchBox = new SearchBox(input);

  map.controls[google.maps.ControlPosition.TOP_CENTER].push(input);
  // Bias the SearchBox results towards current map's viewport.
  map.addListener('bounds_changed', () => {
    searchBox.setBounds(map.getBounds());
  });

  let markers = [];

  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox.addListener('places_changed', () => {
    const places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    }

    // Clear out the old markers.
    markers.forEach((marker) => {
      marker.setMap(null);
    });
    markers = [];

    // For each place, get the icon, name and location.
    const bounds = new google.maps.LatLngBounds();

    places.forEach((place) => {
      if (!place.geometry || !place.geometry.location) {
        console.log('Returned place contains no geometry');
        return;
      }

      const icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25),
      };

      // Create a marker for each place.
      markers.push(
        new google.maps.Marker({
          map,
          icon,
          title: place.name,
          position: place.geometry.location,
        })
      );
      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);
  });
}

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
          
          `<div class="card" style="background: linear-gradient(90deg, #c8e0f8, #e4f8f0); border: none;">
          <div class="card-body pb-0">
            <div class="d-flex justify-content-between">
              <p class="mb-0 h5" style="font-weight: bold;">${title}</p>
              
            </div>
          </div>
          <hr>
          <div class="card-body pt-0">
            <h6 class="mb-1">${address}</h6>

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

const apiUrl = 'localhost:4000'

function getBoardLocationInfor(id, callback) {
    var url = 'http://'+ apiUrl + '/api/v1/boards/' + id;
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE)
        {
            callback(JSON.parse(xhr.responseText));
        }
    }
    xhr.open('GET', url);
    xhr.send();
}

function getDetailBoard(id, callback)
{
    var url = 'http://'+ apiUrl + '/api/v1/boards/detail/' + id;
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE)
        {
            callback(JSON.parse(xhr.responseText));
        }
    }
    xhr.open('GET', url);
    xhr.send();

}

function addCarousel(images)
{
    var imgSlider = '';

    for (var i = 0; i < images.length; i++) {
        var img = images[i];
       imgSlider += `
       <div class="carousel-item ${i == 0 ? 'active': ''}">
       <img crossorigin="anonymous" src="${img}" class="d-block w-100" style="max-height: 240px; object-fit: cover">
       </div>
       `
    };
    
    document.querySelector('#carousel-location').innerHTML = imgSlider;
}

function parseContentMarker(content)
{
    var locationCategory = [];
    content.locationCategory.forEach(category => {
        locationCategory.push(category.locationCategory);
    })
    locationCategory = locationCategory.join(', ');


    var addr = `${content.addr.street_number} ${content.addr.route}, ${content.addr.ward.ward}, ${content.addr.district.district}, ${content.addr.city}`;

//     return `<div class="card" style="background: linear-gradient(90deg, #c8e0f8, #e4f8f0); border: none">
//     <div class="card-body pb-0">
//       <div class="d-flex justify-content-between">
//         <p class="mb-0 h5" style="font-weight: bold;">${title} <a class="btn" href=""><i class="bi bi-exclamation-octagon"></i></a></p>
        
//       </div>
//     </div>
//     <hr>
//     <div class="card-body pt-0">
//       <h6 class="font-weight-bold mb-1">${address}</h6>

//     </div>
//   </div>
// </div>`

    return `<div class="marker-content" style="background: linear-gradient(90deg, #c8e0f8, #e4f8f0); border: none; padding: 10px">\n
    <h5 class="advt-form mb-0" style="font-weight: bold; color: black;">${content.advertisementForm.advertisementForm}</h5>\n
    <div class="location-category" style="color: black;">${locationCategory}</div>\n
    <div class="addr" style="color: black;">${addr}</div>\n
    <h6 class="planning" style="font-weight: bold;">${content.isPlan == true ? 'Đã quy hoạch' : 'Chưa quy hoạch'}</h6>\n
    </div>`;
}

function parseBillBoardContent(boardLocation, board){
    var addr = `${boardLocation.addr.street_number} ${boardLocation.addr.route}, ${boardLocation.addr.ward.ward}, ${boardLocation.addr.district.district}, ${boardLocation.addr.city}`;
    var size = `${board.size}`
    var locationCategory = "";

    var locationCategory = [];
    boardLocation.locationCategory.forEach(category => {
        locationCategory.push(category.locationCategory);
    })
    locationCategory = locationCategory.join(', ');


    // Thêm offset 7 giờ để chuyển múi giờ hiện tại thành múi giờ Việt Nam
    const vietnamTime = new Date(new Date(board.expireDate).getTime() + 7 * 60 * 60 * 1000);

    const year = vietnamTime.getFullYear();
    const month = vietnamTime.getMonth() + 1; // Tháng bắt đầu từ 0, cần cộng thêm 1
    const day = vietnamTime.getDate();

    const dateString = `${day < 10 ? '0' + day : day}/${month < 10 ? '0' + month : month}/${year}`;

    // return `
    // <div class="card" style="background: linear-gradient(90deg, #c8e0f8, #e4f8f0); border: none">
    //       <div class="card-body pb-0">
    //         <div class="d-flex justify-content-between">
    //           <p class="mb-0 h5" style="font-weight: bold;">${title} <a class="btn" href=""><i class="bi bi-exclamation-octagon"></i></a></p>
              
    //         </div>
    //       </div>
    //       <hr>
    //       <div class="card-body pt-0">
    //         <h6 class="font-weight-bold mb-1">${address}</h6>

    //       </div>
    //     </div>
    //   </div>`

    return `
    <div class="billboard" id = "${board.id}" style="background: linear-gradient(90deg, #c8e0f8, #e4f8f0);">
    <div class="billboard-type" style="font-weight: bold; font-size:15pt; color: black;">
        ${board.boardType.boardType}
    </div>
    <div class="billboard-addr" style="color: black;">
        <img src="/static/img/icon/icons8-maps.png" alt="" style="height: 1em;">
       ${addr}
    </div>
    <div class="billboard-size" style="color: black;"><strong>Kích thước</strong> ${size}</div>
    <div class="billboard-size" style="color: black;"><strong>Số lượng</strong> ${board.quantity}</div>
    <div class="billboard-form" style="color: black;"><strong>Hình thức</strong> ${boardLocation.advertisementForm.advertisementForm}</div>
    <div class="billboard-category" style="color: black;"><strong>Phân loại</strong> ${locationCategory}</div> 
    <div class="d-flex justify-content-end mt-4 mb-1"><button class="btn btn-outline-primary"><i class="bi bi-info-lg"></i></button>
    </div>

    <div class="detail-infor">
        <button type="button" class="btn-close" aria-label="Close"></button>
        <img crossorigin="anonymous" src="${board.imgBillboard}" class="d-block w-100" style="max-height: 240px; object-fit: cover">
        <div class="mt-3" style="color: black;"><strong>Ngày hết hạn hộp đồng</strong>: ${dateString}</div>
    </div>
    </div>
    `

}

function setMarkerBillBoard(map, location, marker,infowindow)
{
        
    marker.addListener('click', () => {
        map.panTo(marker.position);

        infowindow.setContent(parseContentMarker(location));
        infowindow.open({
            anchor: marker,
            map
        })
    })



    marker.addListener('click', (event) => {
        getDetailBoard(location._id, (detailInfor) => {

            var boardLocation = detailInfor.data.boardLocation;
            var boards = detailInfor.data.boards;

            var subWindow = document.getElementById('sub-window');
            var content = document.querySelector('#sub-window .overflow-content')

            addCarousel(boardLocation.imgBillboardLocation);
            content.innerHTML = "";
            if (boards.length == 0)
            {
                content.innerHTML = `
                <div class ='mt-5'>Không có thông tin về bảng quảng cáo</div>
                `
            }
            var idTemp = []
            for (var i = 0; i < boards.length; i++) {

                var billboard = boards[i];
                billboard.id = 'board-' + (i +1).toString();
                content.innerHTML += parseBillBoardContent(boardLocation, billboard);


                //idTemp board
                idTemp.push(billboard.id);

            }
            subWindow.classList.add('show-up');
            if (subWindow.classList.contains('narrow'))
                document.querySelector('#btn-collapse').click();
            console.log(idTemp)
            idTemp.forEach(idBB => {
                console.log(`#${idBB} button.circle-btn`)

                // detail infor button
                document.querySelector(`#${idBB} button.circle-btn`).addEventListener('click', () => {
                    document.querySelector(`#${idBB}`).classList.add('active');
                    var detailInfor = document.querySelector(`#${idBB} .detail-infor`);
                    console.log(`#${idBB} .detail-infor`);
                    detailInfor.classList.add('show-up');
                    document.querySelector(`#${idBB} .btn-close`).onclick = () =>{
                        document.querySelector(`#${idBB} .detail-infor`).classList.remove('show-up');
                    }
                });
            
            }); 



        });

    })
}

function setMarkerReport(report, marker)
{
    marker.addListener('click', () => {
        $.get('url_api_report/' + report.id, (data, status) => {
            let content = data.data;
            
        })
    })
}

function setMarkerReport(report, marker)
{
    marker.addListener('click', () => {
        $.get('url_api_report/' + report.id, (data, status) => {
            let content = data.data;
            
        })
    })
}

var advertisementBoards = new Array();
var mc = null;

function getAllLocation(callback){
  var url = 'http://'+ apiUrl + '/api/v1/boards/';
  var xhr = new XMLHttpRequest();

  xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.DONE)
      {
          callback(JSON.parse(xhr.responseText));
      }
  }
  xhr.open('GET', url);
  xhr.send();
}

// This is a function to get advertisementBoards from database.
// Function to add markers and cluster them
function handleMarkersAddition(data, map, advertisementBoards) {
  addMarker(data, advertisementBoards);
  clusterMarker(map, advertisementBoards);
}

// Function to remove markers and cluster them
function handleMarkersRemoval(data, map, advertisementBoards) {
  removeMarker(data, advertisementBoards);
  clusterMarker(map, advertisementBoards);
}

// Main function to add event listeners
const getAdvertisementBoards = (map) => {
  // Event listener for the first switch
  getAllLocation((data) => {
    data = data.data;
    console.log(data);
    var report = JSON.parse(localStorage.getItem('report'))

    document.getElementById('btnAds').addEventListener('change', function () {
      if (this.checked) {
        console.log('First switch is ON');
        handleMarkersAddition(data, map, advertisementBoards);
      } else {
        console.log('First switch is OFF');
        handleMarkersRemoval(data, map, advertisementBoards);
      }
    });
  
    // Event listener for the second switch
    document
      .getElementById('flexSwitchCheckDefault')
      .addEventListener('change', function () {
        if (this.checked) {
          console.log('Second switch is ON');
          handleMarkersAddition(report, map, advertisementBoards);
        } else {
          console.log('Second switch is OFF');
          handleMarkersRemoval(report, map, advertisementBoards);
        }
      });
  })
};

const addMarker = (newMarkers, currentMarkers) => {
  console.log(newMarkers)
  for (let i = 0; i < newMarkers.length; i++) {
    currentMarkers.push(newMarkers[i]);
  }
  return currentMarkers;
};

// This is a function to remove advertisementBoards from map.
const removeMarker = (removeMarker, currentMarkers) => {
  // Remove if they are same position.
  for (let i = 0; i < removeMarker.length; i++) {
    for (let j = 0; j < currentMarkers.length; j++) {
      if (
        removeMarker[i].location.lat === currentMarkers[j].location.lat &&
        removeMarker[i].location.lng === currentMarkers[j].location.lng &&
        removeMarker[i].id === currentMarkers[j].id
      ) {
        currentMarkers.splice(j, 1);
        break;
      }
    }
  }

  return currentMarkers;
};

const clusterMarker = async (map, data) => {
  let infoWindow = new google.maps.InfoWindow({
    content: '',
    disableAutoPan: true,
    maxWidth: 250
  });

  const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary(
    'marker'
  );

  // filter the overlapping data
  const uniqueData = data.filter(
    (v, i, a) => a.findIndex((t) => t.location.lat === v.location.lat && t.location.lng === v.location.lng) === i
  );
  data = uniqueData;


  const markers = []
  
  data.forEach((markerInfo) => {
    const iconImage = document.createElement('img');
    iconImage.style.width = '35px'
    // console.log(markerInfo.id)
    // if (markerInfo.id.includes('BL'))
    // {
    //   iconImage.src = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';

    // }
    // else {
    //   iconImage.src = "../img/ad.256x256.png"
    // }


    if (markerInfo.id)
    {
      iconImage.src = "../img/icon/Report.png"
      console.log(markerInfo.id)
    }
  
    else{
      if (markerInfo.isPlan == false)
      {
        if (markerInfo.num_board == 0)
        {
          console.log(markerInfo.num_board)
          iconImage.src = '/static/img/icon/no_ad_no_plan.png'
        }
        else {
          iconImage.src = '/static/img/icon/ad_no_plan.png'
        }
      }
      else{
        if (markerInfo.num_board == 0)
        {
          iconImage.src = '/static/img/icon/no_ad_plan.png'
        }
        else {
          iconImage.src = '/static/img/icon/ad_plan.png'
        }
      }
    }
    const marker = new AdvancedMarkerElement({
      position: markerInfo.location,
      content: iconImage,
    });

    // markers can only be keyboard focusable when they have click listeners
    // open info window when marker is clicked
    // if (markerInfo.id.includes('BL'))
    //   setMarkerBillBoard(markerInfo, marker, infoWindow);
    // if (markerInfo.id.includes('RP'))

    if (markerInfo.id)
    {

    }
    else{
      setMarkerBillBoard(map, markerInfo, marker, infoWindow);
    }
    markers.push(marker)
  });

  if (mc) mc.clearMarkers();
  console.log(markers)
  mc = new markerClusterer.MarkerClusterer({
    map,
    markers,
  });
};

var data2 = [
  { lat: 10.778515490199908, lng: 106.69397771139802 },
  { lat: 10.778511065772506, lng: 106.6939101530919 },
  { lat: 10.778433638289044, lng: 106.6938943894886 },
  { lat: 10.778595129871675, lng: 106.69382007535302 },
  { lat: 10.778880505200917, lng: 106.69352056686552 },
  { lat: 10.778712629289927, lng: 106.69412769829682 },
  { lat: 10.779549144915222, lng: 106.69501626249468 },
  { lat: 10.779564299162885, lng: 106.69489285079953 },
  { lat: 10.779491558767873, lng: 106.69506562717413 },
  { lat: 10.777778877164792, lng: 106.6932435413031 },
  { lat: 10.777674895082527, lng: 106.6931603740245 },
  { lat: 10.777065856453092, lng: 106.69067291639186 },
];

function saveTestLocalStorage()
{
  var item = JSON.parse(localStorage.getItem('report')) || [];
  data2.forEach(location => {
    item.push({id: 'RP',location: location})
  })
  localStorage.setItem('report', JSON.stringify(item))
}
saveTestLocalStorage()
// -> test data

function setFilter(map) {
  const filter = document.getElementById('filter')
  console.log(filter)
  map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(filter);
};

async function initMap() {
  const { Map } = await google.maps.importLibrary('maps');
  const map = new Map(document.getElementById('content'), {
    mapId: '2b895ae082f50106',
    center: { lat: 10.762622, lng: 106.660172 },
    zoom: 13,
    mapTypeControl: false,
    gestureHandling: "greedy", // fix for smartphone -> cannot drag the map
  });

  search(map);
  const subWindow = document.getElementById('sub-window')
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(subWindow);
  btnCurrentPosition(map);
  popUpLocationInfo(map);
  getAdvertisementBoards(map);
  setFilter(map);

  map.addListener('click', () => {
    document.getElementById('sub-window').classList.remove('show-up');
  })
}

initMap();
