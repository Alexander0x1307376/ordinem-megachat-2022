import { User } from "../../entity/User";
import { getPaginatedList, PaginationData } from "../../utils/serviceUtils";
import { UserPostData, User as UserItem } from "@ordinem-megachat-2022/shared";
import { DeleteResult, ILike, In, Not } from "typeorm";
import FriendshipSystemEventEmitter from "../friendshipSystem/friendshipSystemEventEmitter";
import { DataSource } from "typeorm";
import { Group } from "../../entity/Group";
import createChangeDataEventEmitter, { ChangeDataEventEmitter } from "../crudService/changeDataEventEmitter";

export interface IUserService extends ChangeDataEventEmitter<any> {
  getItem: (userUuid: string) => Promise<User>;
  getList: (page: number, rowsPerPage?: number) => Promise<PaginationData<User>>;
  checkExistingByEmail: (email: string) => Promise<boolean>;
  getAccountData: (email: string) => Promise<User | null>;
  create: (data: UserPostData) => Promise<User>;
  searchByName: (currentUserUuid: string, search: string) => Promise<UserItem[]>;
  friends: (userUuid: string) => Promise<UserItem[]>;
  removeFriend: (currentUserUuid: string, friendUuid: string) => Promise<DeleteResult>;
  groupMembers: (groupUuid: string) => Promise<UserItem[]>;
}

const createUserService = ({
  friendshipEventEmitter,
  dataSource
}: {
  friendshipEventEmitter?: FriendshipSystemEventEmitter,
  dataSource: DataSource
}) => {

  const groupMembers = async (groupUuid: string) => {

    const groupData = await dataSource.createQueryBuilder(Group, 'g')
      .select('id')
      .where({ uuid: groupUuid })
      .getRawOne(); 

    const result = await dataSource.createQueryBuilder(User, 'm')
      .select(`m.uuid, m.name, i.path as "avaPath"`)
      .leftJoin('m.ava', 'i')
      .where((qb) => {
        const subQuery = qb.subQuery()
          .from('groups_members_users', 'gmu')
          .select('gmu."usersId"')
          .where('gmu."groupsId" = :groupId')
          .getQuery();
        return 'm.id IN ' + subQuery
      })
      .setParameter('groupId', groupData.id)
      .getRawMany();

    return result as UserItem[];
  }

  const friends = async (userUuid: string) => {
    // это мы
    const currentUser = await User.findOneOrFail({
      where: { uuid: userUuid }
    });


    const friends = await dataSource.query(`
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


    const userIdsResult = await dataSource.createQueryBuilder()
      .select('u.id')
      .from(User, 'u')
      .where({ uuid: In([currentUserUuid, friendUuid]) })
      .getRawMany();

    const userIds = userIdsResult.map(({ u_id }) => u_id);

    const result = await dataSource.createQueryBuilder()
      .delete()
      .from('users_friends_users')
      .where({ usersId_1: userIds[0], usersId_2: userIds[1] })
      .orWhere({ usersId_1: userIds[1], usersId_2: userIds[0] })
      .execute();

    friendshipEventEmitter?.friendsIsChanged({
      userUuid_1: currentUserUuid, 
      userUuid_2: friendUuid
    });
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

    const queryResult = await dataSource.createQueryBuilder()
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

    const repository = dataSource.getRepository(User);

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


  const eventEmitter = createChangeDataEventEmitter<any>({
    methods: {
      create,
      update: () => { },
      remove: () => { }
    }
  })

  
  return {
    getItem,
    getList,
    checkExistingByEmail,
    getAccountData,
    create: eventEmitter.create,
    searchByName,
    friends,
    removeFriend,
    groupMembers,
    ...eventEmitter.emitter
  } as IUserService & ChangeDataEventEmitter<any>

}

export default createUserService;