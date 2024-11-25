import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { RequestContext } from 'nestjs-request-context';
import { CustomPrismaClient } from 'src/prisma/types/type';

/**
 * Setting some isolated context for each request.
 */

export class AppRequestContext extends RequestContext {
  requestId!: string;
  transactionConnection?: TransactionHost<
    TransactionalAdapterPrisma<CustomPrismaClient>
  >; // For global transactions
}

export class RequestContextService {
  static getContext(): AppRequestContext {
    const ctx: AppRequestContext = RequestContext.currentContext.req;
    return ctx;
  }

  static setRequestId(id: string): void {
    const ctx = this.getContext();
    ctx.requestId = id;
  }

  static getRequestId(): string {
    return this.getContext().requestId;
  }

  static getTransactionConnection():
    | TransactionHost<TransactionalAdapterPrisma<CustomPrismaClient>>
    | undefined {
    const ctx = this.getContext();
    return ctx.transactionConnection;
  }

  static setTransactionConnection(
    transactionConnection?: TransactionHost<
      TransactionalAdapterPrisma<CustomPrismaClient>
    >,
  ): void {
    const ctx = this.getContext();
    ctx.transactionConnection = transactionConnection;
  }

  static cleanTransactionConnection(): void {
    const ctx = this.getContext();
    ctx.transactionConnection = undefined;
  }
}