import search from './search.js';
// import popUpLocationInfo from './popUpLocationInfo.js';
import getAdvertisementBoards from './clusterMarker.js';
// import filter from './filter.js';


function loadAdvertisementBoards(map) {

}
async function initMap() {
  const { Map } = await google.maps.importLibrary('maps');
  const map = new Map(document.getElementById('map'), {
    mapId: '2b895ae082f50106',
    center: { lat: 10.762622, lng: 106.660172 },
    zoom: 13,
    mapTypeControl: false,
    gestureHandling: "greedy", // fix for smartphone -> cannot drag the map
  });

//   search(map);
//   popUpLocationInfo(map);
getAdvertisementBoards(map);
//   filter(map);

}

initMap();
