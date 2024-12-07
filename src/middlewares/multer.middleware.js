import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, callBack) {
      callBack(null, './public/temp')
    },
    filename: function (req, file, callBack) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      callBack(null, file.fieldname + '-' + uniqueSuffix)
    }
})
  
  const upload = multer({ storage: storage })