import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { EntityNotFoundError, QueryFailedError } from 'typeorm';
import { Request, Response } from 'express';

import { AppError } from '../domain/app-error.base';

const PG = {
  UNIQUE_VIOLATION: '23505',
  FK_VIOLATION: '23503',
  NOT_NULL_VIOLATION: '23502',
  CHECK_VIOLATION: '23514',
} as const;

interface PgDriverError {
  code: string;
  constraint?: string;
  column?: string;
  detail?: string;
}

interface ErrorBody {
  statusCode: number;
  errorCode: string;
  message: string;
  timestamp: string;
  path: string;
}

@Catch()
export class GlobalHttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalHttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const body = this.resolveBody(exception, request.url);
    response.status(body.statusCode).json(body);
  }

  private resolveBody(exception: unknown, path: string): ErrorBody {
    const timestamp = new Date().toISOString();
    if (exception instanceof AppError) {
      this.logger.warn(`[${exception.errorCode}] ${exception.message}`);
      return {
        statusCode: exception.statusCode,
        errorCode: exception.errorCode,
        message: exception.message,
        timestamp,
        path,
      };
    }

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const res = exception.getResponse();
      return {
        statusCode: status,
        errorCode: HttpStatus[status] ?? 'HTTP_ERROR',
        ...(typeof res === 'object' ? res : { message: res }),
        timestamp,
        path,
      } as ErrorBody;
    }

    if (exception instanceof EntityNotFoundError) {
      this.logger.warn(`EntityNotFound: ${exception.message}`);
      return {
        statusCode: HttpStatus.NOT_FOUND,
        errorCode: 'NOT_FOUND',
        message: 'The requested resource was not found',
        timestamp,
        path,
      };
    }

    if (exception instanceof QueryFailedError) {
      return this.resolveQueryFailedError(exception as QueryFailedError<Error>, path, timestamp);
    }

    this.logger.error(
      'Unhandled exception',
      exception instanceof Error ? exception.stack : String(exception),
    );
    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      errorCode: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred',
      timestamp,
      path,
    };
  }

  private resolveQueryFailedError(
    exception: QueryFailedError<Error>,
    path: string,
    timestamp: string,
  ): ErrorBody {
    const pg = (exception as QueryFailedError<Error> & { driverError: PgDriverError }).driverError;
    const code = pg?.code;

    switch (code) {
      case PG.UNIQUE_VIOLATION: {
        const field = this.extractFieldFromConstraint(pg.constraint, pg.detail);
        this.logger.warn(`[DB_CONFLICT] unique violation on constraint "${pg.constraint}"`);
        return {
          statusCode: HttpStatus.CONFLICT,
          errorCode: 'DB_CONFLICT',
          message: field ? `${field} already exists` : 'A record with this value already exists',
          timestamp,
          path,
        };
      }

      case PG.FK_VIOLATION: {
        this.logger.warn(
          `[DB_FK_VIOLATION] foreign key violation on constraint "${pg.constraint}"`,
        );
        return {
          statusCode: HttpStatus.CONFLICT,
          errorCode: 'DB_FK_VIOLATION',
          message: 'Operation violates a referential integrity constraint',
          timestamp,
          path,
        };
      }

      case PG.NOT_NULL_VIOLATION: {
        this.logger.warn(`[DB_VALIDATION] not-null violation on column "${pg.column}"`);
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          errorCode: 'DB_VALIDATION',
          message: pg.column ? `Field "${pg.column}" is required` : 'A required field is missing',
          timestamp,
          path,
        };
      }

      case PG.CHECK_VIOLATION: {
        this.logger.warn(`[DB_VALIDATION] check constraint violation on "${pg.constraint}"`);
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          errorCode: 'DB_VALIDATION',
          message: 'The provided value does not satisfy a database constraint',
          timestamp,
          path,
        };
      }

      default: {
        this.logger.error(
          `[DB_ERROR] QueryFailedError code=${code ?? 'unknown'}: ${exception.message}`,
          exception.stack,
        );
        return {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          errorCode: 'DB_ERROR',
          message: 'A database error occurred',
          timestamp,
          path,
        };
      }
    }
  }

  private extractFieldFromConstraint(constraint?: string, detail?: string): string | null {
    if (detail) {
      const match = /Key \(([^)]+)\)/.exec(detail);
      if (match) {
        return match[1];
      }
    }
    if (constraint) {
      const parts = constraint.split('_');
      if (parts.length >= 2) {
        return parts[parts.length - 1];
      }
    }
    return null;
  }
}
