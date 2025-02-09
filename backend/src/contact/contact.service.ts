import { Injectable } from '@nestjs/common';
import { CreateContactDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class ContactService {
  constructor(
    private prismaService: PrismaService,
    private mailService: MailerService,
  ) {}

  async createContact(dto: CreateContactDto) {
    // Save the contact form data to the database
    const contact = await this.prismaService.contact.create({
      data: dto,
    });

    // Send an email using MailHog
    const mailText = `You have a new contact form submission from ${dto.name} (${dto.email}):\n\nSubject: ${dto.subject}\n\nMessage: ${dto.message}`;

    try {
      await this.mailService.sendMail({
        from: contact.email,
        to: 'your-email@example.com',
        subject: contact.subject,
        text: mailText,
      });
    } catch (e) {
      console.error(e);
      return { detail: 'Contact saved to the database' };
    }

    return { detail: 'Contact sent successfully' };
  }
}
