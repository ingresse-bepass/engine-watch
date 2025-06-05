import { Controller, Post, Body, Res, Req, Logger } from '@nestjs/common';
import { IntelbrasService } from './intelbras.service';
const { networkInterfaces } = require('os');
const IS_ACTIVE = true;

let parsing = false;
@Controller('intelbras')
export class IntelbrasController {
  private readonly logger = new Logger(IntelbrasController.name);

  constructor(private readonly intelbrasService: IntelbrasService) {}

  @Post()
  async receiveIntelbrasEvent(@Body() data, @Res() res, @Req() req: Request) {
    console.log('event received');
    console.log(`is active ${IS_ACTIVE}`);

    const startTime = Date.now();

    if (data.length > 0) {
      const dataParsed = this.intelbrasService.parseData(data);
      if (dataParsed) {
        try {
          const jsonData = JSON.parse(dataParsed.replace('--myboundary--', ''));
          if (jsonData?.Events[0].Code === 'AccessControl') {
            this.intelbrasService.printDataReceived(jsonData);
            if (!parsing) {
              parsing = true;
              if (jsonData.Events[0].Data?.UserID) {
              } else if (jsonData.Events[0].Data?.Method == 1) {
                this.logger.warn(
                  `mifare event... ${jsonData.Events[0].Data.CardNo}`,
                );
                await this.intelbrasService.validateOnBeka(
                  jsonData?.Events[0]?.Data?.CardNo,
                  'card',
                );
              } else if (jsonData.Events[0].Data?.UserID) {
                this.logger.warn(
                  `face event... ${jsonData.Events[0].Data.UserID}`,
                );
                await this.intelbrasService.validateOnBeka(
                  jsonData?.Events[0]?.Data?.UserID,
                  'face',
                );
              } else if (jsonData.Events[0].Data?.CardNo) {
                this.logger.warn(
                  `qrcode event... ${jsonData.Events[0].Data.CardNo}`,
                );
                await this.intelbrasService.validateOnBeka(
                  jsonData?.Events[0]?.Data?.CardNo,
                  'qrcode',
                );
              }
              const endTime = Date.now();
              this.logger.log(
                `≽^•⩊•^≼ time to process.... ${
                  (endTime - startTime) / 60000
                } minutes`,
              );
              parsing = false;
            } else {
              this.logger.log('parsing true');
              this.logger.log('passou outro disco voador~');
            }
            res.status(200).send();
          }
        } catch (e) {
          this.logger.log(`error on intelbras controller ${e}`);
          res.status(200).send();
        }
      }
    } else {
      res.status(200).send();
    }
    res.status(200).send();
  }
}
