import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Ticket {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  subject!: string;

  @Column()
  message!: string;

  @Column()
  status!: 'new' | 'in_progress' | 'completed' | 'cancelled';

  @Column({ nullable: true })
  resolution?: string;

  @Column({ nullable: true })
  cancellationReason?: string;

  @Column()
  createdAt!: Date;
}