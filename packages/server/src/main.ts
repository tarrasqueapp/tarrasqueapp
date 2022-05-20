import { LogLevel, ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { PrismaClientExceptionFilter, PrismaService } from 'nestjs-prisma';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: [
      'log',
      'warn',
      'error',
      ...((process.env.NODE_ENV !== 'production' ? ['debug', 'verbose'] : []) as LogLevel[]),
    ],
  });

  // Add /api prefix to all routes
  const apiPath = process.env.BASE_PATH ? process.env.BASE_PATH.slice(1) + '/api' : 'api';
  app.setGlobalPrefix(apiPath);

  // Validate all requests
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  // Enable shutdown hook
  const prismaService: PrismaService = app.get(PrismaService);
  prismaService.enableShutdownHooks(app);

  // Handle Prisma client exceptions
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

  // Cookie parser
  app.use(cookieParser(process.env.COOKIE_SECRET));

  // Setup swagger
  const config = new DocumentBuilder()
    .setTitle('Tarrasque API')
    .setDescription('Mobile-friendly & open-source virtual tabletop for Dungeons & Dragons')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(apiPath, app, document);

  // Start server
  await app.listen(10000);
}
bootstrap();
