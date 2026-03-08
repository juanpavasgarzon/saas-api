import { type INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setUpSwagger(app: INestApplication): void {
  const swaggerConfig = new DocumentBuilder()
    .setTitle('SaaS ERP API')
    .setVersion('1.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT', in: 'header' }, 'JWT')
    .addTag('CRM', 'Customer relationship management')
    .addTag('Finance', 'Financial management and accounting')
    .addTag('Identity', 'User and access management')
    .addTag('Organization', 'Organization and team management')
    .addTag('Procurement', 'Procurement and vendor management')
    .addTag('Projects', 'Project management and collaboration')
    .addTag('Sales', 'Sales and order management')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });
}
