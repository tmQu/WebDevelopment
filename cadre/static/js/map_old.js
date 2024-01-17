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
    const closeBtn = document.getElementById('close-button');

    closeBtn.addEventListener('click', closeInfoWindow);

    map.addListener('click', function (event) {
        var clickedLat = event.latLng.lat();
        var clickedLng = event.latLng.lng();

        displayLocationInfo(clickedLat, clickedLng, map);
    });

    map.addListener('bounds_changed', function () {
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
                results[0].formatted_address = results[0].formatted_address.replace(/,/g, ',<br/>');
                
                var title = results[0].address_components[1].long_name;
                var address = results[0].formatted_address;
                var types = results[0].types;

                var contentString = '<div id="info-content">' +
                    '<h3>' + title + '</h3>' +
                    '<p>' + address + '</p>' +
                    '<p>' + types + '</p>' +
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

const apiUrl = 'localhost:4000'

function getBoardLocationInfor(id, callback) {

    for (var i = 0; i < gBoardLocation; i++)
    {
        if (globalBoardLocation[i]._id == id)
        {
            callback(globalBoardLocation[i]);
        }
    }

}

function getDetailBoard(id, callback)
{
    var boards = [];
    for(var i = 0; i < gBoards.length; i++)
    {
        if (gBoards[i].boardLocation == id)
        {
            boards.push(gBoards[i]);
        }
    }
    callback(boards);

}

function addCarousel(images)
{
    var imgSlider = '';
    console.log(images)
    for (var i = 0; i < images.length; i++) {
        var img = images[i];
       imgSlider += `
       <div class="carousel-item ${i == 0 ? 'active': ''}">
       <img crossorigin="anonymous" src="${img}" class="d-block w-100" style="max-height: 240px; object-fit: cover">
       </div>
       `
       console.log(imgSlider)
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

    return `<div class="marker-content">\n
    <h3 class="advt-form">${content.advertisementForm.advertisementForm}</h3>\n
    <div class="location-category">${locationCategory}</div>\n
    <div class="addr">${addr}</div>\n
    <h3 class="planning">${content.isPlan == true ? 'Đã quy hoạch' : 'Chưa quy hoạch'}</h3>\n
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
    console.log(boardLocation);

    // Thêm offset 7 giờ để chuyển múi giờ hiện tại thành múi giờ Việt Nam
    const vietnamTime = new Date(new Date(board.expireDate).getTime() + 7 * 60 * 60 * 1000);

    const year = vietnamTime.getFullYear();
    const month = vietnamTime.getMonth() + 1; // Tháng bắt đầu từ 0, cần cộng thêm 1
    const day = vietnamTime.getDate();

    const dateString = `${day < 10 ? '0' + day : day}/${month < 10 ? '0' + month : month}/${year}`;

    return `<div class="billboard" id = "${board.id}">
    <h3 class="billboard-type">
        ${board.boardType.boardType}
    </h3>
    <div class="billboard-addr">
        <img src="static/static/img/icon/icons8-maps.svg" alt="" style="height: 1em;">
       ${addr}
    </div>
    <div class="billboard-size"><strong>Kích thước</strong> ${size}</div>
    <div class="billboard-size"><strong>Số lượng</strong> ${board.quantity}</div>

    <div class="billboard-form"><strong>Hình thức</strong> ${boardLocation.advertisementForm.advertisementForm}</div>
    <div class="billboard-category"><strong>Phân loại</strong> ${locationCategory}</div> 
    <div class="d-flex justify-content-between mt-4 mb-1"><button class="btn btn-outline-primary circle-btn"><i class="bi bi-info-lg"></i></button>

    <div class="detail-infor">
        <button type="button" class="btn-close" aria-label="Close"></button>
        <img crossorigin="anonymous" src="${board.imgBillboard}" class="d-block w-100" style="max-height: 240px; object-fit: cover">
        <div class="mt-3"><strong>Ngày hết hạn hộp đồng</strong>: ${dateString}</div>
    </div>
    </div>
    `

}

function setMarkerBillBoard(location, marker,infowindow)
{
        
    marker.addListener('click', () => {

        infowindow.setContent(parseContentMarker(location));
        infowindow.open({
                anchor: marker,
                map
            })


    })


    marker.addListener('click', (event) => {
        getDetailBoard(location._id, (data) => {

            var boardLocation = location
            var boards = data


            var subWindow = document.getElementById('sub-window');
            var content = document.querySelector('#sub-window .overflow-content')

            addCarousel(boardLocation.imgBillboardLocation);
            content.innerHTML = "";
            var idTemp = []
            for (var i = 0; i < boards.length; i++) {

                var billboard = boards[i];
                billboard.id = 'board-' + (i +1).toString();
                content.innerHTML += parseBillBoardContent(boardLocation, billboard);
                subWindow.classList.add('show-up');

                //idTemp board
                idTemp.push(billboard.id);

            }

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

var advertisementBoards = new Array();
var mc = null;

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
// const getAdvertisementBoards = (map) => {

//   var data = gBoardLocation;
//   var report = gReport;
//   console.log(data);
//   console.log(report);

//   document.getElementById('btnAds').addEventListener('change', function () {
//     if (this.checked) {
//       console.log('First switch is ON');
//       handleMarkersAddition(data, map, advertisementBoards);
//     } else {
//       console.log('First switch is OFF');
//       handleMarkersRemoval(data, map, advertisementBoards);
//     }
//   });

//   // Event listener for the second switch
//   document
//     .getElementById('flexSwitchCheckDefault')
//     .addEventListener('change', function () {
//       if (this.checked) {
//         console.log('Second switch is ON');
//         handleMarkersAddition(report, map, advertisementBoards);
//       } else {
//         console.log('Second switch is OFF');
//         handleMarkersRemoval(report, map, advertisementBoards);
//       }
//     });

// };

const addMarker = (newMarkers, currentMarkers) => {
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
    iconImage.style.width = '50px'


    if (markerInfo.board)
    {
      iconImage.src = "/static/map/img/icon/Repot.png"
    }
    else{
      if (markerInfo.isPlan == false)
      {
        iconImage.src = "/static/map/img/icon/ad_not_plan.png"
      }
      else{
        iconImage.src = "/static/map/img/icon/ad_planned.png"
      }
    }
    const marker = new AdvancedMarkerElement({
      position: markerInfo.location,
      content: iconImage,
    });

    // markers can only be keyboard focusable when they have click listeners
    // open info window when marker is clicked
    // if (markerInfo.id.includes('BL'))
    //   setMarkerBillboard(markerInfo, marker, infoWindow);
    // if (markerInfo.id.includes('RP'))

    // report
    if (markerInfo.board)
    {

    }
    else{
      setMarkerBillboard(markerInfo, marker, infoWindow);
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
  //getAdvertisementBoards(map);
  setFilter(map);

  map.addListener('click', () => {
    document.getElementById('sub-window').classList.remove('show-up');
  })
}

initMap();
