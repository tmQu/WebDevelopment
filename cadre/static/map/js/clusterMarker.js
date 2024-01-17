import setMarker from "./marker.js";

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
const getAdvertisementBoards = (map) => {
  // Event listener for the first switch
  var data = gBoardLocation;
  var report = gReport;



  // group report that have the same location
  var reportLocation =  report.reduce((result, item) => {
    const { lat, lng } = item.location;
    const key = `${lat}-${lng}`;

    // Create a new group for the location if it doesn't exist
    if (!result[key]) {
        result[key] = { location: { lat, lng }, data: [] };
    }

    // Push the current item to the location group
    result[key].data.push({
        _id: item._id,
        addr: item.addr,
        createdAt: item.createdAt,
        method: item.method,
        board: item.board,
        sender: item.sender
    });

    return result;
  }, {});

  // Convert the groupedData object to an array of groups with lat and lng
  reportLocation = Object.values(reportLocation).map(group => ({
      location: group.location,
      report: group.data,
  }));
    

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
        handleMarkersAddition(reportLocation, map, advertisementBoards);
      } else {
        console.log('Second switch is OFF');
        handleMarkersRemoval(reportLocation, map, advertisementBoards);
      }
    });

  // turn on board
  document.querySelector('#btnAds').click();

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
        removeMarker[i]._id === currentMarkers[j]._id
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

  // filter the overlapping data, the report have higher priority than board

  // get report first
  var uniqueData = [];
  for (var i = 0; i < data.length; i++) {
    if(data[i].report)
    {
      uniqueData.push(data[i]);
    }
  }

  // get board if there is no report on it
  for (var i = 0; i < data.length; i++) {
    if(data[i].report)
    {
      continue;
    }
    else {

      var flag = false;
      for (var j = 0; j < uniqueData.length; j++) {
        if (uniqueData[j].location.lat == data[i].location.lat && uniqueData[j].location.lng == data[i].location.lng)
        {
          flag = true;
          break;
        }
      }
      if (flag == false)
      {
        uniqueData.push(data[i]);
      }
    }
  }
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


    if (markerInfo.report)
    {
      iconImage.src = "/static/map/img/icon/Report.png"
      
    }
    else{
      if (markerInfo.isPlan == false)
      {
        if (markerInfo.num_board == 0)
        {
          console.log(markerInfo.num_board)
          iconImage.src = '/static/map/img/icon/no_ad_no_plan.png'
        }
        else {
          iconImage.src = '/static/map/img/icon/ad_no_plan.png'
        }
      }
      else{
        if (markerInfo.num_board == 0)
        {
          iconImage.src = '/static/map/img/icon/no_ad_plan.png'
        }
        else {
          iconImage.src = '/static/map/img/icon/ad_plan.png'
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
    console.log(markerInfo);
    if (markerInfo.report)
    {

      setMarker.setMarkerReport(markerInfo, marker);
    }
    else{
      setMarker.setMarkerBillBoard(map, markerInfo, marker, infoWindow);
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



// var data2 = [
//   { lat: 10.778515490199908, lng: 106.69397771139802 },
//   { lat: 10.778511065772506, lng: 106.6939101530919 },
//   { lat: 10.778433638289044, lng: 106.6938943894886 },
//   { lat: 10.778595129871675, lng: 106.69382007535302 },
//   { lat: 10.778880505200917, lng: 106.69352056686552 },
//   { lat: 10.778712629289927, lng: 106.69412769829682 },
//   { lat: 10.779549144915222, lng: 106.69501626249468 },
//   { lat: 10.779564299162885, lng: 106.69489285079953 },
//   { lat: 10.779491558767873, lng: 106.69506562717413 },
//   { lat: 10.777778877164792, lng: 106.6932435413031 },
//   { lat: 10.777674895082527, lng: 106.6931603740245 },
//   { lat: 10.777065856453092, lng: 106.69067291639186 },
// ];

// function saveTestLocalStorage()
// {
//   var item = JSON.parse(localStorage.getItem('report')) || [];
//   data2.forEach(location => {
//     item.push({id: 'RP',location: location})
//   })
//   localStorage.setItem('report', JSON.stringify(item))
// }
// saveTestLocalStorage()
// -> test data

export default getAdvertisementBoards;
