import type { Type } from '@nestjs/common'
import { HttpStatus, applyDecorators } from '@nestjs/common'
import {
  ApiExtraModels,
  ApiProperty,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger'
import { Exclude, Expose, plainToInstance } from 'class-transformer'
import { IsInt, IsOptional, Max, Min } from 'class-validator'
import { ObjectLiteral } from 'typeorm'

export const MAX_PAGE_SIZE = 100
export const DEFAULT_PAGE_SIZE = 10

export interface PaginateOptions {
  page?: number
  limit?: number
}

export type OrderBy = {
  field: string | true
  param: 'ASC' | 'DESC' | 'asc' | 'desc'
}

export class PaginatedQuery implements PaginateOptions {
  @ApiProperty({
    name: 'page',
    description: 'A page number within the paginated result set.',
    required: false,
    type: Number,
    default: 1,
    minimum: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  readonly page: number = 1

  @ApiProperty({
    name: 'limit',
    description: `'Maximum number of items returned per page. Default ${DEFAULT_PAGE_SIZE}. Max ${MAX_PAGE_SIZE}.`,
    required: false,
    type: Number,
    minimum: 1,
    maximum: MAX_PAGE_SIZE,
    default: DEFAULT_PAGE_SIZE,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(MAX_PAGE_SIZE)
  readonly limit: number = 10

  get skip(): number {
    return Number((this.page - 1) * this.take)
  }

  get take(): number {
    return Number(this.limit)
  }
}

@Exclude()
export class Meta {
  @ApiProperty({
    description:
      'Total number of records available satisfying query params criteria',
    type: Number,
  })
  @Expose()
  totalItems: number

  @ApiProperty({
    description:
      'Number of items returned in current page based in query params criteria',
    type: Number,
  })
  @Expose()
  itemCount: number

  @ApiProperty({
    description:
      'Current page number corresponding a page query param criteria',
    type: Number,
  })
  @Expose()
  currentPage: number

  @ApiProperty({
    description:
      'Number of pages corresponding a total items satisfying query params criteria divided by items per page corresponding a page query param criteria',
    type: Number,
  })
  @Expose()
  totalPages: number

  @ApiProperty({
    description:
      'A previous page number corresponding a page query param criteria',
    type: Number,
    nullable: true,
  })
  @Expose()
  prevPage?: number

  @ApiProperty({
    description: 'A next page number corresponding a page query param criteria',
    type: Number,
    nullable: true,
  })
  @Expose()
  nextPage?: number
}

@Exclude()
export class Paginate<Entity extends ObjectLiteral> {
  @ApiProperty({
    description: 'List of items returned in current page',
    isArray: true,
  })
  @Expose()
  readonly data: Entity[]

  @ApiProperty({
    description: 'Pagination metadata based in query params criteria',
    type: () => Meta,
  })
  @Expose()
  readonly meta: Meta

  constructor(data: Entity[], meta: Meta) {
    this.data = data
    this.meta = plainToInstance(Meta, meta, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    })
  }

  static from<Entity extends ObjectLiteral>(
    data: Entity[],
    meta: Meta,
  ): Paginate<Entity> {
    return new Paginate<Entity>(data, meta)
  }
}

const DEFAULT_DESCRIPTION =
  'Return a paginated set of items based in query params criteria.'

export interface ApiPaginateResponseOptions<
  Entity extends ObjectLiteral & Type<any> = any,
> {
  type: Entity
  description?: string
  status?: HttpStatus
}

export function ApiPaginateResponse<
  Entity extends ObjectLiteral & Type<any> = any,
>(options: ApiPaginateResponseOptions<Entity>) {
  const {
    type,
    description = DEFAULT_DESCRIPTION,
    status = HttpStatus.OK,
  } = options

  return applyDecorators(
    ApiExtraModels(Paginate, type),
    ApiResponse({
      status,
      description,
      schema: {
        allOf: [
          { $ref: getSchemaPath(Paginate) },
          {
            properties: {
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(type) },
              },
            },
          },
          {
            properties: {
              meta: { $ref: getSchemaPath(Meta) },
            },
          },
        ],
      },
    }),
  )
}
