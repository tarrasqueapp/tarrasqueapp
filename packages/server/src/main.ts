import { LogLevel, ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as Sentry from '@sentry/node';
import cookieParser from 'cookie-parser';
import { PrismaClientExceptionFilter, PrismaService } from 'nestjs-prisma';
import tus from 'tus-node-server';

import { AppModule } from './app.module';
import { config } from './config';
import { TEMP_PATH } from './storage/tmp.service';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: [
      'log',
      'warn',
      'error',
      config.NODE_ENV !== 'production' && 'debug',
      config.NODE_ENV !== 'production' && config.VERBOSE && 'verbose',
    ].filter(Boolean) as LogLevel[],
    cors: { origin: config.HOST, credentials: true },
  });

  // Trust nginx proxy
  app.set('trust proxy', true);

  // Add /api prefix to all routes except for /tus
  const apiPath = 'api';
  app.setGlobalPrefix(apiPath, { exclude: ['tus'] });

  // Validate all requests
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  // Enable shutdown hook
  const prismaService: PrismaService = app.get(PrismaService);
  prismaService.enableShutdownHooks(app);

  // Handle Prisma client exceptions
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

  // Cookie parser
  app.use(cookieParser(config.COOKIE_SECRET));

  // Setup tus
  const server = new tus.Server({ path: '/files', relativeLocation: true });
  server.datastore = new tus.FileStore({ directory: TEMP_PATH });
  app.use('/tus', server.handle.bind(server));

  // Setup Sentry
  Sentry.init({ dsn: config.SENTRY_DSN, enabled: config.SENTRY_ENABLED });

  // Setup swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Tarrasque API')
    .setDescription('Mobile-friendly & open-source virtual tabletop for Dungeons & Dragons')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(apiPath, app, document);

  // Start server
  await app.listen(3000);
}
bootstrap();
