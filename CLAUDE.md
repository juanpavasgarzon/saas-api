# CLAUDE.md

Este archivo proporciona orientación a Claude Code (claude.ai/code) al trabajar con el código de este repositorio.

## Agentes disponibles

> Usa siempre el agente correspondiente cuando la tarea encaje con su dominio.

- **prompt-engineer**: Diseñar, optimizar, evaluar o refinar prompts para LLMs. Úsalo para system prompts, few-shot examples, chain-of-thought, reducción de tokens, A/B testing de prompts y gestión de prompts en producción.
  Invócalo con: `use agent prompt-engineer`

- **database-optimization**: Optimización de consultas SQL, análisis de planes de ejecución (`EXPLAIN ANALYZE`), estrategias de índices, connection pooling, diseño de esquemas y monitoreo de rendimiento en PostgreSQL. Úsalo siempre que se creen, modifiquen o revisen queries o acciones contra la base de datos.
  Invócalo con: `use agent database-optimization`

## Skills disponibles

> Úsalas proactivamente cuando la tarea encaje con su especialidad.

- **nestjs-expert**: Arquitectura de módulos NestJS, dependency injection, guards, interceptors, pipes, middleware, testing con Jest/Supertest, integración TypeORM, autenticación con Passport/JWT. Úsala para cualquier problema de NestJS: decisiones de arquitectura, testing, performance o debugging de DI.
  Invócala con: `/nestjs-expert`

- **typescript-expert**: Type-level programming avanzado, tipos condicionales, generics, migración JS→TS, performance del compilador, monorepos con project references, herramientas modernas (Biome, Vitest). Úsala proactivamente para cualquier problema de TypeScript o JavaScript.
  Invócala con: `/typescript-expert`

- **senior-backend**: Diseño de APIs REST/GraphQL escalables, scaffolding, lógica de negocio, autenticación/autorización, optimización de base de datos y revisión de código backend (NodeJS, Express, Postgres). Úsala al diseñar APIs, implementar business logic o revisar código backend.
  Invócala con: `/senior-backend`

- **senior-security**: Arquitectura de seguridad, threat modeling, auditoría de seguridad, penetration testing, implementación de criptografía y compliance. Úsala al diseñar mecanismos de seguridad, revisar vulnerabilidades o implementar crypto.
  Invócala con: `/senior-security`

- **prompt-engineer**: Diseño y optimización de prompts para LLMs en producción: plantillas, evaluación, A/B testing, gestión de versiones y reducción de costos. Úsala cuando trabajemos en instrucciones para modelos o system prompts.
  Invócala con: `/prompt-engineer`

## Comandos

```bash
# Desarrollo
npm run start:dev          # Modo watch con hot reload
npm run docker:dev         # Stack completo (app + postgres + rabbitmq) via Docker

# Build y lint
npm run build              # Compilar TypeScript
npm run lint               # ESLint con auto-fix
npm run format             # Formatear con Prettier

# Pruebas
npm run test               # Ejecutar todas las pruebas unitarias
npm run test:watch         # Modo watch
npm run test:cov           # Reporte de cobertura
npm run test:e2e           # Pruebas end-to-end
# Ejecutar un solo archivo de prueba:
npx jest src/path/to/file.spec.ts

# Migraciones de base de datos
npm run migration:generate # Generar migración automática desde el diff de entidades
npm run migration:run      # Aplicar migraciones pendientes
npm run migration:revert   # Revertir la última migración
npm run migration:create   # Crear un archivo de migración vacío
```

## Arquitectura

API REST SaaS multi-tenant construida con **NestJS**, siguiendo los patrones **Domain-Driven Design (DDD)** y **CQRS**.

### Estructura de módulos

```text
src/
  core/                     # Infraestructura compartida transversal
    domain/                 # Clases base, errores, enums, contratos compartidos
    application/            # Contratos compartidos, tokens, eventos de integración
    infrastructure/         # Config, base de datos, mensajería, email, notificaciones, outbox
    presentation/           # Guards globales, filtros, decoradores, DTOs base
  modules/                  # Módulos de dominio de negocio
    identity/               # Auth (JWT), usuarios, invitaciones
    organization/           # Empresas, empleados, activos
    crm/                    # Clientes, prospectos, cotizaciones
    sales/                  # Negocios (deals), facturas
    procurement/            # Proveedores, requisiciones, órdenes, facturas, prospectos
    finance/                # Nómina, contabilidad
    inventory/              # Productos, bodegas, stock, movimientos
    projects/               # Workspace / gestión de proyectos
```

