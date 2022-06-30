import AppDataSource from '../../dataSource';
import { controllerFunction as cf } from '../controller';
import { getImageDataFromFile } from '../image/imageUtils';
import createGroupService from './groupService';


const groupService = createGroupService(AppDataSource);

export default {

  // создать инвайт
  createInvite: cf(async (req: any, res) => {
    const { id } = req.params;

    const result = await groupService.createInvite(req.user.uuid, id);
    res.json(result);
  }),


  // присоединиться к группе
  join: cf(async (req: any, res) => {
    const { linkId } = req.params;

    const result = await groupService.joinGroup(req.user.uuid, linkId);
    res.json(result);
  }),

  // покинуть группу
  leave: cf(async (req: any, res) => {
    const {id} = req.params;

    const result = await groupService.leaveGroup(req.user.uuid, id);
    res.json(result);

  }),


  // получить список групп пользователя, с которыми он связан (владелец или член)
  userGroups: cf(async (req: any, res) => {
    const result = await groupService.userGroups(req.user.uuid);
    res.json(result);
  }),


  // создать группу
  create: cf(async (req: any, res) => {

    const result = await groupService.create({ 
      user: req.user,
      imageData: getImageDataFromFile(req), 
      ...req.body, 
    });
    res.json(result);
  }),


  // изменить группу
  update: cf(async (req: any, res) => {

    const { id } = req.params;

    const result = await groupService.update(
      id, { 
        ...req.body,
        user: req.user,
        imageData: getImageDataFromFile(req),
      }
    );
    res.json(result);
  }),

  
  // снести группу
  remove: cf(async (req, res) => {

  }),


  // показать данные группы
  show: cf(async (req, res) => {
    const { id } = req.params;

    const result = await groupService.groupDetails(id);
    res.json(result);
  }),

}