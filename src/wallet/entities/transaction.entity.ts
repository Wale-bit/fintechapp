import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../../auth/entities/user.entity';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @ManyToOne(() => User, (user) => user.transactions)
  user: User;

  @Column()
  amount: number;

  @Column()
  type: string;

  @Column({ type: 'varchar', length: 255, nullable: true }) // Explicitly define as varchar
  receiverEmail: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true }) // Explicitly define as varchar
  senderEmail: string | null;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}