import { Module } from '@nestjs/common';
import { BespokeService } from './bespoke.service';
import { BespokeController } from './bespoke.controller';
import { DatabaseModule } from '../database/database.module';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [DatabaseModule, AuditModule],
  controllers: [BespokeController],
  providers: [BespokeService],
  exports: [BespokeService],
})
export class BespokeModule {}
