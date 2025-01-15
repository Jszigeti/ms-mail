import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [MailService, PrismaService],
  controllers: [MailController],
})
export class MailModule {}
