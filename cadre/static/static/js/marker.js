const apiUrl = 'localhost:4000'

function getBoardLocationInfor(id, callback) {

    for (var i = 0; i < gBoardLocation; i++)
    {
        if (globalBoardLocation[i]._id == id)
        {
            callback(globalBoardLocation[i]);
        }
    }

}

function getDetailBoard(id, callback)
{
    var boards = [];
    for(var i = 0; i < gBoards.length; i++)
    {
        if (gBoards[i].boardLocation == id)
        {
            boards.push(gBoards[i]);
        }
    }
    callback(boards);

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

    content.advertisementForm = content.advertisementForm.advertisementForm;

    var locationCategory = [];
    content.locationCategory.forEach(category => {
        locationCategory.push(category.locationCategory);
    })
    locationCategory = locationCategory.join(', ');


    var addr = `${content.addr.street_number} ${content.addr.route}, ${content.addr.ward.ward}, ${content.addr.district.district}, ${content.addr.city}`;

    return `<div class="marker-content">\n
    <h3 class="advt-form">${content.advertisementForm}</h3>\n
    <div class="location-category">${locationCategory}</div>\n
    <div class="addr">${addr}</div>\n
    <h3 class="planning">${content.isPlanning == true ? 'Đã quy hoạch' : 'Chưa quy hoạch'}</h3>\n
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

    return `<div class="billboard" id = "${board.id}">
    <h3 class="billboard-type">
        ${board.boardType.boardType}
    </h3>
    <div class="billboard-addr">
        <img src="static/static/img/icon/icons8-maps.svg" alt="" style="height: 1em;">
       ${addr}
    </div>
    <div class="billboard-size"><strong>Kích thước</strong> ${size}</div>
    <div class="billboard-form"><strong>Hình thức</strong> ${boardLocation.advertisementForm.advertisementForm}</div>
    <div class="billboard-category"><strong>Phân loại</strong> ${locationCategory}</div> 
    <div class="d-flex justify-content-between mt-4 mb-1"><button class="btn btn-outline-primary circle-btn"><i class="bi bi-info-lg"></i></button>

    <div class="detail-infor">
        <button type="button" class="btn-close" aria-label="Close"></button>
        <img crossorigin="anonymous" src="${board.imgBillboard}" class="d-block w-100" style="max-height: 240px; object-fit: cover">
        <div class="mt-3"><strong>Ngày hết hạn hộp đồng</strong>: ${dateString}</div>
    </div>
    </div>
    `

}



function setMarkerBillBoard(location, marker,infowindow)
{
        
    marker.addListener('click', () => {

        infowindow.setContent(parseContentMarker(location));
        infowindow.open({
                anchor: marker,
                map
            })


    })


    marker.addListener('click', (event) => {
        getDetailBoard(location._id, (data) => {

            var boardLocation = location
            var boards = data


            var subWindow = document.getElementById('sub-window');
            var content = document.querySelector('#sub-window .overflow-content')

            addCarousel(boardLocation.imgBillboardLocation);
            content.innerHTML = "";
            var idTemp = []
            for (var i = 0; i < boards.length; i++) {

                var billboard = boards[i];
                billboard.id = 'board-' + (i +1).toString();
                content.innerHTML += parseBillBoardContent(boardLocation, billboard);
                subWindow.classList.add('show-up');

                //idTemp board
                idTemp.push(billboard.id);

            }

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
                
            }); 


    
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