import express from 'express';
const route = express.Router();

route.post('/', async(req, res) => {
    try{

        req.session.filter = req.body;
        console.log(req.session.filter);
        res.redirect('/')
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