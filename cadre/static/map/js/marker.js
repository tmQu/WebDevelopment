function getDetailBoard(id, callback) {
  var boards = [];
  for (var i = 0; i < gBoards.length; i++) {
    if (gBoards[i].boardLocation == id) {
      boards.push(gBoards[i]);
    }
  }
  callback(boards);
}

function addCarousel(images) {
  var imgSlider = '';

  for (var i = 0; i < images.length; i++) {
    var img = images[i];
    imgSlider += `
       <div class="carousel-item ${i == 0 ? 'active' : ''}">
       <img crossorigin="anonymous" src="${img}" class="d-block w-100" style="max-height: 240px; object-fit: cover">
       </div>
       `;
  }

  document.querySelector('#carousel-location').innerHTML = imgSlider;
}
function parseContentMarker(content) {
  var locationCategory = [];
  content.locationCategory.forEach((category) => {
    locationCategory.push(category.locationCategory);
  });
  locationCategory = locationCategory.join(', ');

  var addr = `${content.addr.street_number} ${content.addr.route}, ${content.addr.ward.ward}, ${content.addr.district.district}, ${content.addr.city}`;

  //     return `<div class="card" style="background: linear-gradient(90deg, #c8e0f8, #e4f8f0); border: none">
  //     <div class="card-body pb-0">
  //       <div class="d-flex justify-content-between">
  //         <p class="mb-0 h5" style="font-weight: bold;">${title} <a class="btn" href=""><i class="bi bi-exclamation-octagon"></i></a></p>

  //       </div>
  //     </div>
  //     <hr>
  //     <div class="card-body pt-0">
  //       <h6 class="font-weight-bold mb-1">${address}</h6>

  //     </div>
  //   </div>
  // </div>`

  return `<div class="marker-content" style="background: linear-gradient(90deg, #c8e0f8, #e4f8f0); border: none; padding: 10px; color:black">\n
    <h5 class="advt-form mb-0" style="font-weight: bold;">${content.advertisementForm.advertisementForm}</h5>\n
    <div class="location-category">${locationCategory}</div>\n
    <div class="addr">${addr}</div>\n
    <h6 class="planning" style="font-weight: bold;">${content.isPlan == true ? 'Đã quy hoạch' : 'Chưa quy hoạch'}</h6>\n
    </div>`;
}

function parseBillBoardContent(boardLocation, board) {
  var addr = `${boardLocation.addr.street_number} ${boardLocation.addr.route}, ${boardLocation.addr.ward.ward}, ${boardLocation.addr.district.district}, ${boardLocation.addr.city}`;
  var size = `${board.size}`;
  var locationCategory = '';

  var locationCategory = [];
  boardLocation.locationCategory.forEach((category) => {
    locationCategory.push(category.locationCategory);
  });
  locationCategory = locationCategory.join(', ');

  // Thêm offset 7 giờ để chuyển múi giờ hiện tại thành múi giờ Việt Nam
  const vietnamTime = new Date(new Date(board.expireDate).getTime() + 7 * 60 * 60 * 1000);

  const year = vietnamTime.getFullYear();
  const month = vietnamTime.getMonth() + 1; // Tháng bắt đầu từ 0, cần cộng thêm 1
  const day = vietnamTime.getDate();

  const dateString = `${day < 10 ? '0' + day : day}/${month < 10 ? '0' + month : month}/${year}`;

  return `
    <div class="billboard" id = "${board.id}" style="background: linear-gradient(90deg, #c8e0f8, #e4f8f0);color:black;">
    <div class="billboard-type" style="font-weight: bold; font-size:15pt">
        ${board.boardType.boardType}
    </div>
    <div class="billboard-addr">
        <img src="/static/map/img/icon/icons8-maps.svg" alt="" style="height: 1em;">
       ${addr}
    </div>
    <div class="billboard-size"><strong>Kích thước</strong> ${size}</div>
    <div class="billboard-quantity"><strong>Số lượng</strong> ${board.quantity}</div>
    <div class="billboard-form"><strong>Hình thức</strong> ${boardLocation.advertisementForm.advertisementForm}</div>
    <div class="billboard-category"><strong>Phân loại</strong> ${locationCategory}</div> 
    <div class="d-flex justify-content-between mt-4 mb-1">
    <button class="circle-btn"><i class="bi bi-info-lg"></i></button>
    </div>
    <div class="detail-infor">
        <button type="button" class="btn-close" aria-label="Close"></button>
        <img crossorigin="anonymous" src="${board.imgBillboard}" class="d-block w-100" style="max-height: 240px; object-fit: cover">
        <div class="mt-3"><strong>Ngày hết hạn hộp đồng</strong>: ${dateString}</div>
    </div>
    </div>
    `;
}

