import { Injectable, Logger } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import os from 'os';

@Injectable()
export class IntelbrasService {
  private readonly logger = new Logger(IntelbrasService.name);
  constructor(private readonly httpService: HttpService) {}

  parseData(raw_data: any) {
    const data_list = raw_data.toString().split('--myboundary\r\n');
    if (data_list) {
      let data;
      for (const a_info of data_list) {
        if (a_info.includes('Content-Type')) {
          const lines = a_info.split('\r\n');
          const a_type = lines[0].split(': ')[1];

          if (a_type == 'image/jpeg') {
            //pass
          } else {
            data = lines.slice(3, -1).join('\r\n');
          }
        }
      }
      return data;
    } else {
      return false;
    }
  }
  printDataReceived(jsonData: any) {
    this.logger.verbose(`name: ${jsonData.Events[0].Data?.CardName}`);
    this.logger.verbose(`card: ${jsonData.Events[0].Data?.CardNo}`);
    this.logger.verbose(`id: ${jsonData.Events[0].Data?.UserID}`);
    this.logger.verbose(`Method: ${jsonData.Events[0].Data?.Method}`);
  }

  async validateOnBeka(hash: string, type: string) {
    try {
      if (hash) {
        console.log('....validation on beka...');
        const body = {
          document: hash,
          checkInType: type,
          checkInDevice: process.env.TOTEM_ID,
          gateId: '7',
        };
        console.log(body);
        const response: any = await lastValueFrom(
          this.httpService.post(
            `http://192.168.7.7:3001/tickets/document`,
            body,
          ),
        );
        console.log(`beka response status ${response.status}`);
        console.log(`beka response ${JSON.stringify(response?.data)}`);
        return response?.data;
      } else {
        return false;
      }
    } catch (e) {
      console.error('error on beka.... o.O');
      console.error(JSON.stringify(e));
    }
  }
  async ledDoubleEntrance() {
    try {
      return await lastValueFrom(
        this.httpService.get('http://127.0.0.1:5000/doublentry'),
      );
    } catch (e) {
      return false;
    }
  }

  async ledAllowEntrance() {
    try {
      return await lastValueFrom(
        this.httpService.get('http://127.0.0.1:5000/allowed'),
      );
    } catch (e) {
      return false;
    }
  }

  async ledDenyEntrance() {
    try {
      return await lastValueFrom(
        this.httpService.get('http://127.0.0.1:5000/denied'),
      );
    } catch (e) {
      return false;
    }
  }

  getLocalIpAddresses(): string {
    const interfaces = os.networkInterfaces();
    if (interfaces.eth0) {
      for (const alias of interfaces.eth0) {
        if (alias.family === 'IPv4' && !alias.internal) {
          return alias.address;
        }
      }
    }
    return 'error-ip';
  }

  async sendTicketToASC(ticketId: any) {
    try {
      console.log('ticketId:', ticketId);
      console.log('TOTEM_ID:', process.env.TOTEM_ID);
      // Make a POST request to the API
      const response: any = await lastValueFrom(
        this.httpService.post(`http://192.168.5.10:6000/notify-entry`, {
          device: process.env.TOTEM_ID,
          idUser: ticketId,
        }),
      );

      // Extract the status and message from the response
      const { status, message } = response;

      console.log({ status: status });

      console.debug('miresponde:');
      console.log(response.data);

      // Return the message based on the status
      switch (status) {
        case 200:
          return `found`;
        case 404:
          return `not_found`;
        case 418:
          return `double_entrance`;
        case 421:
          return `wrong_gate`;
        default:
          return 'unknow';
      }
    } catch (error) {
      console.error(JSON.stringify(error));
      switch (error.response.status) {
        case 200:
          return `found`;
        case 404:
          return `not_found`;
        case 418:
          return `double_entrance`;
        case 421:
          return `wrong_gate`;
        default:
          return 'unknow';
      }
    }
  }
}
