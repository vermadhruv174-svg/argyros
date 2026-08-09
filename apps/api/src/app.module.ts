import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { CatalogueModule } from './catalogue/catalogue.module';
import { HealthController } from './health/health.controller';

@Module({
  imports: [DatabaseModule, CatalogueModule],
  controllers: [HealthController],
})
export class AppModule {}
