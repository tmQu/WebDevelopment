import multer from 'multer';

const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      var url = req.originalUrl;
      // console.log(url);
      if (url.includes('license')) {
        cb(null, './static/db/license');
      } else if (url.includes('changeBoard')) {
        cb(null, './static/db/advs');
      }else if (url.includes('changeBoardLocation')) {
        cb(null, './static/img/boardsLocation');

      } 
      else if (url.includes('api/v1/boards')) {
        cb(null, './static/db/advs');
      }
      else if (url.includes('api/v1/boardLocation')) {
        cb(null, './static/db/billboard');
      }
      else {
        cb(null, './static/img/reports');
      }
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '_' + file.originalname );
    },
  }),
});

export { upload };
