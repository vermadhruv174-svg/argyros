import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { CatalogueModule } from './catalogue/catalogue.module';
import { CartModule } from './cart/cart.module';
import { HealthController } from './health/health.controller';

@Module({
  imports: [DatabaseModule, CatalogueModule, CartModule],
  controllers: [HealthController],
})
export class AppModule {}
