import express from 'express'
import mongoose from 'mongoose'
import bodyParser from 'body-parser';
import billboardRouter from './routers/billboardRouter.js'
import cors from 'cors'
const app = express()
app.use(cors());

app.use('/billboard', billboardRouter);


app.use(bodyParser.urlencoded({ extended: true }));

const dbName = "advertisement"
mongoose.connect('mongodb://127.0.0.1:27017/' + dbName).catch(error => console.log(error));;



var datatest = {
    id: "BB",
    location: {
        lat: 10.76320512569573,
        lng: 106.68307353233895
    },
    addr : {
        NumStreet: '235 Đ. Nguyễn Văn Cừ',
        ward: 'Phường Nguyễn Cư Trinh',
        district: 'Quận 1',
        city: 'Thành phố Hồ Chí Minh'    
    },
    isPlan: true,
    advertisementForm: 'Cổ động chính trị',
    locationCategory: 'Đất công/Công viên/Hành lang an toàn giao thông',
    billboards: [
        {
            billboardType: 'Trụ cụm pano',
            quatity: '1 trụ/bảng',
            size: {
                width: 2.5,
                height: 10
            },
            img: [
                './test.png',
                './test.png',
                './test.png'
            ],
            date_expired: Date('28/11/2023')
        },
        {
            billboardType: 'Trụ cụm pano',
            quatity: '2 trụ/bảng',
            size: {
                width: 2.5,
                height: 10
            },
            img: [
                './test.png',
                './test.png',
                './test.png'
            ],
            date_expired: Date('28/11/2023')
        }
    ]
}

// import BillboardLocation from './model/billboardLocation.js';
// var locationTest = [
//     {
//         lat: 10.76320512569573,
//         long: 106.68307353233895
//     },
//     {lat: 10.763027514320223, long: 106.68096363312848},
//     {lat: 10.764081521862419, long:106.68175756699823},
//     {lat:10.761235693049382, long: 106.68369948636092},
//     {lat: 10.76002357262501, long: 106.68232619528789}

// ]

// for (var i = 0; i < locationTest.length; i++)
// {
//     datatest.id = 'BB' + (i + 1);
//     datatest.location.lat = locationTest[i].lat;
//     datatest.location.lng = locationTest[i].long;
//     console.log('ok')
//     try{
//         await BillboardLocation(datatest).save();

//     }
//     catch(err){
//         console.log(err);
//     }
// }
app.listen(4000, () => {
    console.log('Server running on port 4000')
})