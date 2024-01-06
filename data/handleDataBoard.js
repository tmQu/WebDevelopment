var boards = require('./ManageAdvertisingBoards.boards.json')
var locationCategories = require( './location_category.json')
const advs = ['http://localhost:4000/static/db/advs/adv_1.jpg', 'http://localhost:4000/static/db/advs/adv_2.png', 'http://localhost:4000/static/db/advs/adv_3.png']


const locationCategoryRef = []
locationCategories.forEach(category => {
    console.log(category._id['$oid'])
    locationCategoryRef.push(category._id['$oid'])
});

var boardType = require('./board_type.json')
console.log(boardType)





var data = []
boards.forEach(board => {
    board.billboards.forEach(billboard => {
        const random = Math.floor(Math.random() *boardType.length);
        billboard.boardType = boardType[random]._id['$oid'];
        billboard.boardLocation = board._id['$oid'];
        delete billboard.idBillboard
        delete billboard.billboardType
        data.push(billboard)
        billboard.imgBillboard = advs[Math.floor(Math.random() * advs.length)]
    });


});

// console.log(data)

const fs = require("fs");
fs.writeFile(
    "./boards.json",
    JSON.stringify(data, null, 4),
    function (err) {
      if (err) {
        console.log(err);
      }
    }
);

