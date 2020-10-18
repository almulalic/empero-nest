import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('tokens_customer_id_fk', ['identityId'], {})
@Entity('tokenlog', { schema: 'empero' })
export class TokenLog {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'identityId' })
  identityId: number;

  @Column('longtext', { name: 'token' })
  token: string;

  @Column('int', { name: 'tokenType' })
  tokenType: number;

  @Column('tinyint', { name: 'isValid', width: 1 })
  isValid: boolean;

  @Column('int', { name: 'duration' })
  duration: number;

  @Column('datetime', { name: 'expiresAt' })
  expiresAt: Date;

  @Column('timestamp', {
    name: 'createdAt',
    select: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column('timestamp', {
    name: 'modifiedAt',
    select: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  modifiedAt: Date;
}
