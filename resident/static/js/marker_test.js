const apiUrl = 'localhost:4000'

function getBoardLocationInfor(id, callback) {
    var url = 'http://'+ apiUrl + '/api/v1/boards/' + id;
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

function getDetailBoard(id, callback)
{
    var url = 'http://'+ apiUrl + '/api/v1/boards/detail/' + id;
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


function addCarousel(images)
{
    var imgSlider = '';
    console.log(images)
    for (var i = 0; i < images.length; i++) {
        var img = images[i];
       imgSlider += `
       <div class="carousel-item ${i == 0 ? 'active': ''}">
       <img crossorigin="anonymous" src="${img}" class="d-block w-100" style="max-height: 240px; object-fit: cover">
       </div>
       `
       console.log(imgSlider)
    };
    
    document.querySelector('#carousel-location').innerHTML = imgSlider;
}
function parseContentMarker(content)
{


    var locationCategory = [];
    content.locationCategory.forEach(category => {
        locationCategory.push(category.locationCategory);
    })
    locationCategory = locationCategory.join(', ');


    var addr = `${content.addr.street_number} ${content.addr.route}, ${content.addr.ward.ward}, ${content.addr.district.district}, ${content.addr.city}`;

    return `<div class="marker-content" style="padding-right: 10px">\n
    <h5 class="advt-form" style="font-weight: bold;">${content.advertisementForm.advertisementForm}</h5>\n
    <div class="location-category">${locationCategory}</div>\n
    <div class="addr">${addr}</div>\n
    <h6 class="planning" style="font-weight: bold;">${content.isPlan == true ? 'Đã quy hoạch' : 'Chưa quy hoạch'}</h6>\n
    </div>`;
}

function parseBillBoardContent(boardLocation, board){
    var addr = `${boardLocation.addr.street_number} ${boardLocation.addr.route}, ${boardLocation.addr.ward.ward}, ${boardLocation.addr.district.district}, ${boardLocation.addr.city}`;
    var size = `${board.size}`
    var locationCategory = "";

    var locationCategory = [];
    boardLocation.locationCategory.forEach(category => {
        locationCategory.push(category.locationCategory);
    })
    locationCategory = locationCategory.join(', ');


    // Thêm offset 7 giờ để chuyển múi giờ hiện tại thành múi giờ Việt Nam
    const vietnamTime = new Date(new Date(board.expireDate).getTime() + 7 * 60 * 60 * 1000);

    const year = vietnamTime.getFullYear();
    const month = vietnamTime.getMonth() + 1; // Tháng bắt đầu từ 0, cần cộng thêm 1
    const day = vietnamTime.getDate();

    const dateString = `${day < 10 ? '0' + day : day}/${month < 10 ? '0' + month : month}/${year}`;

    return `
    <div class="billboard" id = "${board.id}">
    <div class="billboard-type" style="font-weight: bold; font-size:15pt">
        ${board.boardType.boardType}
    </div>
    <div class="billboard-addr">
        <img src="../img/icon/icons8-maps.svg" alt="" style="height: 1em;">
       ${addr}
    </div>
    <div class="billboard-size"><strong>Kích thước</strong> ${size}</div>
    <div class="billboard-size"><strong>Số lượng</strong> ${board.quantity}</div>
    <div class="billboard-form"><strong>Hình thức</strong> ${boardLocation.advertisementForm.advertisementForm}</div>
    <div class="billboard-category"><strong>Phân loại</strong> ${locationCategory}</div> 
    <div class="d-flex justify-content-between mt-4 mb-1"><button class="btn btn-outline-primary circle-btn"><i class="bi bi-info-lg"></i></button>
    <a class="btn btn-outline-danger" data-toggle="modal" data-target="#report" href="http://localhost:3000/static/html/report.html?id=${board._id}"><i class="bi bi-exclamation-octagon"></i> Báo cáo vi phạm</a></div>
    
    <div class="modal fade" id="report" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"
  aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header text-center">
        <h4 class="modal-title w-100 font-weight-bold">Sign in</h4>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body mx-3">
        <div class="md-form mb-5">
          <i class="fas fa-envelope prefix grey-text"></i>
          <input type="email" id="defaultForm-email" class="form-control validate">
          <label data-error="wrong" data-success="right" for="defaultForm-email">Your email</label>
        </div>

        <div class="md-form mb-4">
          <i class="fas fa-lock prefix grey-text"></i>
          <input type="password" id="defaultForm-pass" class="form-control validate">
          <label data-error="wrong" data-success="right" for="defaultForm-pass">Your password</label>
        </div>

      </div>
      <div class="modal-footer d-flex justify-content-center">
        <button class="btn btn-default">Login</button>
      </div>
    </div>
  </div>
</div>


    <div class="detail-infor">
        <button type="button" class="btn-close" aria-label="Close"></button>
        <img crossorigin="anonymous" src="${board.imgBillboard}" class="d-block w-100" style="max-height: 240px; object-fit: cover">
        <div class="mt-3"><strong>Ngày hết hạn hộp đồng</strong>: ${dateString}</div>
    </div>
    </div>
    `

}




function setMarkerBillBoard(map, location, marker,infowindow)
{
        
    marker.addListener('click', () => {
        map.panTo(marker.position);

        infowindow.setContent(parseContentMarker(location));
        infowindow.open({
            anchor: marker,
            map
        })
    })



    marker.addListener('click', (event) => {
        getDetailBoard(location._id, (detailInfor) => {

            var boardLocation = detailInfor.data.boardLocation;
            var boards = detailInfor.data.boards;

            var subWindow = document.getElementById('sub-window');
            var content = document.querySelector('#sub-window .overflow-content')

            addCarousel(boardLocation.imgBillboardLocation);
            content.innerHTML = "";
            if (boards.length == 0)
            {
                content.innerHTML = `
                <div class ='mt-5'>Không có thông tin về bảng quảng cáo</div>
                `
            }
            var idTemp = []
            for (var i = 0; i < boards.length; i++) {

                var billboard = boards[i];
                billboard.id = 'board-' + (i +1).toString();
                content.innerHTML += parseBillBoardContent(boardLocation, billboard);


                //idTemp board
                idTemp.push(billboard.id);

            }
            subWindow.classList.add('show-up');
            if (subWindow.classList.contains('narrow'))
                document.querySelector('#btn-collapse').click();

            idTemp.forEach(idBB => {
                console.log(`#${idBB} button.circle-btn`)

                // detail infor button
                document.querySelector(`#${idBB} button.circle-btn`).addEventListener('click', () => {
                    document.querySelector(`#${idBB}`).classList.add('active');
                    var detailInfor = document.querySelector(`#${idBB} .detail-infor`);
                    console.log(`#${idBB} .detail-infor`);
                    detailInfor.classList.add('show-up');
                    document.querySelector(`#${idBB} .btn-close`).onclick = () =>{
                        document.querySelector(`#${idBB} .detail-infor`).classList.remove('show-up');
                    }
                });
                
                // report button
                document.querySelector(`#${idBB} button.btn-outline-danger`).addEventListener('click', () => {
                    
                    // document.querySelector(`#report`).classList.add('show-up');
    
                    // document.getElementById('submit').addEventListener('click',()=> {
                    //     var item = JSON.parse(localStorage.getItem('report')) || [];
                    //     item.push(detailInfor.location)
                    //     console.log(item)
                    //     localStorage.setItem('report', JSON.stringify(item))
                    // });
                })
            }); 


            // var btnInfors = document.querySelectorAll('button.circle-btn');
            // btnInfors.forEach(btn => {
            //     btn.addEventListener('click', (event) => {
            //         var idParent = event.target.parentNode.parentNode.id;
            //         console.log(event.target.parentNode)
            //         console.log(idParent);


            //         console.log(`#${idParent} .btn-close`   )

            
            //     })
            // })
    
        });

    })
}

function setMarkerReport(report, marker)
{
    marker.addListener('click', () => {
        $.get('url_api_report/' + report.id, (data, status) => {
            let content = data.data;
            
        })
    })
}


export default setMarkerBillBoard