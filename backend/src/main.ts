import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllExceptionFilter } from './common/filters/all-exception.filter';
import { TimeoutInterceptor } from './common/interceptors/timeout.interceptor';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.useGlobalFilters(new AllExceptionFilter());
  app.useGlobalInterceptors(new TimeoutInterceptor(30000));

  const allowedOrigins = process.env.CORS_ALLOWED_ORIGINS
    ? JSON.parse(process.env.CORS_ALLOWED_ORIGINS)
    : [
        'http://localhost:4200',
        'http://localhost:3000',
        'https://localhost:4200',
      ];

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('API Calculadora de Comisiones')
    .setDescription(
      'Microservicio backend NestJS con TypeORM para cálculo de comisiones por ventas y vendedores.',
    )
    .setVersion('1.0.0')
    .addTag('Commissions')
    .addTag('Sales')
    .addTag('Sellers')
    .addTag('Commission Rules')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  logger.log(`Backend de Comisiones corriendo en: http://localhost:${port}`);
  logger.log(`Documentación Swagger interactiva: http://localhost:${port}/api/docs`);
}

bootstrap();