Cada módulo de negocio sigue una estructura estricta de cuatro capas:

```text
<modulo>/
  domain/         # Entidades (aggregate roots), value objects, eventos de dominio, errores, contratos, tokens
  application/    # Commands, queries, event handlers (handlers CQRS)
  infrastructure/ # Entidades ORM de TypeORM, implementaciones de repositorios, servicios externos
  presentation/   # Controladores HTTP, DTOs de request/response
```

### Patrones clave

#### CQRS con el módulo NestJS CQRS

- Los commands viven en `application/commands/<accion>/` — un `.command.ts` + un `.handler.ts` por acción.
- Las queries viven en `application/queries/<accion>/` — un `.query.ts` + un `.handler.ts` por acción.
- Los eventos de dominio (intra-proceso) se lanzan en aggregate roots con `entity.apply(new SomeEvent(...))` y se confirman con `publisher.mergeObjectContext(entity); entity.commit()`.

#### Patrón Repository con tokens de DI

- Cada aggregate tiene un contrato de interfaz en `domain/contracts/` y un token de inyección en `domain/tokens/`.
- La implementación TypeORM vive en `infrastructure/repositories/` y se vincula al token en el módulo.
- Todos los métodos de repositorio reciben `tenantId` como parámetro obligatorio — nunca consultar sin él.

#### Patrón Outbox para integración entre módulos

- Los event handlers de dominio escriben eventos de integración en la tabla `outbox_messages` via `IOutboxMessageRepository`.
- `OutboxPublisherService` hace polling cada 5 segundos y publica los mensajes pendientes a RabbitMQ.
- Usar este patrón siempre que un cambio de estado en un módulo deba disparar efectos secundarios en otro.

#### Manejo de errores

- Los errores de dominio extienden `AppError` (en `src/core/domain/app-error.base.ts`) y declaran `statusCode` + `errorCode`.
- El `GlobalHttpExceptionFilter` global mapea `AppError`, `HttpException` de NestJS, errores de TypeORM y errores del driver de PostgreSQL a respuestas JSON consistentes.
- Lanzar errores de dominio específicos desde los command handlers; nunca lanzar excepciones HTTP desde las capas domain/application.

#### Autorización

- `JwtAuthGuard` se aplica globalmente; marcar endpoints públicos con `@Public()`.
- `PermissionsGuard` se aplica globalmente; proteger endpoints con `@RequirePermission(Permission.XxxYyyZzz)`.
- Roles: `OWNER` (todos los permisos), `ADMIN` (la mayoría), `USER` (solo lectura). El mapeo está en `src/core/domain/enums/role-permissions.ts`.

#### Notificaciones en tiempo real

- Usar `NotificationService` (inyectado via token `INotificationService`) para enviar eventos a clientes conectados via Socket.io.

### Path aliases de TypeScript

```text
@core/*    → src/core/*
@modules/* → src/modules/*
@utils/*   → src/utils/*
```

### Variables de entorno

Variables requeridas (validadas al inicio via Joi en `src/core/infrastructure/config/config.validation.ts`):

| Variable | Descripción |
| --- | --- |
| `NODE_ENV` | `development` / `production` / `test` |
| `APP_PORT` | Puerto HTTP |
| `API_PREFIX` | Prefijo de URL (ej. `api`) |
| `DB_HOST/PORT/USERNAME/PASSWORD/NAME` | Conexión a PostgreSQL |
| `DB_SYNCHRONIZE` | `false` en todos los entornos (usar migraciones) |
| `DB_RUN_MIGRATIONS` | Ejecutar migraciones automáticamente al iniciar |
| `JWT_SECRET` / `JWT_EXPIRES_IN` | Token de acceso |
| `JWT_REFRESH_SECRET` / `JWT_REFRESH_EXPIRES_IN` | Token de refresco |
| `SMTP_HOST/PORT/USER/PASS/SECURE/FROM` | SMTP con Nodemailer |
| `RABBITMQ_URL` | Opcional, por defecto `amqp://guest:guest@localhost:5672` |

### Base de datos

- PostgreSQL 17, TypeORM 0.3, solo migraciones (`synchronize: false`).
- Las entidades ORM viven en `src/modules/**/infrastructure/entities/*.orm-entity.ts`.
- Las migraciones viven en `src/core/infrastructure/database/migrations/`.
- El `AppDataSource` usado por el CLI de TypeORM está en `src/core/infrastructure/database/data-source.ts`.
