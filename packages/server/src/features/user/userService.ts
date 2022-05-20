import { User } from "../../entity/User";
import { getPaginatedList, PaginationData } from "../../utils/serviceUtils";
import { UserPostData } from "./userTypes";
import AppDataSource from "../../dataSource";
import { DeleteResult, ILike, In, Not } from "typeorm";
import FriendshipSystemEventEmitter from "../friendshipSystem/friendshipSystemEventEmitter";


export type UserItem = {
  uuid: string;
  name: string;
  avaPath?: string;
}

export interface IUserService {
  getItem: (userUuid: string) => Promise<User>;
  getList: (page: number, rowsPerPage?: number) => Promise<PaginationData<User>>;
  checkExistingByEmail: (email: string) => Promise<boolean>;
  getAccountData: (email: string) => Promise<User | null>;
  create: (data: UserPostData) => Promise<User>;
  searchByName: (currentUserUuid: string, search: string) => Promise<UserItem[]>;
  friends: (userUuid: string) => Promise<UserItem[]>;
  removeFriend: (currentUserUuid: string, friendUuid: string) => Promise<DeleteResult>;
}

const createUserService = ({
  friendshipEventEmitter
}: {
  friendshipEventEmitter: FriendshipSystemEventEmitter
}) => {



  const friends = async (userUuid: string) => {
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

    return friends as UserItem[];
  }


  const removeFriend = async (currentUserUuid: string, friendUuid: string) => {


    const userIdsResult = await AppDataSource.createQueryBuilder()
      .select('u.id')
      .from(User, 'u')
      .where({ uuid: In([currentUserUuid, friendUuid]) })
      .getRawMany();

    const userIds = userIdsResult.map(({ u_id }) => u_id);

    const result = await AppDataSource.createQueryBuilder()
      .delete()
      .from('users_friends_users')
      .where({ usersId_1: userIds[0], usersId_2: userIds[1] })
      .orWhere({ usersId_1: userIds[1], usersId_2: userIds[0] })
      .execute();

    friendshipEventEmitter.unfriended(currentUserUuid, friendUuid);

    return result;
  }

  const getItem = async (id: string) => {
    const user = await User.findOneOrFail({ where: { uuid: id } });
    return user;
  }

  const searchByName = async (currentUserUuid: string, search: string) => {

    const currentUser = await User.findOneOrFail({
      where: { uuid: currentUserUuid }
    });

    const queryResult = await AppDataSource.createQueryBuilder()
      .from('users', 'u')
      .select('u.uuid, u.name, i.path as "avaPath"')
      .where({
        name: ILike(`%${search}%`),
        uuid: Not(currentUser.uuid)
      })
      .leftJoin('u.ava', 'i')
      .getRawMany();
    return queryResult as UserItem[];
  }



  const getList = async (page: number, rowsPerPage = 10) => {

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



  const checkExistingByEmail = async (email: string) => {
    return !!(await User.count({ where: { email } }));
  }


  // возвращает undefined если пользователь не найден
  const getAccountData = async (email: string) => {
    const user = await User.findOne({ where: { email } });
    return user;
  }

  const create = async (data: UserPostData) => {
    const user = User.create(data);
    await user.save();
    return user;
  }

  return {
    getItem,
    getList,
    checkExistingByEmail,
    getAccountData,
    create,
    searchByName,
    friends,
    removeFriend
  } as IUserService

}

export default createUserService;