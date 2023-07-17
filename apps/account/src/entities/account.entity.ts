import {
  AfterLoad,
  AfterUpdate,
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import { Expose } from 'class-transformer'

import { ExcludeToPlainOnly } from '@mida/common'
import { AccountStatus } from '../interfaces/account'

@Entity({ database: 'default', schema: 'public' })
export class Account extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  readonly id: string

  @Column({ unique: true })
  @Index({ unique: true })
  email: string

  @Column({
    type: 'enum',
    enum: AccountStatus,
    default: AccountStatus.ACTIVE,
  })
  @Expose({ groups: ['admin'] })
  status: AccountStatus

  @Column({})
  @ExcludeToPlainOnly()
  hashedPassword: string

  @CreateDateColumn({ update: false })
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @DeleteDateColumn()
  @ExcludeToPlainOnly()
  deletedAt?: Date

  @AfterLoad()
  async afterLoad() {
    // this.previousPassword = this.password
  }

  @AfterUpdate()
  async afterUpdate() {
    //
  }
}

// @VirtualColumn({
//   query: (alias) =>
//     Account.createQueryBuilder(alias)
//       .select('state')
//       .from('account_status_history', 'h')
//       .where('h.accountId = account.id')
//       .orderBy('h.changedAt', 'DESC')
//       .limit(1)
//       .getQuery(),
// })
// status: AccountStatus
