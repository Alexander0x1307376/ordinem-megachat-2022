import { controllerFunction as cf } from '../controller';
import userService from './userService';


export default {

  friends: cf(async (req: any, res) => {
    const result = await userService.friends(req.user.uuid);
    res.json(result);
  }),

  search: cf(async (req: any, res) => {
    const { search } = req.query;
    const result = await userService.searchByName(search as string);
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
}