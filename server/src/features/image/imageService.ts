import { Image } from "../../entity/Image";
import { ImagePostData } from "./imageTypes";


const getItem = async (uuid: string) => {
  const imageData = await Image.findOneOrFail({ where: { uuid } });
  return imageData;
}

const create = async (data: ImagePostData) => {
  const imageData = Image.create(data);
  await imageData.save();
  return imageData;
}

const edit = async (uuid: string, data: ImagePostData) => {
  const imageData = await Image.findOneOrFail({ where: { uuid } });
  Object.assign(imageData, data);
  return await imageData.save();
}

const remove = async (uuid: string) => {

}

const imageService = {
  create,
  edit,
  getItem,
  remove
};

export default imageService;