import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Seller } from '../seller/entities/seller.entity';
import { Sale } from '../sale/entities/sale.entity';
import { CommissionRule } from '../commission-rule/entities/commission-rule.entity';

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(Seller)
    private readonly sellerRepository: Repository<Seller>,
    @InjectRepository(CommissionRule)
    private readonly ruleRepository: Repository<CommissionRule>,
    @InjectRepository(Sale)
    private readonly saleRepository: Repository<Sale>,
  ) {}

  async onModuleInit() {
    await this.seedData();
  }

  async seedData(): Promise<void> {
    const sellersCount = await this.sellerRepository.count();
    if (sellersCount === 0) {
      this.logger.log('Inicializando vendedores predeterminados...');
      const sellersToCreate = [
        { name: 'Perico P', email: 'perico.p@example.com' },
        { name: 'Zoila B', email: 'zoila.b@example.com' },
        { name: 'Aquiles C', email: 'aquiles.c@example.com' },
        { name: 'Johnny M', email: 'johnny.m@example.com' },
        { name: 'Anderson Guaman', email: 'anderson.guaman@example.com' },
      ];
      await this.sellerRepository.save(sellersToCreate);
      this.logger.log('Vendedores insertados con éxito.');
    }

    const rulesCount = await this.ruleRepository.count();
    if (rulesCount === 0) {
      this.logger.log('Inicializando reglas de comisión...');
      const rulesToCreate = [
        {
          ruleNumber: 1,
          minAmount: 500,
          percentage: 0.08,
          description: 'Regla 1: Monto >= $500 (8%)',
        },
        {
          ruleNumber: 2,
          minAmount: 600,
          percentage: 0.06,
          description: 'Regla 2: Monto >= $600 (6%)',
        },
        {
          ruleNumber: 3,
          minAmount: 700,
          percentage: 0.30,
          description: 'Regla 3: Monto >= $700 (30% bonificación especial)',
        },
        {
          ruleNumber: 4,
          minAmount: 800,
          percentage: 0.10,
          description: 'Regla 4: Monto >= $800 (10%)',
        },
        {
          ruleNumber: 5,
          minAmount: 1000,
          percentage: 0.15,
          description: 'Regla 5: Monto >= $1000 (15%)',
        },
      ];
      await this.ruleRepository.save(rulesToCreate);
      this.logger.log('Reglas de comisión insertadas con éxito.');
    }

    const salesCount = await this.saleRepository.count();
    if (salesCount === 0) {
      this.logger.log('Inicializando ventas de prueba...');
      const sellers = await this.sellerRepository.find();
      const perico = sellers.find((s) => s.name === 'Perico P');
      const zoila = sellers.find((s) => s.name === 'Zoila B');
      const aquiles = sellers.find((s) => s.name === 'Aquiles C');
      const anderson = sellers.find((s) => s.name === 'Anderson Guaman');
      const johnny = sellers.find((s) => s.name === 'Johnny M');

      const salesToCreate = [];

      if (perico) {
        salesToCreate.push(
          { saleDate: '2025-05-20', amount: 400.0, seller: perico, sellerId: perico.id },
          { saleDate: '2025-06-09', amount: 300.0, seller: perico, sellerId: perico.id },
        );
      }

      if (zoila) {
        salesToCreate.push(
          { saleDate: '2025-05-28', amount: 600.0, seller: zoila, sellerId: zoila.id },
          { saleDate: '2025-06-03', amount: 200.0, seller: zoila, sellerId: zoila.id },
        );
      }

      if (aquiles) {
        salesToCreate.push(
          { saleDate: '2025-06-11', amount: 900.0, seller: aquiles, sellerId: aquiles.id },
          { saleDate: '2025-06-11', amount: 1100.0, seller: aquiles, sellerId: aquiles.id },
        );
      }

      if (anderson) {
        salesToCreate.push(
          { saleDate: '2025-06-15', amount: 705.0, seller: anderson, sellerId: anderson.id },
        );
      }

      if (johnny) {
        salesToCreate.push(
          { saleDate: '2025-06-20', amount: 550.0, seller: johnny, sellerId: johnny.id },
        );
      }

      if (salesToCreate.length > 0) {
        await this.saleRepository.save(salesToCreate);
        this.logger.log('Ventas iniciales insertadas con éxito.');
      }
    }
  }
}
