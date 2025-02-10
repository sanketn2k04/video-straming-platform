import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, callBack) {
      callBack(null, './public/temp')
    },
    filename: function (req, file, callBack) {

      const uniqueSuffix = req.user?._id + '-' + Date.now() + '-' + Math.round(Math.random() * 1E9)
      const fileExtension = file.originalname.split('.').pop();
      callBack(null, file.fieldname + '-' + uniqueSuffix+'.'+fileExtension)
    }
})
  
const upload = multer({ storage: storage })

export {upload}