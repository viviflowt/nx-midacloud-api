import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import { ExcludeToPlainOnly } from '@mida/common'

@Entity({ database: 'default', schema: 'public' })
export class Contact extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  readonly id: string

  @Column({ nullable: true })
  @Index()
  name?: string

  @Column({ unique: true })
  @Index({ unique: true })
  email: string

  @CreateDateColumn({ update: false })
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @DeleteDateColumn()
  @ExcludeToPlainOnly()
  deletedAt?: Date
}
