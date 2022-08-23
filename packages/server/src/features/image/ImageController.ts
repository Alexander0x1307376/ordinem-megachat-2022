import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { BaseController } from "../../common/BaseController";
import { TYPES } from '../../injectableTypes';
import { ILogger } from '../../logger/ILogger';
import { IImageService } from './IImageService';
import { IImageController } from './IImageController';
import { NextFunction, Request, Response } from 'express';
import { getImageDataFromFile } from "./imageUtils";
import { UploadMiddleware } from '../fileUploader/UploadMiddleware';

@injectable()
export class ImageController extends BaseController implements IImageController {
  constructor(
    @inject(TYPES.ILogger) private loggerService: ILogger,
    @inject(TYPES.ImageService) private imageService: IImageService
  ) {
    super(loggerService);
    this.bindRoutes([
      {
        path: '/upload',
        method: 'post',
        func: this.uploadImage,
        middlewares: [new UploadMiddleware('ava')]
      }
    ]);
  }

  async uploadImage(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const imageData = getImageDataFromFile(req)!;
    const result = await this.imageService.create(imageData);
    this.ok(res, result);
  }
}