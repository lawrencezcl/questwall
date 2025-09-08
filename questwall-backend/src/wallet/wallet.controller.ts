import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { WalletService } from './wallet.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('wallet')
@UseGuards(AuthGuard)
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post('connect/start')
  startConnect() {
    return this.walletService.startConnect();
  }

  @Post('tx/prepare')
  prepareTx(@Body() prepareTxDto: any) {
    return this.walletService.prepareTx(prepareTxDto);
  }

  @Post('tx/confirm')
  confirmTx(@Body() confirmTxDto: any) {
    return this.walletService.confirmTx(confirmTxDto);
  }

  @Get('tx/:id')
  getTxStatus(@Param('id') id: string) {
    return this.walletService.getTxStatus(id);
  }
}