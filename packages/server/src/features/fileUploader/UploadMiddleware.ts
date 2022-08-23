import { NextFunction, Request, Response } from "express";
import { IMiddleware } from "../../common/IMiddleware";
import multer, { Multer } from 'multer';

export class UploadMiddleware implements IMiddleware {
  
  private func: any;

  constructor(imageFieldName: string) {
    const fileFilter = (req: any, file: any, cb: any) => {
      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
      const isTypeCorrect = allowedTypes.includes(file.mimetype);
      cb(null, isTypeCorrect);
    };


    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, 'images/');
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now();
        const format = file.originalname.match(/\.\w+$/)?.[0] || '';
        cb(null, encodeURI(file.fieldname) + '_' + uniqueSuffix + format);
      }
    });

    const upload = multer({ storage, fileFilter });
    this.func = upload.single(imageFieldName);
  }


  execute(
    req: Request | any,
    res: Response,
    next: NextFunction
  ) {
    return this.func(req, res, next);
  }
}