import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { MailService } from './mail.service';
import { SendMailDto } from './dto/send-mail.dto';

@Controller()
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @MessagePattern('SEND_MAIL')
  async handleSendMail(data: SendMailDto): Promise<void> {
    await this.mailService.sendMail(data);
  }
}
