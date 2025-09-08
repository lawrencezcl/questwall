import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { QuestsModule } from './quests/quests.module';
import { WalletModule } from './wallet/wallet.module';
import { RewardsModule } from './rewards/rewards.module';
import { AdsModule } from './ads/ads.module';
import { RiskModule } from './risk/risk.module';
import { BillingModule } from './billing/billing.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    AuthModule,
    QuestsModule,
    WalletModule,
    RewardsModule,
    AdsModule,
    RiskModule,
    BillingModule,
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}