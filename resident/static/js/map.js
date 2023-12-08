import search from './search.js';

import btnCurrentPosition from './btnCurrentPosition.js';
import popUpLocationInfo from './popUpLocationInfo.js';
import clusterMarker from './clusterMarker.js';
import billboard from './billboard.js'

import filter from "./filter.js"
import report from "./report.js"

async function initMap() {
  const { Map } = await google.maps.importLibrary("maps");
  const map = new Map(document.getElementById('map'), {
    mapId: '2b895ae082f50106',
    center: { lat: 10.762622, lng: 106.660172 },
    zoom: 13,
    mapTypeControl: false,
    gestureHandling: "greedy", // fix for smartphone -> cannot drag the map
  });

  search(map);
  billboard(map);
  btnCurrentPosition(map);
  popUpLocationInfo(map);
  clusterMarker(map);
  report(map);
  filter(map);

  map.addListener('click', () => {
    document.getElementById('sub-window').classList.remove('show-up');
  })
}

// window.initMap = initMap;
initMap();