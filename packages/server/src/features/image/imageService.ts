import { Image } from "../../entity/Image";
import { ImagePostData } from "@ordinem-megachat-2022/shared/src/apiTypes/imageTypes";
import { DataSource } from "typeorm";


export interface IImageService {
  getItem: (uuid: string) => Promise<Image>;
  create: (data: ImagePostData) => Promise<Image>;
  edit: (uuid: string, data: ImagePostData) => Promise<Image>;
  remove: (uuid: string) => Promise<any>;
  getImageByPath: (imagePath: string) => Promise<Image | null>;
}

const createImageService = (dataSource: DataSource) => {


  const getItem = async (uuid: string) => {
    const imageData = await dataSource.getRepository(Image).findOneOrFail({ where: { uuid } });
    return imageData;
  }

  const create = async (data: ImagePostData) => {
    const imageData = dataSource.getRepository(Image).create(data);
    await imageData.save();
    return imageData;
  }

  const edit = async (uuid: string, data: ImagePostData) => {
    const imageData = await dataSource.getRepository(Image).findOneOrFail({ where: { uuid } });
    Object.assign(imageData, data);
    return await imageData.save();
  }

  const getImageByPath = async (imagePath: string) => {
    const imageData = await dataSource.getRepository(Image).findOne({ where: {path: imagePath} });
    return imageData;
  }

  const remove = async (uuid: string) => {

  }


  const result: IImageService = {
    create,
    edit,
    getItem,
    remove,
    getImageByPath
  }
  return result;

}


export default createImageService;