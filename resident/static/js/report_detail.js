const serverURL = 'https://ads-management-n1j3.onrender.com';

function getReportDetail(callback) {
  const urlParams = new URLSearchParams(window.location.search);
  var rpId = urlParams.get('id');
  var url = serverURL + '/api/v2/reports/' + rpId;

  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = () => {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      var report = JSON.parse(xhr.responseText);
      callback(report);
    }
  };
  xhr.open('GET', url);
  xhr.send();
}

function renderReportDetail(data) {
  var report = data.data.report;
  var board = data.data.board;
  var boardLocation = data.data.boardLocation;
  document.querySelector('#report-method').innerHTML = report.method.reportMethod;
  var img_rp = document.querySelector('#report-img');
  if (report.images) {
    console.log(report.images);
    img_rp.innerHTML = `<div id="reportImageCarousel" class="carousel slide" data-ride="carousel">
                     <div class="carousel-inner">`;
    report.images.forEach((img, index) => {
      img_rp.innerHTML += `<div class="carousel-item ${index == 0 ? 'active' : ''}">
                        <img src="${img}" class="d-block carousel-img img-fluid" alt="Image ${index}">
                        </div>`;
    });
    img_rp.innerHTML += `</div>
                        <a class="carousel-control-prev" href="#reportImageCarousel" role="button" data-slide="prev">
                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span class="sr-only">Previous</span>
                        </a>
                        <a class="carousel-control-next" href="#reportImageCarousel" role="button" data-slide="next">
                        <span class="carousel-control-next-icon" aria-hidden="true"></span>
                        <span class="sr-only">Next</span>
                        </a>
                    </div>`;
  } else {
    img_rp.innerHTML = `<img src='http://localhost:4000/static/img/adboard.png' class='img-fluid' alt='user'/>`;
  }

  if (report.board) {
    var report_infor = (document.querySelector('#report-infor').innerHTML = `
                    <div class='col-lg-7 col-md-7 col-sm-6'>
                      <h4 class='box-title mt-5'>
                        ${board.boardType.boardType}
                      </h4>
                      <p>
                        ${report.addr}
                      </p>
                      <p>
                        Kích thước: <strong>${board.size}</strong>
                      </p>
                      <p>Hình thức: <strong>${boardLocation.advertisementForm.advertisementForm}</strong></p>
                      <p>Phân loại:`);
    boardLocation.locationCategory.forEach((boardLocation) => {
      report_infor += `<span class='badge badge-pill badge-primary'>${boardLocation.locationCategory}</span>`;
    });
    report_infor += `</p>
                        </div>`;
  } else {
    var report_infor = (document.querySelector('#report-infor').innerHTML = `
                    <div class='col-lg-7 col-md-7 col-sm-6'>
                      <h4 class='box-title mt-5'>
                        Địa chỉ điểm báo cáo: <strong>${report.addr}</strong>
                      </h4>
                    </div>`);
  }

  document.querySelector('#name').innerHTML = report.sender.fullname;
  document.querySelector('#email').innerHTML = report.sender.email;
  document.querySelector('#phone').innerHTML = report.sender.phone;

  document.querySelector('#create-at').innerHTML = report.createdAt;
  var status;
  if (report.status === true) {
    status = `<span class='badge badge-pill badge-success'>Đã xử lý</span>`;
  } else if (report.status === false) {
    status = `<span class='badge badge-pill badge-warning'>Đang chờ xử lý</span>`;
  } else if (report.status === null) {
    status = `<span class='badge badge-pill badge-danger'>Đã xóa</span>`;
  }
  document.querySelector('#report-status').innerHTML = status;

  document.querySelector('#report-description').innerHTML = report.description;
}

getReportDetail(renderReportDetail);
