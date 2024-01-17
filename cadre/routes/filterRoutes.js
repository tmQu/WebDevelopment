import express from 'express';
const route = express.Router();

route.post('/', async(req, res) => {
    try{
        req.session.filter = req.body;
        res.status(200).json({
            status: 'success',
            data: req.body
        });
    }
    catch(err)
    {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }

});

export default route;