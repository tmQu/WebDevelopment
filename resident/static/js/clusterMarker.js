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
    data = data.data
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
          handleMarkersAddition(data2, map, advertisementBoards);
        } else {
          console.log('Second switch is OFF');
          handleMarkersRemoval(data2, map, advertisementBoards);
        }
      });
  
  })

  
};

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
        removeMarker[i].lat === currentMarkers[j].lat &&
        removeMarker[i].lng === currentMarkers[j].lng
      ) {
        currentMarkers.splice(j, 1);
        console.log('Remove marker', currentMarkers[j]);
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
  });

  const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary(
    'marker'
  );

  // filter the overlapping data
  const uniqueData = data.filter(
    (v, i, a) => a.findIndex((t) => t.lat === v.lat && t.lng === v.lng) === i
  );
  data = uniqueData;
  // Add some markers to the map.

  // A marker with a with a URL pointing to a PNG.

  const markers = data.map((position, i) => {
    const beachFlagImg = document.createElement('img');
    beachFlagImg.src =
      'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';

    const marker = new AdvancedMarkerElement({
      position,
      content: beachFlagImg,
    });

    // markers can only be keyboard focusable when they have click listeners
    // open info window when marker is clicked
    marker.addListener('click', () => {
      infoWindow.setContent(position.lat + ', ' + position.lng);
      infoWindow.open(map, marker);
    });
    return marker;
  });

  if (mc) mc.clearMarkers();

  mc = new markerClusterer.MarkerClusterer({
    map,
    markers,
  });
};

// var data = [
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
//   { lat: 10.777177266051183, lng: 106.69074852300588 },
//   { lat: 10.776887601009932, lng: 106.69071828035976 },
//   { lat: 10.777021292599613, lng: 106.69050658183818 },
//   { lat: 10.778573596176457, lng: 106.69204895678268 },
//   { lat: 10.77846218709557, lng: 106.69190530421287 },
//   { lat: 10.780653224781503, lng: 106.69396936480206 },
//   { lat: 10.780616088684198, lng: 106.69382571223525 },
//   { lat: 10.781434247028471, lng: 106.69469492832508 },
//   { lat: 10.782300475720291, lng: 106.69385854722083 },
//   { lat: 10.78227816943469, lng: 106.69397208311648 },
//   { lat: 10.78193470190304, lng: 106.69436921479081 },
//   { lat: 10.782020209423905, lng: 106.6952320876108 },
//   { lat: 10.78026906922618, lng: 106.69611334404561 },
//   { lat: 10.780218032423974, lng: 106.69624322827161 },
//   { lat: 10.78032010601703, lng: 106.69613932088902 },
//   { lat: 10.780464710210254, lng: 106.69757670630577 },
//   { lat: 10.780371142797478, lng: 106.69745548103162 },
//   { lat: 10.779435467057041, lng: 106.69712644099445 },
//   { lat: 10.78178315704443, lng: 106.69924788332906 },
//   { lat: 10.781723614409714, lng: 106.6994383801898 },
//   { lat: 10.779733532396364, lng: 106.69118829921712 },
//   { lat: 10.779894713507346, lng: 106.69130549673986 },
//   { lat: 10.77953781236701, lng: 106.69100078317854 },
//   { lat: 10.781356852471973, lng: 106.69279390528669 },
//   { lat: 10.78152954557973, lng: 106.69305173983753 },
//   { lat: 10.781299288080433, lng: 106.69305173983656 },
//   { lat: 10.780297665902395, lng: 106.68936001785096 },
  // { lat: 10.784718593848098, lng: 106.68920766106976 },
  // { lat: 10.784603466340641, lng: 106.68934829809928 },
  // { lat: 10.784465313272804, lng: 106.68952409438322 },
  // { lat: 10.78666802262083, lng: 106.69344423415157 },
  // { lat: 10.786783149339087, lng: 106.69319811935225 },
  // { lat: 10.785862134362262, lng: 106.69236601693854 },
  // { lat: 10.786069362977571, lng: 106.69223709966184 },
  // { lat: 10.778676879112297, lng: 106.69593554440627 },
  // { lat: 10.777746389653345, lng: 106.69690207455068 },
  // { lat: 10.778031233671598, lng: 106.69657345429994 },
  // { lat: 10.77939848120397, lng: 106.70196669249293 },
  // { lat: 10.778847785028518, lng: 106.70181204766942 },
  // { lat: 10.783291304732643, lng: 106.7056395070286 },
  // { lat: 10.78353816501533, lng: 106.70533021738379 },
  // { lat: 10.78382300355014, lng: 106.70447967085681 },
  // { lat: 10.788285438709934, lng: 106.69970501195291 },
  // { lat: 10.788779150873694, lng: 106.70345514890516 },
  // { lat: 10.788399372359251, lng: 106.70316518986374 },
  // { lat: 10.786256689020306, lng: 106.70108125773373 },
  // { lat: 10.785895896417784, lng: 106.70082995989515 },
  // { lat: 10.786066798232625, lng: 106.70100393532141 },
  // { lat: 10.781692025421236, lng: 106.70432790715932 },
  // { lat: 10.7814261742474, lng: 106.70411527052784 },
  // { lat: 10.788566095621306, lng: 106.69574511949827 },
  // { lat: 10.78630528073441, lng: 106.68769062484745 },
  // { lat: 10.786590116648057, lng: 106.68753598002684 },
  // { lat: 10.78634325887107, lng: 106.68780660846585 },
  // { lat: 10.784787414296062, lng: 106.69567447632255 },
  // { lat: 10.784977308137414, lng: 106.69555849133525 },
  // { lat: 10.774515285576996, lng: 106.70095947376245 },
  // { lat: 10.77444585979029, lng: 106.70070034424049 },
  // { lat: 10.77220108398538, lng: 106.69886288036543 },
  // { lat: 10.775348393796776, lng: 106.70206666353442 },
  // { lat: 10.771506820039804, lng: 106.69339760319639 },
  // { lat: 10.77437643398531, lng: 106.68821501277364 },
  // { lat: 10.77375160101893, lng: 106.68948710314595 },
  // { lat: 10.774075588644266, lng: 106.6898640188121 },
  // { lat: 10.775926939815264, lng: 106.68272617837147 },
  // { lat: 10.78124951100402, lng: 106.68849769951896 },
  // { lat: 10.779999872309702, lng: 106.68432806995503 },
  // { lat: 10.783146991452142, lng: 106.69819190140646 },
  // { lat: 10.78455644850365, lng: 106.70778908913371 },
  // { lat: 10.784805507626814, lng: 106.70787782885742 },
//];

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
export default getAdvertisementBoards;
