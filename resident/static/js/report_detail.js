const apiUrl = 'http://localhost:4000'


function getReportDetail(callback) {
    var rpId = url.getParam('id');
    var url = apiUrl + '/api/v1/reports/' + rpId;

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
        if(xhr.readyState === XMLHttpRequest.DONE)
        {
            var report = JSON.parse(xhr.responseText);
            callback(report);
        }
    }
    xhr.open('GET', url);
    xhr.send();

}



function renderReportDetail(report)
{
    var reportDetail = document.querySelector('#report-detail');
    var html = `
    <div class="card">
        <div class="card-body">
            <div class="row">
                <div class="col-3">
                    <p class="font-weight-bold">Người báo cáo</p>
                    <p class="font-weight-bold">Ngày báo cáo</p>
                    <p class="font-weight-bold">Phương thức</p>
                    <p class="font-weight-bold">Trạng thái</p>
                </div>
                <div class="col-9">
                    <p>${report.user.name}</p>
                    <p>${report.createdAt}</p>
                    <p>${report.method}</p>
                    <p>${report.status}</p>
                </div>
            </div>
        </div>
    </div>
    <div class="card mt-3">
        <div class="card-body">
            <p class="font-weight-bold">Nội dung báo cáo</p>
            <p>${report.content}</p>
        </div>
    </div>
    <div class="card mt-3">
        <div class="card-body">
            <p class="font-weight-bold">Hình ảnh</p>
            <div class="row">
                <div class="col-3">
                    <img src="${report.image[0]}" class="img-fluid" alt="">
                </div>
                <div class="col-3">
                    <img src="${report.image[1]}" class="img-fluid" alt="">
                </div>
                <div class="col-3">
                    <img src="${report.image[2]}" class="img-fluid" alt="">
                </div>
                <div class="col-3">
                    <img src="${report.image[3]}" class="img-fluid" alt="">
                </div>
            </div>
        </div>
    </div>
    <div class="card mt-3">
        <div class="card-body">
            <p class="font-weight-bold">Địa điểm</p>
            <p>${report.location}</p>
        </div>
    </div>
    `;

    reportDetail.innerHTML = html;
}