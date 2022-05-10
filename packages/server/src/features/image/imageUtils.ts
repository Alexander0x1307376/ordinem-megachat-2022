import { Request } from 'express';

type FileData = {
  originalname: string;
  path: string;
}


/*
  Возвращает данные файла из request или undefined, если их нет
*/
export const getImageDataFromFile = (req: Request | { file: FileData } | any) => {
  return req.file
    ? {
      name: req.file?.originalname,
      description: req.body.description,
      path: req.file?.path,
    }
    : undefined;
}