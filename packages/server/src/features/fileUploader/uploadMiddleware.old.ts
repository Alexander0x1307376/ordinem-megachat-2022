import multer from 'multer';


const fileFilter = (req: any, file: any, cb: any) => {
  const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
  const isTypeCorrect = allowedTypes.includes(file.mimetype);
  cb(null, isTypeCorrect);
};


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images/');
  },
  filename:  (req, file, cb) => {
    const uniqueSuffix = Date.now();
    const format = file.originalname.match(/\.\w+$/)?.[0] || '';
    cb(null, encodeURI(file.fieldname) + '_' + uniqueSuffix + format);
  }
});

const upload = multer({ storage, fileFilter });

export default upload;