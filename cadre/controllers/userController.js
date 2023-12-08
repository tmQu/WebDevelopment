import User from "../models/UserModel";



var userController = {
    getAll: async (req, res) => {
        try {
            var result = await User.find({},{pwd: -1})
            res.json(result);
        }
        catch(err){
            res.send(err);
        }
    },
    getById: async (req, res) => {
        try{
            var id = req.query.id;
            var result = await BillboardLocation.find({idUser: id}, {pwd: -1});
            res.json(result[0]);
        }
        catch(err){
            res.send(err);
        }
    },
    addUser: async (req, res) => {
        try {
            infor = req.body;
            // ? pwd

            res.send('ok');
        }
        catch(err)
        {
            res.send(err);
        }
    },
    deleteUser: async (req, res) => {
        try {
            var result = await User.findAndDelete({idUser: req.query.id})
        
        }
        catch(err){
            res.send(err);
        }
    }
}

export default userController