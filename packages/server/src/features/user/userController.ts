import { ControllerMethod } from '../../types';
import { controllerFunction as cf } from '../controller';
import { IUserService } from './userService';


export interface IUserController {
  search: ControllerMethod;
  groupMembers: ControllerMethod;
  list: ControllerMethod;
  show: ControllerMethod;
  edit: ControllerMethod;
  create: ControllerMethod;
  remove: ControllerMethod;
}

const createUserController = (userService: IUserService) => {

  return {

    groupMembers: cf(async (req: any, res) => {
      const { groupId } = req.params;
      const result = await userService.groupMembers(groupId);
      res.json(result);
    }),

    search: cf(async (req: any, res) => {
      const userUuid = req.user.uuid;
      const { search } = req.query;
      const result = await userService.searchByName(userUuid, search as string);
      res.json(result);
    }),


    list: cf(async (req, res) => {
      const { page } = req.params;
      const result = await userService.getList(+page);
      res.json(result);
    }),


    show: cf(async (req, res) => {
      const { id } = req.params;
      const result = await userService.getItem(id);
      res.json(result);
    }),


    edit: cf((req, res) => {
      res.json('useredit');
    }),


    create: cf((req, res) => {
      res.json('usercreate');
    }),


    remove: cf((req, res) => {
      res.json('userremove');
    }),
  } as IUserController;
}

export default createUserController;