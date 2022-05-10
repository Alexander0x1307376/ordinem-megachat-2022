import { User } from "../../entity/User";
import { getPaginatedList } from "../../utils/serviceUtils";
import { UserPostData } from "./userTypes";
import AppDataSource from "../../dataSource";
import { ILike, In } from "typeorm";

export const friends = async (userUuid: string) => {
  // это мы
  const currentUser = await User.findOneOrFail({
    where: { uuid: userUuid }
  });


  const friends = await AppDataSource.query(`
    SELECT u.uuid, u.name, i.path AS "avaPath"
    FROM users AS u
    LEFT JOIN images AS i ON u."avaId" = i.id
    WHERE u.id <> $1
    AND EXISTS(
      SELECT 1 FROM users_friends_users AS f
      WHERE (f."usersId_1" = $1 AND f."usersId_2" = u.id)
      OR (f."usersId_2" = $1 AND f."usersId_1" = u.id)
    );
  `, [currentUser.id]);

  return friends;
}


export const removeFriend = async (currentUserUuid: string, friendUuid: string) => {


  const userIdsResult = await AppDataSource.createQueryBuilder()
    .select('u.id')
    .from(User, 'u')
    .where({uuid: In([currentUserUuid, friendUuid])})
    .getRawMany();

  const userIds = userIdsResult.map(({u_id}) => u_id);

  const result = await AppDataSource.createQueryBuilder()
    .delete()
    .from('users_friends_users')
    .where({ usersId_1: userIds[0], usersId_2: userIds[1] })
    .orWhere({ usersId_1: userIds[1], usersId_2: userIds[0] })
    .execute();

  return result;
}

export const getItem = async (id: string) => {
  const user = await User.findOneOrFail({where: { uuid: id }});
  return user;
}

export const searchByName = async (search: string) => {
  const queryResult = await AppDataSource.createQueryBuilder()
    .from('users', 'u')
    .select('u.uuid, u.name, i.path as "avaPath"')
    .where({ name: ILike(`%${search}%`) })
    .leftJoin('u.ava', 'i')
    .getRawMany();
  return queryResult;
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
  create,
  searchByName,
  friends,
  removeFriend
}