function setMarkerBillBoard(map, location, marker, infowindow) {
  marker.addListener('click', () => {
    map.panTo(marker.position);

    infowindow.setContent(parseContentMarker(location));
    infowindow.open({
      anchor: marker,
      map,
    });
  });

  marker.addListener('click', (event) => {
    getDetailBoard(location._id, (detailInfor) => {
      var boardLocation = location;
      var boards = detailInfor;

      var subWindow = document.getElementById('sub-window');
      var content = document.querySelector('#sub-window .overflow-content');

      addCarousel(boardLocation.imgBillboardLocation);
      content.innerHTML = '';
      if (boards.length == 0) {
        content.innerHTML = `
                <div class ='mt-5'>Không có thông tin về bảng quảng cáo</div>
                `;
      }
      var idTemp = [];
      for (var i = 0; i < boards.length; i++) {
        var billboard = boards[i];
        billboard.id = 'board-' + (i + 1).toString();
        content.innerHTML += parseBillBoardContent(boardLocation, billboard);

        //idTemp board
        idTemp.push(billboard.id);
      }
      subWindow.classList.add('show-up');
      content.classList.remove('report-content');
      document.querySelector('#img-billboard').style.display = 'block';
      document.querySelector('.of-scroll').classList.remove('report-content');

      if (subWindow.classList.contains('narrow')) document.querySelector('#btn-collapse').click();
      console.log(idTemp);
      idTemp.forEach((idBB) => {
        console.log(`#${idBB} button.circle-btn`);

        // detail infor button
        document.querySelector(`#${idBB} button.circle-btn`).addEventListener('click', () => {
          document.querySelector(`#${idBB}`).classList.add('active');
          var detailInfor = document.querySelector(`#${idBB} .detail-infor`);
          console.log(`#${idBB} .detail-infor`);
          detailInfor.classList.add('show-up');
          document.querySelector(`#${idBB} .btn-close`).onclick = () => {
            document.querySelector(`#${idBB} .detail-infor`).classList.remove('show-up');
          };
        });
      });
    });
  });
}

function parseReportDetail(rp, rpId) {
  console.log(rp);
  var createAt = rp.createdAt;
  // Thêm offset 7 giờ để chuyển múi giờ hiện tại thành múi giờ Việt Nam
  const vietnamTime = new Date(new Date(createAt).getTime() + 7 * 60 * 60 * 1000);

  const year = vietnamTime.getFullYear();
  const month = vietnamTime.getMonth() + 1; // Tháng bắt đầu từ 0, cần cộng thêm 1
  const day = vietnamTime.getDate();

  var dateString = `${day < 10 ? '0' + day : day}/${month < 10 ? '0' + month : month}/${year}`;

  dateString += ` ${vietnamTime.getHours()}:${vietnamTime.getMinutes()}:${vietnamTime.getSeconds()}`;

  var rpType = rp.board ? 'Bảng quảng cáo' : 'Địa điểm';
  var report = `
    <div class="billboard" id = "${rpId}" style="background: linear-gradient(90deg, #c8e0f8, #e4f8f0);">
    <div class = 'd-flex flex-row-reverse'>
        <h3>
        <span class="badge bg-secondary">${rpType}</span>
        </h3>
    </div>
    <div class="billboard-type" style="font-weight: bold; font-size:15pt">
        ${rp.method}
    </div>
    <div class="billboard-addr">
        <img src="/static/map/img/icon/icons8-maps.svg" alt="" style="height: 1em;">
       ${rp.addr}
    </div>

    <div>
    <i class="bi bi-calendar-event"></i> <strong>Ngày gửi</strong>
    ${dateString}
    </div>

    <div class='mt-4'>
    <div class='mt-3'><strong>Người báo cáo</strong> ${rp.sender.fullname}</div> 
    <div class='mt-3'><strong>Email</strong> ${rp.sender.email}</div>
    <div class='mt-3'><strong>Điện thoại</strong> ${rp.sender.phone}</div> 
    </div>



    <div class="d-flex justify-content-between mt-4 mb-1">
    <a class="btn btn-outline-danger" href="https://ads-management-n1j3.onrender.com/reports/${rp._id}"><i class="bi bi-exclamation-octagon"></i> xem chi tiết báo cáo vi phạm</a></div>
    </div>
    `;

  return report;
}

function setMarkerReport(reportLocation, marker) {
  marker.addListener('click', () => {
    document.querySelector('.of-scroll').classList.add('report-content');
    document.querySelector('#sub-window .overflow-content').classList.add('report-content');
    document.querySelector('#img-billboard').style.display = 'none';
    var content = document.querySelector('#sub-window .overflow-content');
    content.innerHTML = '';
    var i = 1;
    reportLocation.report.forEach((rp) => {
      content.innerHTML += parseReportDetail(rp, 'report-' + i.toString());
      i++;
    });

    var subWindow = document.querySelector('#sub-window');
    subWindow.classList.add('show-up');
    if (subWindow.classList.contains('narrow')) document.querySelector('#btn-collapse').click();
  });
}

const setMarker = {
  setMarkerBillBoard: setMarkerBillBoard,
  setMarkerReport: setMarkerReport,
};
export default setMarker;
