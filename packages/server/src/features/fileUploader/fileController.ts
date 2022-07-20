import { controllerFunction as cf } from "../controller";
import { IImageService } from "../image/imageService";
import { getImageDataFromFile } from "../image/imageUtils";


export interface IImageController extends ReturnType<typeof createImageController> {}

const createImageController = (imageService: IImageService) => {
  
  const uploadImage = cf(async (req, res) => {
    const imageData = getImageDataFromFile(req)!;
    const result = await imageService.create(imageData);
    res.json(result);
  });

  return {
    uploadImage
  }
}



export default createImageController;