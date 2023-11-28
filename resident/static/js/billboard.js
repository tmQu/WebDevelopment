
function getAllLocation(callback){
    var url = 'http://localhost:4000/billboard/all';
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
    var url = 'http://localhost:4000/billboard/detail?id=' + id;
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

function parseContentMarker(content)
{
    var addr = `${content.addr.NumStreet}, ${content.addr.ward}, ${content.addr.district}, ${content.addr.city}`;
    var locationCategory = "";
    content.locationCategory.forEach(category => {locationCategory += category});
    return `<div class="marker-content">\n`+
    `<h3 class="advt-form">${content.advertisementForm}</h3>\n`+
    `<div class="location-category">${locationCategory}</div>\n`+
    `<div class="addr">${addr}</div>\n`+
    `<h3 class="planning">${content.isPlanning == true ? 'Đã quy hoạch' : 'Chưa quy hoạch'}</h3>\n`+
    `</div>`;
}

function parseBillBoardContent(billboardLocation, billboard){
    var addr = `${billboardLocation.addr.NumStreet}, ${billboardLocation.addr.ward}, ${billboardLocation.addr.district}, ${billboardLocation.addr.city}`;
    var size = `${billboard.size.width} ${billboard.size.metric} x ${billboard.size.height} ${billboard.size.width}`
    var locationCategory = "";
    billboardLocation.locationCategory.forEach(category => {locationCategory += category});

    return `<div class="billboard">`+
    `<h3 class="billboard-type">`+
        `${billboard.billboardType}`
    `</h3>`
    `<div class="billboard-addr">`
        `<img src="../img/icon/icons8-maps.svg" alt="" style="height: 1em;">`
       `${addr}`
    `</div>`
    `<div class="billboard-size">${size}</div>`
    `<div class="billboard-form">${billboard.advertisementForm}</div>`
    `<div class="billboard-category">${locationCategory}</div></div>`
}


function setMarker(map)
{
    const subWindow = document.getElementById('sub-window')
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(subWindow);

    getAllLocation((locations) => {
        console.log(locations)
        const iconMarker = {
            url: "../img/ad.256x256.png",
            scaledSize: new google.maps.Size(25, 25)
        };

        const infowindow = new google.maps.InfoWindow({
            maxWidth: 250
        });

        locations.forEach(location => {
            var marker = new google.maps.Marker({
                position: location.location,
                map, 
                icon: iconMarker, 
                title: location.id
            })

            marker.addListener('click', () => {
                getDetailBillboardLocation(location.id, (detailInfor) => {
                    infowindow.setContent(parseContentMarker(detailInfor));
                    infowindow.open({
                        anchor: marker,
                        map
                    })
                });

            })

   

        })

    })
}

export default setMarker