import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
@Module({
  imports: [TypeOrmModule.forRootAsync({
    imports: [ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.local.env',
    })],
    useFactory: (configService: ConfigService) => ({
      type: 'postgres',
      host: configService.get('POSTGRES_HOST'),
      port: +configService.get<number>('POSTGRES_PORT'),
      username: configService.get('POSTGRES_USER'),
      password: configService.get('POSTGRES_PASSWORD'),
      database: configService.get('POSTGRES_DB'),
      entities: [__dirname + '/**/*.entity{.ts,.js}'], 
      synchronize: true,
    }),
    inject: [ConfigService],
  }), UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
