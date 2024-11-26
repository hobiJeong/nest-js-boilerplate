import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BootstrapService } from '@src/bootstrap.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const bootstrapService = app.get<BootstrapService>(BootstrapService);

  bootstrapService.setCors(app);
  bootstrapService.setSwagger(app);
  bootstrapService.setLogger(app);
  bootstrapService.setPathPrefix(app);
  bootstrapService.setInterceptors(app);
  bootstrapService.setPipe(app);
  bootstrapService.setExceptionFilters(app);
  bootstrapService.setShutdownHooks(app);

  await bootstrapService.startingServer(app);
}
bootstrap();
