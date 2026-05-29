import { Controller, Post, Body } from '@nestjs/common';
import { BlockchainService } from './blockchain.service';

@Controller('blockchain')
export class BlockchainController {
  constructor(private readonly blockchainService: BlockchainService) {}

  @Post('mint')
  async mint(@Body() body: { farmerWalletAddressHex: string; amountTonnes: number }) {
    return this.blockchainService.mintCarbonCredit(body.farmerWalletAddressHex, body.amountTonnes);
  }
}
