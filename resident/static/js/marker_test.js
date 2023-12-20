const apiUrl = 'localhost:4000'

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

function getDetailBillboardLocation(id, callback) {
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



function addCarousel(images, location=true)
{
    var imgSlider = '';
    images.forEach(img => {
       imgSlider += `<img src="${img}" class="d-block w-100" style="max-height: 240px; object-fit: cover">`
    });
    var carousel = 
    `<div class="carousel slide ${location == true ? 'mt-4': 'm-1 w-100'}">
    <div class="carousel-inner" id = 'carousel-location'>
        ${imgSlider}
    </div>
    `
    +
    `
    <button class="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
      <span class="carousel-control-prev-icon shadow" aria-hidden="true"></span>
      <span class="visually-hidden">Previous</span>
    </button>
    <button class="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
      <span class="carousel-control-next-icon shadow" aria-hidden="true"></span>
      <span class="visually-hidden">Next</span>
    </button>
  </div>`
  return carousel;
}
function parseContentMarker(content)
{
    console.log(content.addr)
    var addr = `${content.addr.street_number} ${content.addr.route}, ${content.addr.ward}, ${content.addr.district}, ${content.addr.city}`;
    var locationCategory = "";
    content.locationCategory.forEach(category => {locationCategory += category});
    return `<div class="marker-content">\n
    <h3 class="advt-form">${content.advertisementForm}</h3>\n
    <div class="location-category">${locationCategory}</div>\n
    <div class="addr">${addr}</div>\n
    <h3 class="planning">${content.isPlanning == true ? 'Đã quy hoạch' : 'Chưa quy hoạch'}</h3>\n
    </div>`;
}

function parseBillBoardContent(billboardLocation, billboard, id){
    var addr = `${billboardLocation.addr.street_number} ${billboardLocation.addr.route}, ${billboardLocation.addr.ward}, ${billboardLocation.addr.district}, ${billboardLocation.addr.city}`;
    var size = `${billboard.size}`
    var locationCategory = "";
    billboardLocation.locationCategory.forEach(category => {locationCategory += category});

    return `<div class="billboard" id = "${id}">
    <h3 class="billboard-type">
        ${billboard.billboardType}
    </h3>
    <div class="billboard-addr">
        <img src="../img/icon/icons8-maps.svg" alt="" style="height: 1em;">
       ${addr}
    </div>
    <div class="billboard-size">${size}</div>
    <div class="billboard-form">${billboardLocation.advertisementForm}</div>
    <div class="billboard-category">${locationCategory}</div> 
    <div class="d-flex justify-content-between mt-4 mb-1"><button class="btn btn-outline-primary circle-btn"><i class="bi bi-info-lg"></i></button>
    <button class="btn btn-outline-danger"><i class="bi bi-exclamation-octagon"></i> Báo cáo cáo vi phạm</button></div>
    <div class="detail-infor">
        <button type="button" class="btn-close" aria-label="Close"></button>
        ${addCarousel([billboard.imgBillboard], false)}
        <div>expired date: ${billboard.expireDate.toString()}</div>
    </div>
    </div>
    `

}


// function setMarker(map)
// {
//     const subWindow = document.getElementById('sub-window')
//     map.controls[google.maps.ControlPosition.TOP_LEFT].push(subWindow);

//     getAllLocation((locations) => {
//         locations = locations.data
//         console.log(locations)
//         const iconMarker = {
//             url: "../img/ad.256x256.png",
//             scaledSize: new google.maps.Size(25, 25)
//         };

//         const infowindow = new google.maps.InfoWindow({
//             maxWidth: 250
//         });

//         locations.forEach(location => {
//             var marker = new google.maps.Marker({
//                 position: location.location,
//                 map, 
//                 icon: iconMarker, 
//                 title: location.id
//             })

//             marker.addListener('click', () => {
//                 getDetailBillboardLocation(location.id, (detailInfor) => {
//                     console.log(detailInfor);
//                     detailInfor = detailInfor.data;
//                     console.log(detailInfor)
//                     infowindow.setContent(parseContentMarker(detailInfor));
//                     infowindow.open({
//                         anchor: marker,
//                         map
//                     })
//                 });

//             })


//             marker.addListener('click', (event) => {
//                 getDetailBillboardLocation(location.id, (detailInfor) => {
//                     console.log(detailInfor)
//                     detailInfor = detailInfor.data
//                     var subWindow = document.getElementById('sub-window');
//                     //subWindow.innerHTML =  addCarousel(['../img/test_billboard.jpg']) + subWindow.innerHTML;
//                     var content = document.querySelector('#sub-window .overflow-content')
//                     content.innerHTML = "";
//                     console.log(detailInfor)
//                     var idTest = [];
//                     detailInfor.billboards.forEach(id => idTest.push(id.idBillboard))
//                     detailInfor.billboards.forEach(billboard => {
//                         content.innerHTML += parseBillBoardContent(detailInfor, billboard, billboard.idBillboard);
                    
//                         subWindow.classList.add('show-up');

//                     })
//                     idTest.forEach(id => {   
//                     document.querySelector(`#${id} button.circle-btn`).addEventListener('click', () => {
//                         document.querySelector(`#${id}`).classList.add('active');
//                         var detailInfor = document.querySelector(`#${id} .detail-infor`);
//                         detailInfor.classList.add('show-up');
//                         document.querySelector(`#${id} .btn-close`).onclick = () =>{
//                             document.querySelector(`#${id} .detail-infor`).classList.remove('show-up');
//                         }
//                     });

//                     document.querySelector(`#${id} button.btn-outline-danger`).addEventListener('click', () => {
                        
//                         document.querySelector(`#report`).classList.add('show-up');

//                         document.getElementById('submit').addEventListener('click',()=> {
//                             var item = JSON.parse(localStorage.getItem('report')) || [];
//                             item.push(detailInfor.location)
//                             console.log(item)
//                             localStorage.setItem('report', JSON.stringify(item))
//                         });
//                     })
//                 });
//                     // var btnInfors = document.querySelectorAll('button.circle-btn');
//                     // btnInfors.forEach(btn => {
//                     //     btn.addEventListener('click', (event) => {
//                     //         var idParent = event.target.parentNode.parentNode.id;
//                     //         console.log(event.target.parentNode)
//                     //         console.log(idParent);


//                     //         console.log(`#${idParent} .btn-close`   )

                    
//                     //     })
//                     // })
           
//                 });

//             })


   

//         })

//     })
// }

function setMarkerBillBoard(location, marker,infowindow)
{
        
    marker.addListener('click', () => {
        console.log('ok')
        getDetailBillboardLocation(location.id, (detailInfor) => {
            console.log(detailInfor);
            detailInfor = detailInfor.data;
            console.log(detailInfor)
            infowindow.setContent(parseContentMarker(detailInfor));
            infowindow.open({
                anchor: marker,
                map
            })
        });

    })


    marker.addListener('click', (event) => {
        getDetailBillboardLocation(location.id, (detailInfor) => {
            console.log(detailInfor)
            detailInfor = detailInfor.data
            var subWindow = document.getElementById('sub-window');
            //subWindow.innerHTML =  addCarousel(['../img/test_billboard.jpg']) + subWindow.innerHTML;
            var content = document.querySelector('#sub-window .overflow-content')
            content.innerHTML = "";
            console.log(detailInfor)
            var idTest = [];
            detailInfor.billboards.forEach(id => idTest.push(id.idBillboard))
            detailInfor.billboards.forEach(billboard => {
                content.innerHTML += parseBillBoardContent(detailInfor, billboard, billboard.idBillboard);
            
                subWindow.classList.add('show-up');

            })
            idTest.forEach(id => {   
            document.querySelector(`#${id} button.circle-btn`).addEventListener('click', () => {
                document.querySelector(`#${id}`).classList.add('active');
                var detailInfor = document.querySelector(`#${id} .detail-infor`);
                detailInfor.classList.add('show-up');
                document.querySelector(`#${id} .btn-close`).onclick = () =>{
                    document.querySelector(`#${id} .detail-infor`).classList.remove('show-up');
                }
            });

            document.querySelector(`#${id} button.btn-outline-danger`).addEventListener('click', () => {
                
                document.querySelector(`#report`).classList.add('show-up');

                document.getElementById('submit').addEventListener('click',()=> {
                    var item = JSON.parse(localStorage.getItem('report')) || [];
                    item.push(detailInfor.location)
                    console.log(item)
                    localStorage.setItem('report', JSON.stringify(item))
                });
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

function setMarkerReport(location, marker, infowindow)
{
    marker.addListener('click', () => {
        infowindow.setContent(parseContentMarker(location));
        infowindow.open({
            anchor: marker,
            map
        })
    })
}

export default setMarker