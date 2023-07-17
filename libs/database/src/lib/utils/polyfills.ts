// eslint-disable
// prettier-ignore
import 'source-map-support/register'
import {
  EntityManager,
  EntityTarget,
  FindAndPaginateOptions,
  FindManyOptions,
  ObjectLiteral,
  Repository,
} from 'typeorm'
import { DEFAULT_PAGE_SIZE, Paginate } from './pagination'

declare module 'typeorm' {
  interface PaginateOptions {
    page?: number
    limit?: number
  }

  interface FindAndPaginateOptions<Entity extends ObjectLiteral>
    extends Omit<FindManyOptions<Entity>, 'skip' | 'take'>,
      PaginateOptions {}

  interface EntityManager {
    findAndPaginate<Entity extends ObjectLiteral>(
      EntityClass: EntityTarget<Entity>,
      options: FindAndPaginateOptions<Entity>,
    ): Promise<Paginate<Entity>>
  }

  interface Repository<Entity extends ObjectLiteral> {
    findAndPaginate(
      options: FindAndPaginateOptions<Entity>,
    ): Promise<Paginate<Entity>>
  }
}

EntityManager.prototype.findAndPaginate = async function <
  Entity extends ObjectLiteral,
>(
  entityClass: EntityTarget<Entity>,
  options: FindAndPaginateOptions<Entity>,
): Promise<Paginate<Entity>> {
  const { page = 1, limit = DEFAULT_PAGE_SIZE, ...findManyOptions } = options

  const skip = Number((page - 1) * limit)
  const take = Number(limit)

  const [data, total] = await this.findAndCount(entityClass, {
    ...findManyOptions,
    skip,
    take,
  })

  const totalItems: number = total
  const itemCount: number = data.length
  const currentPage: number = page
  const totalPages: number = Math.ceil(total / limit)
  const nextPage = page < totalPages ? page + 1 : undefined
  const previousPage = page > 1 ? page - 1 : undefined

  return Paginate.from(data, {
    totalItems,
    itemCount,
    currentPage,
    totalPages,
    nextPage,
    prevPage: previousPage,
  })
}

Repository.prototype.findAndPaginate = async function <
  Entity extends ObjectLiteral,
>(options: FindAndPaginateOptions<Entity>): Promise<Paginate<Entity>> {
  const { page = 1, limit = DEFAULT_PAGE_SIZE, ...findManyOptions } = options

  const skip = Number((page - 1) * limit)
  const take = Number(limit)

  const [data, total] = await this.findAndCount({
    ...findManyOptions,
    skip,
    take,
  })

  const totalItems: number = total
  const itemCount: number = data.length
  const currentPage: number = page
  const totalPages: number = Math.ceil(total / limit)
  const nextPage = page < totalPages ? page + 1 : undefined
  const previousPage = page > 1 ? page - 1 : undefined

  return Paginate.from(data, {
    totalItems,
    itemCount,
    currentPage,
    totalPages,
    nextPage,
    prevPage: previousPage,
  })
}
