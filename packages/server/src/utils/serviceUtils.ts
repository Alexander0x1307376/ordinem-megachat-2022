import { BaseEntity, Repository } from "typeorm";


export interface PaginationData<T> {
  page: number,
  rowsPerPage: number,
  total: number,
  list: T[]
}

export const getPaginatedList = async <T extends BaseEntity>(
  repository: Repository<T>, 
  options: {
    page: number,
    rowsPerPage: number,
    select: (keyof T)[],
    order: any
  }
): Promise<PaginationData<T>> => {
  const {page, rowsPerPage, select, order} = options;

  const offset = page === 1 ? 0 : (page - 1) * rowsPerPage;

  const [list, total] = await repository.findAndCount({
    order,
    select,
    take: rowsPerPage,
    skip: offset
  });

  return {
    page,
    rowsPerPage,
    total,
    list
  };
}

