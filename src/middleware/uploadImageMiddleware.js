const multer = require('multer');
const ApiError = require('../utils/apiError');


exports.uploadSingleImage = (fieldName)=>{

  //save image in diskStorage
// const diskStorage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/categories');
//   },
//   filename: function (req, file, cb) {
//     const ext = file.mimetype.split('/')[1];

//     cb(null, `${Date.now()}- ${Math.round(Math.random() * 1e9)}-${ext}`);
//   },
// });

// const diskStorage = multer.diskStorage();
// const uploads = multer({ storage: diskStorage, fileFilter: filterImage });
// exports.uploadSingleImage = uploads.single('image');

const filterImage = function (req, file, cb) {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new ApiError(`Only image Allowed`, 400), false);
  }
};
//memoryStorage
const memoryStorage = multer.memoryStorage();
const uploads = multer({ storage: memoryStorage, fileFilter: filterImage });
return uploads.single(fieldName);
}