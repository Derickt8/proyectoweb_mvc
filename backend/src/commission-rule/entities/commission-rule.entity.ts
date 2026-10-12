import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('commission_rules')
export class CommissionRule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int', unique: true })
  ruleNumber: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  minAmount: number;

  @Column({ type: 'decimal', precision: 5, scale: 4 })
  percentage: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  description: string;
}
