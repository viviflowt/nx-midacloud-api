// import {
//   AfterLoad,
//   AfterUpdate,
//   BaseEntity,
//   Column,
//   CreateDateColumn,
//   DeleteDateColumn,
//   Entity,
//   Index,
//   PrimaryGeneratedColumn,
//   UpdateDateColumn,
// } from 'typeorm'

// import { Expose } from 'class-transformer'

// import { ExcludeToPlainOnly } from '@mida/common'
// import { AccountStatus } from '../interfaces/account'
// import { EmailTransformer, PasswordTransformer } from '../shared'

// @Entity({ database: 'default', schema: 'public' })
// export class Account extends BaseEntity {
//   @PrimaryGeneratedColumn('uuid')
//   readonly id: string

//   @Column({ unique: true, transformer: new EmailTransformer() })
//   @Index({ unique: true })
//   email: string

//   @Column({
//     type: 'enum',
//     enum: AccountStatus,
//     default: AccountStatus.ACTIVE,
//   })
//   @Expose({ groups: ['admin'] })
//   status: AccountStatus

//   @Column({ transformer: new PasswordTransformer() })
//   @ExcludeToPlainOnly()
//   password: string

//   @Column({ nullable: true })
//   @ExcludeToPlainOnly()
//   hashedRefreshToken?: string

//   @Column({ nullable: true })
//   @Expose({ groups: ['admin'] })
//   emailVerifiedAt?: Date

//   @Column({ nullable: true })
//   @Expose({ groups: ['admin'] })
//   emailVerificationToken?: string

//   @Column({ nullable: true })
//   @Expose({ groups: ['admin'] })
//   passwordResetToken?: string

//   @Column({ nullable: true })
//   @Expose({ groups: ['admin'] })
//   passwordResetSentAt?: Date

//   @Column({ nullable: true })
//   @Expose({ groups: ['admin'] })
//   emailVerificationSentAt?: Date

//   @CreateDateColumn({ update: false })
//   createdAt: Date

//   @UpdateDateColumn()
//   updatedAt: Date

//   @DeleteDateColumn()
//   @ExcludeToPlainOnly()
//   deletedAt?: Date

//   @AfterLoad()
//   async afterLoad() {
//     // this.previousPassword = this.password
//   }

//   @AfterUpdate()
//   async afterUpdate() {
//     //
//   }
// }

// // @VirtualColumn({
// //   query: (alias) =>
// //     Account.createQueryBuilder(alias)
// //       .select('state')
// //       .from('account_status_history', 'h')
// //       .where('h.accountId = account.id')
// //       .orderBy('h.changedAt', 'DESC')
// //       .limit(1)
// //       .getQuery(),
// // })
// // status: AccountStatus
