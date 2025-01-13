import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const apiPath = 'api';
  app.setGlobalPrefix(apiPath);

  const options = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Nest-js Swagger API Documentation')
    .setDescription(
      '[RPRO-9058-142] Online training Udemy - NestJS Masterclass - NodeJS Framework Backend Development',
    )
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(`${apiPath}/docs`, app, document);

  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
