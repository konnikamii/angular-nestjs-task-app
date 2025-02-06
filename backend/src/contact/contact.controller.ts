import { Body, Controller, HttpCode, Post, UseInterceptors } from '@nestjs/common';
import { ContactService } from './contact.service'; 
import {   NoFilesInterceptor } from '@nestjs/platform-express';
import { CreateContactDto } from './dto';

@Controller('api')
export class ContactController {
  constructor(private contactService: ContactService) {}

  @HttpCode(201)
  @Post('/contact/')
  @UseInterceptors(NoFilesInterceptor())
  createContact(@Body() dto: CreateContactDto) {
    return this.contactService.createContact(dto);
  }
}