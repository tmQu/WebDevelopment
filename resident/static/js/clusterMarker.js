import setMarker from "./marker.js";

var advertisementBoards = new Array();
var mc = null;

const apiUrl = 'localhost:4000'

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
    //   setMarker(markerInfo, marker, infoWindow);
    // if (markerInfo.id.includes('RP'))

    if (markerInfo.id)
    {

    }
    else{
      setMarker(map, markerInfo, marker, infoWindow);
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

export default getAdvertisementBoards;
