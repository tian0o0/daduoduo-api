import { NestFactory } from '@nestjs/core';
import { ApplicationModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from './shared/pipes/validation.pipe';

async function bootstrap() {
  const appOptions = { cors: true };
  const app = await NestFactory.create(ApplicationModule, appOptions);
  // app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ValidationPipe());

  const options = new DocumentBuilder()
    .setTitle('答多多：一个问答社区')
    .setDescription('Powered By NestJS. 联系我: xietian19941007@gmail.com')
    .setVersion('1.0')
    // .setBasePath('api/v1')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/docs', app, document);

  await app.listen(3000);
}
bootstrap();
