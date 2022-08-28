import 'reflect-metadata';
import { inject, injectable } from "inversify";
import { DataSource, ILike, In, Not, Repository } from "typeorm";
import { TYPES } from "../../injectableTypes";
import { IUserService } from "./IUserService";
import { UserPostData, User as UserItem } from "@ordinem-megachat-2022/shared";
import { User } from "../../entity/User";
import { getPaginatedList } from "../../utils/serviceUtils";
import { Group } from "../../entity/Group";
import EntityEventEmitter from "../../common/EntityEventEmitter";
import { AppDataSource } from '../../AppDataSource';
import { FriendshipSystemEventEmitter } from '../friendshipSystem/FriendshipSystemEventEmitter';



@injectable()
export class UserService implements IUserService {

  private userRepository: Repository<User>;
  private dataSource: DataSource;

  constructor(
    @inject(TYPES.DataSource) dataSource: AppDataSource,
    @inject(TYPES.UserEventEmitter) private userEventEmitter: EntityEventEmitter,
    @inject(TYPES.FriendshipEventEmitter) private  friendshipEventEmitter: FriendshipSystemEventEmitter
  ) {
    this.dataSource = dataSource.dataSource;
    this.userRepository = this.dataSource.getRepository(User);
  }

  async groupMembers(groupUuid: string) {

    const groupData = await this.dataSource.createQueryBuilder(Group, 'g')
      .select('id')
      .where({ uuid: groupUuid })
      .getRawOne();

    const result = await this.dataSource.createQueryBuilder(User, 'm')
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

  async friends(userUuid: string) {
    // это мы
    const currentUser = await this.userRepository.findOneOrFail({
      where: { uuid: userUuid }
    });


    const friends = await this.dataSource.query(`
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


  async removeFriend(currentUserUuid: string, friendUuid: string) {


    const userIdsResult = await this.dataSource.createQueryBuilder()
      .select('u.id')
      .from(User, 'u')
      .where({ uuid: In([currentUserUuid, friendUuid]) })
      .getRawMany();

    const userIds = userIdsResult.map(({ u_id }) => u_id);

    const result = await this.dataSource.createQueryBuilder()
      .delete()
      .from('users_friends_users')
      .where({ usersId_1: userIds[0], usersId_2: userIds[1] })
      .orWhere({ usersId_1: userIds[1], usersId_2: userIds[0] })
      .execute();

    this.friendshipEventEmitter.emitFriendsChanged({
      userUuid_1: currentUserUuid,
      userUuid_2: friendUuid
    });
    return result;
  }


  async getItem(id: string) {
    const user = await this.userRepository.findOneOrFail({ where: { uuid: id } });
    return user;
  }


  async searchByName(currentUserUuid: string, search: string) {

    const currentUser = await User.findOneOrFail({
      where: { uuid: currentUserUuid }
    });

    const queryResult = await this.dataSource.createQueryBuilder()
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


  async getList(page: number, rowsPerPage = 10) {

    return await getPaginatedList(
      this.userRepository,
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


  async checkExistingByEmail(email: string) {
    return !!(await this.userRepository.count({ where: { email } }));
  }


  // возвращает undefined если пользователь не найден
  async getAccountData(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    return user;
  }


  async create(data: UserPostData) {
    const user = this.userRepository.create(data);
    await user.save();
    this.userEventEmitter.emitCreated(user);
    return user;
  }

}