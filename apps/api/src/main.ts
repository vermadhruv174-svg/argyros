import 'reflect-metadata';
import { ValidationPipe, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import express from 'express';
import helmet from 'helmet';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'warn', 'error'],
    rawBody: true,
  });

  app.setGlobalPrefix('api');

  app.enableCors({
    origin: true,
    credentials: true,
  });

  app.use(cookieParser());

  app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  }));

  app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));
  app.use(express.json({ limit: '10kb' }));
  app.use(express.urlencoded({ extended: true, limit: '10kb' }));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const port = process.env['PORT'] ?? 4000;
  await app.listen(port, '0.0.0.0');

  Logger.log(`Argyros API running on http://localhost:${port}/api`, 'Bootstrap');
}

void bootstrap();
