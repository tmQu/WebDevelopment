var boards = require('./Modified_boards.json')
var locationCategories = require( './location_category.json')
const advs = ['http://localhost:4000/static/db/advs/adv_1.jpg', 'http://localhost:4000/static/db/advs/adv_2.png', 'http://localhost:4000/static/db/advs/adv_3.png']


const locationCategoryRef = []
locationCategories.forEach(category => {
    console.log(category._id['$oid'])
    locationCategoryRef.push(category._id['$oid'])
});
const advsRef = ['6592855060292ab573f76428', '6592855060292ab573f76429', '6592855060292ab573f7642a']





boards.forEach(board => {
    board.imgBillboardLocation = ['http://localhost:4000/static/db/billboard/billboard_1.png', 'http://localhost:4000/static/db/billboard/billboard_2.png', 'http://localhost:4000/static/db/billboard/billboard_3.jpg'];
    var random = Math.floor(Math.random() * locationCategoryRef.length);
    board.locationCategory = []
    delete board.billboards
    delete board.id
    board.locationCategory.push(locationCategoryRef[random]);
    random = Math.floor(Math.random() * locationCategoryRef.length);
    board.locationCategory.push(locationCategoryRef[random]);

    const random2 = Math.floor(Math.random() * advsRef.length);
    board.advertisementForm = advsRef[random2];

});

const fs = require("fs");
fs.writeFile(
    "./boards2.json",
    JSON.stringify(boards, null, 4),
    function (err) {
      if (err) {
        console.log(err);
      }
    }
);
