import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { CatalogueModule } from './catalogue/catalogue.module';
import { CartModule } from './cart/cart.module';
import { OrderModule } from './order/order.module';
import { AuthModule } from './auth/auth.module';
import { PaymentsModule } from './payments/payments.module';
import { HealthController } from './health/health.controller';
import { AdminModule } from './admin/admin.module';
import { AeosModule } from './aeos/aeos.module';
import { AgentsModule } from './agents/agents.module';
import { CollectionsModule } from './collections/collections.module';
import { BespokeModule } from './bespoke/bespoke.module';
import { WishlistModule } from './wishlist/wishlist.module';

import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

import { SubscribersModule } from './subscribers/subscribers.module';
import { ContactModule } from './contact/contact.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([{
      name: 'short',
      ttl: 1000,
      limit: 20,
    }, {
      name: 'medium',
      ttl: 60000,
      limit: 200,
    }]),
    AeosModule, AgentsModule, DatabaseModule, CatalogueModule, CartModule, OrderModule, AuthModule, PaymentsModule, AdminModule, WishlistModule, CollectionsModule, BespokeModule, SubscribersModule, ContactModule
  ],
  controllers: [HealthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
