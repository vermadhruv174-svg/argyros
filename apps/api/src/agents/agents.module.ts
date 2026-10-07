import { Module } from '@nestjs/common';
import { GiftFinderService } from './gift-finder.service';
import { GiftFinderController } from './gift-finder.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [GiftFinderService],
  controllers: [GiftFinderController],
})
export class AgentsModule {}
