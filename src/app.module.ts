import { Module } from '@nestjs/common';
import { ApiModule } from './api/api.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './config/prisma/prisma.module';

@Module({
  imports: [PrismaModule, ApiModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
