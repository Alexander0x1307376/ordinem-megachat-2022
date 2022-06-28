import { BaseEntity, EntityTarget } from "typeorm";
import AppDataSource from "../dataSource";


const createMany = async <T>(Entity: EntityTarget<T>, data: any) => {
  return await AppDataSource.createQueryBuilder()
    .insert()
    .into(Entity)
    .values(data)
    .execute();
}

export default createMany;