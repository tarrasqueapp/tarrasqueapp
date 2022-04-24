import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Hot reloading
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }

  // Add /api prefix to all routes
  app.setGlobalPrefix('api');

  // Setup swagger
  const config = new DocumentBuilder()
    .setTitle('Tarrasque API')
    .setDescription('Mobile-friendly virtual tabletop for Dungeons & Dragons')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Start server
  await app.listen(3001);
}
bootstrap();
