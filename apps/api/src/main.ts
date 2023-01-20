import { LogLevel, ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { PrismaClientExceptionFilter, PrismaService } from 'nestjs-prisma';

import { AppModule } from './app/app.module';
import { config } from './config';
import { serializeUser } from './users/users.service';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: [
      'log',
      'warn',
      'error',
      config.NODE_ENV !== 'production' && 'debug',
      config.NODE_ENV !== 'production' && config.VERBOSE && 'verbose',
    ].filter(Boolean) as LogLevel[],
    cors: { origin: '*', credentials: false },
  });

  // Trust nginx proxy
  app.set('trust proxy', true);

  // Add /api prefix to all routes
  const apiPath = 'api';
  app.setGlobalPrefix(apiPath);

  // Validate all requests
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  // Enable shutdown hook
  const prismaService: PrismaService = app.get(PrismaService);
  prismaService.enableShutdownHooks(app);
  // Prisma middleware to hide password before sending to client
  prismaService.$use(async (params, next) => {
    const result = await next(params);
    if (params.model === 'User') {
      if (['findUnique', 'findUniqueOrThrow', 'update'].includes(params.action)) {
        return serializeUser(result);
      } else if (['findMany'].includes(params.action)) {
        return result.map(serializeUser);
      }
    }
    return result;
  });

  // Handle Prisma client exceptions
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

  // Cookie parser
  app.use(cookieParser(config.COOKIE_SECRET));

  // Setup swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Tarrasque API')
    .setDescription('Free & Open-Source Virtual Tabletop for Dungeons & Dragons')
    .setVersion(`v${config.VERSION}`)
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(apiPath, app, document);

  // Start server
  await app.listen(3333);
}
bootstrap();
