import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { htmlEmailFormat } from './email.template';
import { User } from '@prisma/client';

interface EmailOptions {
  from?: string;
  to: string;
  user?: User;
  frontendUrl?: string;
  baseTitle?: string;
  title: string;
  actionLink?: string;
  actionText?: string;
  logoUrl?: string;
  description?: string;
  highlightedText?: string;
}

@Injectable()
export class EmailService {
  public constructor(private configService: ConfigService) {}
  private getEmailTransporter() {
    const transporter = createTransport({
      host: this.configService.get('EMAIL_SERVER'),
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: this.configService.get('EMAIL_USERNAME'), // generated ethereal user
        pass: this.configService.get('EMAIL_PASSWORD'), // generated ethereal password
      },
    });
    return transporter;
  }

  async sendEmail(options: EmailOptions) {
    if (!options.baseTitle) {
      options.baseTitle = 'San community';
    }
    if (!options.logoUrl) {
      options.logoUrl =
        this.configService.get('FRONTEND_URL') +
        '/assets/lib/assets/images/logo.png';
    }
    if (!options.frontendUrl) {
      options.frontendUrl = this.configService.get('FRONTEND_URL');
    }
    let transporter = this.getEmailTransporter();
    let html = htmlEmailFormat(options);
    let result = await transporter.sendMail({
      subject: options.title,
      html,
      to: options.to,
      sender: this.configService.get('EMAIL_USERNAME'),
    });
    return result;
  }
}