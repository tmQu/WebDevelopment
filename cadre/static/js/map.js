async function initMap() {
  const { Map } = await google.maps.importLibrary('maps');
  const map = new Map(document.getElementById('content'), {
    mapId: '2b895ae082f50106',
    center: { lat: 10.762622, lng: 106.660172 },
    zoom: 13,
    mapTypeControl: false,
    gestureHandling: "greedy", // fix for smartphone -> cannot drag the map
  });
}

initMap();
