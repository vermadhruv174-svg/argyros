import { Module } from '@nestjs/common';
import { BespokeService } from './bespoke.service';
import { BespokeController } from './bespoke.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [BespokeController],
  providers: [BespokeService],
  exports: [BespokeService],
})
export class BespokeModule {}
