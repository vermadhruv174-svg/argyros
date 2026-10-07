import { Global, Module } from '@nestjs/common';
import { AeosService } from './aeos.service';

@Global()
@Module({
  providers: [AeosService],
  exports: [AeosService],
})
export class AeosModule {}
