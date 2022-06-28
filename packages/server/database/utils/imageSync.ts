import fs from 'fs';
import path from 'path';
import { Image } from '../../src/entity/Image';
import AppDataSource from '../dataSource';
// import AppDataSource from '../../src/dataSource';

// для всех фотографий в папке images 
export const syncronizeImages = async () => {

  await AppDataSource.initialize();

  try {

    // получаем список файлов
    const imagesCatalog = path.join(__dirname, '../../images');
    const imageNames: string[] = [];

    fs.readdir(imagesCatalog, (err, files) => {
      files.forEach(file => {
        imageNames.push(file);
      });
    });


    // чистим БД
    await AppDataSource.query('DELETE FROM images');

    // пихаем их в БД
    const imageRows = AppDataSource.getRepository(Image).create(imageNames.map(item => ({
      name: item,
      path: `images/${item}`
    })));
    await AppDataSource.createQueryBuilder().insert().into(Image).values(imageRows).execute();
  } 
  catch (e) {
    console.log(e);
  }
}
