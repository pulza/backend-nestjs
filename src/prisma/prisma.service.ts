import {
  Injectable,
  OnModuleInit,
  INestApplication,
  Logger,
} from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      log: [
        'error',
        {
          emit: 'event',
          level: 'query',
        },
        'warn',
      ],
    });
  }

  async onModuleInit(): Promise<void> {
    await this.$connect();

    process.on('query', async (e: Prisma.QueryEvent) => {
      this.logger.debug(
        `query: ${e.query} - params: ${e.params} - time: ${e.duration}ms`,
      );
    });
  }

  async enableShutdownHooks(app: INestApplication) {
    process.on('beforeExit', async () => {
      await app.close();
    });
  }
}
