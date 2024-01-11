import multer from 'multer'

const upload = multer({ 
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            var url = req.originalUrl;
            if(url.includes('license'))
            {
                cb(null, './static/db/license');
            }
            else{
                cb(null, './static/img/reports');
            }
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname + '_' + Date.now())
        }
    })
})

export {upload};


