import { controllerFunction as cf } from '../controller';
import imageService from './imageService';



export default {

  upload: cf(async (req, res) => {
    
    // console.log('upload', req.file);

    const result = await imageService.create({
      name: req.file?.originalname,
      description: req.body.description,
      path: req.file?.path
    });

    res.json(result);
  })

}