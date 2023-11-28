import search from './search.js';

import billboard from './billboard.js';
import btnCurrentPosition from './btnCurrentPosition.js';
import popUpLocationInfo from './popUpLocationInfo.js';
import clusterMarker from './clusterMarker.js';
import billboard from './billboard.js'
import btnCurrentPosition from "./btnCurrentPosition.js";
import popUpLocationInfo from "./popUpLocationInfo.js";
import filter from "./filter.js"
import report from "./report.js"

function initMap() {
  const map = new google.maps.Map(document.getElementById('map'), {
    mapId: '2b895ae082f50106',
    center: { lat: 10.762622, lng: 106.660172 },
    zoom: 13,
    mapTypeControl: false,
  });
<<<<<<< Updated upstream
  search(map);
  billboard(map);
  btnCurrentPosition(map);
  popUpLocationInfo(map);
  clusterMarker(map);

  report(map);
  search(map);
  billboard(map);
  btnCurrentPosition(map);
  popUpLocationInfo(map);
  filter(map);

=======
    report(map);
    search(map);
    billboard(map);
    btnCurrentPosition(map);
    popUpLocationInfo(map);
    filter(map);
>>>>>>> Stashed changes
}

window.initMap = initMap;
