import { ImagePostData } from '@ordinem-megachat-2022/shared';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { DataSource, Repository } from 'typeorm';
import { AppDataSource } from '../../AppDataSource'; 
import { Image } from '../../entity/Image';
import { TYPES } from '../../injectableTypes';
import { IImageService } from "./IImageService";

@injectable()
export class ImageService implements IImageService {

  private imageRepository: Repository<Image>;
  private dataSource: DataSource;

  constructor(
    @inject(TYPES.DataSource) dataSource: AppDataSource
  ) {
    this.dataSource = dataSource.dataSource;
    this.imageRepository = this.dataSource.getRepository(Image);
  }

  async getItem(uuid: string) {
    const imageData = await this.imageRepository.findOneOrFail({ where: { uuid } });
    return imageData;
  }

  async create(data: ImagePostData) {
    const imageData = this.imageRepository.create(data);
    await imageData.save();
    return imageData;
  }

  async edit(uuid: string, data: ImagePostData) {
    const imageData = await this.imageRepository.findOneOrFail({ where: { uuid } });
    Object.assign(imageData, data);
    return await imageData.save();
  }

  async getImageByPath(imagePath: string) {
    const imageData = await this.imageRepository.findOne({ where: { path: imagePath } });
    return imageData;
  }

  async remove(uuid: string) {

  }
}