import { User } from "../../entity/User";
import { getPaginatedList } from "../../utils/serviceUtils";
import { UserPostData } from "./userTypes";
import AppDataSource from "../../dataSource";

export const getItem = async (id: string) => {
  const user = await User.findOneOrFail({where: { uuid: id }});
  return user;
}



export const getList = async (page: number, rowsPerPage = 10) => {

  const repository = AppDataSource.getRepository(User);

  return await getPaginatedList(
    repository,
    {
      select: ['uuid', 'name', 'email', 'createdAt', 'updatedAt'],
      page,
      rowsPerPage,
      order: {
        updatedAt: 'DESC'
      }
    }
  );
}



export const checkExistingByEmail = async (email: string) => {
  return !!(await User.count({where: {email}}));
}


// возвращает undefined если пользователь не найден
export const getAccountData = async (email: string) => {
  const user = await User.findOne({where: {email}});
  return user;
}



export const create = async (data: UserPostData) => {
  const user = User.create(data);
  await user.save();
  return user;
}



export default {
  getItem,
  getList,
  checkExistingByEmail,
  getAccountData,
  create
}