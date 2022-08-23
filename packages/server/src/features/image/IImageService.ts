import { Image } from "../../entity/Image";
import { ImagePostData } from "@ordinem-megachat-2022/shared/src/apiTypes/imageTypes";



export interface IImageService {
  getItem: (uuid: string) => Promise<Image>;
  create: (data: ImagePostData) => Promise<Image>;
  edit: (uuid: string, data: ImagePostData) => Promise<Image>;
  remove: (uuid: string) => Promise<any>;
  getImageByPath: (imagePath: string) => Promise<Image | null>;
}
