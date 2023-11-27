import BillboardLocation from "../model/billboardLocation.js";

var billboardController = {
    getAllLocation: async (req, res) => {
        try {
            var result = await BillboardLocation.find({}, {id: 1, location: 1, addr: 1, isPlan: 1, advertisementForm: 1, locationCategory: 1});
            res.json(result);
        }
        catch(err){
            res.send(err);
        }
    },
    getById: async (req, res) => {
        try{
            var id = req.query.id;
            var result = await BillboardLocation.find({id: id});
            res.json(result[0]);
        }
        catch(err){
            res.send(err);
        }
    }
}

export default billboardController