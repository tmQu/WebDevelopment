// const clusterMarker = async (map) => {
//   // Request needed libraries.
//   // if (infoWindow === null) {
//     const infoWindow = new google.maps.InfoWindow({
//         content: '',
//         disableAutoPan: true,
//       });
//   // }
  

//   const { MarkerClusterer } = await google.maps.importLibrary(
//     'markerclusterer'
//   );
//   const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary(
//     'marker'
//   );

//   // Create an array of alphabetical characters used to label the markers.
//   const labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

//   // Add some markers to the map.
//   // const data = locations(fs);
//   const markers = data.map((position, i) => {
//     const label = labels[i % labels.length];
//     const pinGlyph = new google.maps.marker.PinElement({
//       glyph: label,
//       glyphColor: 'white',
//     });
//     const marker = new google.maps.marker.AdvancedMarkerElement({
//       position,
//       content: pinGlyph.element,
//     });

//     // markers can only be keyboard focusable when they have click listeners
//     // open info window when marker is clicked
//     marker.addListener('click', () => {
//       infoWindow.setContent(position.lat + ', ' + position.lng);
//       infoWindow.open(map, marker);
//     });
//     return marker;
//   });

//   // Add a marker clusterer to manage the markers.
//   new MarkerClusterer({ markers, map });
// };

// const readFilePro = (file, fs) => {
//   return new Promise((resolve, reject) => {
//     fs.readFile(file, (err, data) => {
//       if (err) reject('I could not find that file!');
//       resolve(data);
//     });
//   });
// };

// const locations = async (fs) => {
//   try {
//     const data = await readFilePro('../../data2.json', fs);
//     console.log(JSON.parse(data));
//   } catch (err) {
//     console.log(err);
//     throw err;
//   }
// };

