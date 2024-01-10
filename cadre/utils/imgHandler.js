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
    // fileFilter: (req, file, cb) =>
    // {
    //     const fileType = ['jpg', 'png', 'jpeg', 'gif'];
    //     var extension = file.mimetype;
    //     console.log(extension);
    //     if (extension.includes('image'))
    //     {
    //         cb(null, true);
    //     }
    //     else {
    //         cb(null, false);
    //         cb(new Error('Unknow file extension'));
    //     }

    // }
})

export {upload};



