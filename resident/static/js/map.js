import search from './search.js';

import btnCurrentPosition from './btnCurrentPosition.js';
import popUpLocationInfo from './popUpLocationInfo.js';
import getAdvertisementBoards from './clusterMarker.js';
import filter from './filter.js';

async function initMap() {
  const { Map } = await google.maps.importLibrary('maps');
  const map = new Map(document.getElementById('map'), {
    mapId: '2b895ae082f50106',
    center: { lat: 10.762622, lng: 106.660172 },
    zoom: 13,
    mapTypeControl: false,
    gestureHandling: "greedy", // fix for smartphone -> cannot drag the map
  });
  const legend = document.getElementById("legend");
  map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(legend);
}


  search(map);
  const subWindow = document.getElementById('sub-window')
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(subWindow);
  btnCurrentPosition(map);
  popUpLocationInfo(map);
  getAdvertisementBoards(map);
  filter(map);

  map.addListener('click', () => {
    document.getElementById('sub-window').classList.remove('show-up');
  })
}

initMap();
