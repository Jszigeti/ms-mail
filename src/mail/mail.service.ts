import { Injectable, NotFoundException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';
import { LogStatus } from '@prisma/client';
import { ISendMailResponse } from './types/ISendMailResponse';
import { SendMailDto } from './dto/send-mail.dto';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
  ) {
    // Create nodemailer transporter
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('MAIL_HOST'),
      port: this.configService.get<number>('MAIL_PORT'),
      auth: {
        user: this.configService.get('MAIL_USER'),
        pass: this.configService.get('MAIL_PASS'),
      },
    });
  }

  async send(data: SendMailDto): Promise<ISendMailResponse> {
    // Destructuring data
    const { userId, templateId, variables } = data;

    // Get template
    const templateContent = this.getTemplateContent(templateId);

    // Replace variables in selected template
    const compiledTemplate = this.replaceVariables(variables, templateContent);

    // Log mail in DB
    const emailLog = await this.prismaService.emailLog.create({
      data: {
        templateId,
        userId,
        status: LogStatus.PENDING,
      },
    });

    try {
      // Send mail
      await this.transporter.sendMail({
        from: this.configService.get('MAIL_USER'),
        to: variables['to'],
        subject: variables['subject'],
        html: compiledTemplate,
      });

      // Update log
      return await this.prismaService.emailLog.update({
        where: { id: emailLog.id },
        data: { status: LogStatus.SENT },
      });
    } catch (error: unknown) {
      console.error(`Error sending email: ${error}`);
      // Update log
      return await this.prismaService.emailLog.update({
        where: { id: emailLog.id },
        data: { status: LogStatus.FAILED },
      });
    }
  }

  private getTemplateContent(templateId: string): string {
    const templatePath = path.join(
      __dirname,
      '..',
      '..',
      'templates',
      `${templateId}.html`,
    );
    if (!fs.existsSync(templatePath))
      throw new NotFoundException(`Template ${templateId} not found`);
    return fs.readFileSync(templatePath, 'utf8');
  }

  private replaceVariables(
    variables: Record<string, string>,
    templateContent: string,
  ): string {
    return Object.entries(variables).reduce(
      (template, [key, value]) =>
        template.replace(new RegExp(`{{${key}}}`, 'g'), value),
      templateContent,
    );
  }
}