// const data = [
//   { latitude: 10.778515490199908, longitude: 106.69397771139802 },
//   { latitude: 10.778511065772506, longitude: 106.6939101530919 },
//   { latitude: 10.778433638289044, longitude: 106.6938943894886 },
//   { latitude: 10.778595129871675, longitude: 106.69382007535302 },
//   { latitude: 10.778880505200917, longitude: 106.69352056686552 },
//   { latitude: 10.778712629289927, longitude: 106.69412769829682 },
//   { latitude: 10.779549144915222, longitude: 106.69501626249468 },
//   { latitude: 10.779564299162885, longitude: 106.69489285079953 },
//   { latitude: 10.779491558767873, longitude: 106.69506562717413 },
//   { latitude: 10.777778877164792, longitude: 106.6932435413031 },
//   { latitude: 10.777674895082527, longitude: 106.6931603740245 },
//   { latitude: 10.777065856453092, longitude: 106.69067291639186 },
//   { latitude: 10.777177266051183, longitude: 106.69074852300588 },
//   { latitude: 10.776887601009932, longitude: 106.69071828035976 },
//   { latitude: 10.777021292599613, longitude: 106.69050658183818 },
//   { latitude: 10.778573596176457, longitude: 106.69204895678268 },
//   { latitude: 10.77846218709557, longitude: 106.69190530421287 },
//   { latitude: 10.780653224781503, longitude: 106.69396936480206 },
//   { latitude: 10.780616088684198, longitude: 106.69382571223525 },
//   { latitude: 10.781434247028471, longitude: 106.69469492832508 },
//   { latitude: 10.782300475720291, longitude: 106.69385854722083 },
//   { latitude: 10.78227816943469, longitude: 106.69397208311648 },
//   { latitude: 10.78193470190304, longitude: 106.69436921479081 },
//   { latitude: 10.782020209423905, longitude: 106.6952320876108 },
//   { latitude: 10.78026906922618, longitude: 106.69611334404561 },
//   { latitude: 10.780218032423974, longitude: 106.69624322827161 },
//   { latitude: 10.78032010601703, longitude: 106.69613932088902 },
//   { latitude: 10.780464710210254, longitude: 106.69757670630577 },
//   { latitude: 10.780371142797478, longitude: 106.69745548103162 },
//   { latitude: 10.779435467057041, longitude: 106.69712644099445 },
//   { latitude: 10.78178315704443, longitude: 106.69924788332906 },
//   { latitude: 10.781723614409714, longitude: 106.6994383801898 },
//   { latitude: 10.779733532396364, longitude: 106.69118829921712 },
//   { latitude: 10.779894713507346, longitude: 106.69130549673986 },
//   { latitude: 10.77953781236701, longitude: 106.69100078317854 },
//   { latitude: 10.781356852471973, longitude: 106.69279390528669 },
//   { latitude: 10.78152954557973, longitude: 106.69305173983753 },
//   { latitude: 10.781299288080433, longitude: 106.69305173983656 },
//   { latitude: 10.780297665902395, longitude: 106.68936001785096 },
//   { latitude: 10.784718593848098, longitude: 106.68920766106976 },
//   { latitude: 10.784603466340641, longitude: 106.68934829809928 },
//   { latitude: 10.784465313272804, longitude: 106.68952409438322 },
//   { latitude: 10.78666802262083, longitude: 106.69344423415157 },
//   { latitude: 10.786783149339087, longitude: 106.69319811935225 },
//   { latitude: 10.785862134362262, longitude: 106.69236601693854 },
//   { latitude: 10.786069362977571, longitude: 106.69223709966184 },
//   { latitude: 10.778676879112297, longitude: 106.69593554440627 },
//   { latitude: 10.777746389653345, longitude: 106.69690207455068 },
//   { latitude: 10.778031233671598, longitude: 106.69657345429994 },
//   { latitude: 10.77939848120397, longitude: 106.70196669249293 },
//   { latitude: 10.778847785028518, longitude: 106.70181204766942 },
//   { latitude: 10.783291304732643, longitude: 106.7056395070286 },
//   { latitude: 10.78353816501533, longitude: 106.70533021738379 },
//   { latitude: 10.78382300355014, longitude: 106.70447967085681 },
//   { latitude: 10.788285438709934, longitude: 106.69970501195291 },
//   { latitude: 10.788779150873694, longitude: 106.70345514890516 },
//   { latitude: 10.788399372359251, longitude: 106.70316518986374 },
//   { latitude: 10.786256689020306, longitude: 106.70108125773373 },
//   { latitude: 10.785895896417784, longitude: 106.70082995989515 },
//   { latitude: 10.786066798232625, longitude: 106.70100393532141 },
//   { latitude: 10.781692025421236, longitude: 106.70432790715932 },
//   { latitude: 10.7814261742474, longitude: 106.70411527052784 },
//   { latitude: 10.788566095621306, longitude: 106.69574511949827 },
//   { latitude: 10.78630528073441, longitude: 106.68769062484745 },
//   { latitude: 10.786590116648057, longitude: 106.68753598002684 },
//   { latitude: 10.78634325887107, longitude: 106.68780660846585 },
//   { latitude: 10.784787414296062, longitude: 106.69567447632255 },
//   { latitude: 10.784977308137414, longitude: 106.69555849133525 },
//   { latitude: 10.774515285576996, longitude: 106.70095947376245 },
//   { latitude: 10.77444585979029, longitude: 106.70070034424049 },
//   { latitude: 10.77220108398538, longitude: 106.69886288036543 },
//   { latitude: 10.775348393796776, longitude: 106.70206666353442 },
//   { latitude: 10.771506820039804, longitude: 106.69339760319639 },
//   { latitude: 10.77437643398531, longitude: 106.68821501277364 },
//   { latitude: 10.77375160101893, longitude: 106.68948710314595 },
//   { latitude: 10.774075588644266, longitude: 106.6898640188121 },
//   { latitude: 10.775926939815264, longitude: 106.68272617837147 },
//   { latitude: 10.78124951100402, longitude: 106.68849769951896 },
//   { latitude: 10.779999872309702, longitude: 106.68432806995503 },
//   { latitude: 10.783146991452142, longitude: 106.69819190140646 },
//   { latitude: 10.78455644850365, longitude: 106.70778908913371 },
//   { latitude: 10.784805507626814, longitude: 106.70787782885742 },
// ];

// export default clusterMarker;
