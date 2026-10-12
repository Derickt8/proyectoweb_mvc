import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Sale } from '../../sale/entities/sale.entity';

@Entity('sellers')
export class Seller {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 150 })
  name: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  email: string;

  @OneToMany(() => Sale, (sale) => sale.seller)
  sales: Sale[];
}
