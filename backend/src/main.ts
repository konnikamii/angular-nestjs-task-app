import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204
  });
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') ?? 8000;
  
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  
  await app.listen(port);
  console.log('App is running on port:', port);
}

bootstrap().catch( (error)=> {
  console.error('Error during bootstrap:', error);
})
