import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

const JWT_SECRET = "secret";

@Module({
  imports: [TypeOrmModule.forFeature([User]), JwtModule.register({'secret': JWT_SECRET, signOptions: {expiresIn: '1d'}})],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
