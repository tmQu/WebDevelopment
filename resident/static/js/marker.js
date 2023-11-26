var tempContent = {
  advertiseMethod: 'Cổ động chính trị',
  position: 'Đất hành lang/Công viên/Hành lang an toàn/giao thông',
  addr: 'Đồng khởi Nguyễn Du (Sở văn hóa nhà thể dục thể thao thi đấu) quận 5 thủ đô Hà Nội',
  isPlanning: true,
};

function parseContentMarker(content) {
  return (
    `<div class="marker-content">\n` +
    `<h3 class="advt-method">${content.advertiseMethod}</h3>\n` +
    `<div class="position">${content.position}</div>\n` +
    `<div class="addr">${content.addr}</div>\n` +
    `<h3 class="planning">${
      content.isPlanning == true ? 'Đã quy hoạch' : 'Chưa quy hoạch'
    }</h3>\n` +
    `</div>`
  );
}

function setMarker(map) {
  //database
  var HCMUS = {
    lat: 10.76258349943608,
    lng: 106.68254077866838,
  };

  const infowindow = new google.maps.InfoWindow({
    maxWidth: 250,
  });

  const iconMarker = {
    url: '../img/ad.256x256.png',

    scaledSize: new google.maps.Size(25, 25),
  };
  const markers = [
    new google.maps.Marker({
      position: HCMUS,
      map,
      icon: iconMarker,
      title: 'Bảng quảng cáo',
    }),
  ];

  map.setCenter(HCMUS);
  map.setZoom(15);

  console.log(map.zoom);
  markers.forEach((marker) => {
    marker.addListener('click', () => {
      infowindow.setContent(parseContentMarker(tempContent));
      infowindow.open({
        anchor: marker,
        map,
      });
    });
  });
}

export { setMarker, parseContentMarker };
