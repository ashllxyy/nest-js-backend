import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { BadRequestException, UnauthorizedException} from '@nestjs/common';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private jwtService: JwtService){}

  async register(createUserDto: CreateUserDto) {
    let user = new User();
    user.name = createUserDto.name;
    user.email = createUserDto.email;
    let findUser = await this.findOneByMail(createUserDto.email);
    if(findUser){
      throw new BadRequestException('User already exists! Try a different email.');
    }
    const hashPassword = await bcrypt.hash(createUserDto.password, 12);
    user.password = hashPassword;
    await this.userRepository.save(user);

    const jwt = await this.jwtService.signAsync({id: user.id});

    return jwt;
  }

  async login(loginUserDto: LoginUserDto){
    let findUser = await this.findOneByMail(loginUserDto.email);

    if(!findUser){
      throw new BadRequestException('Invalid Credentials');
    }
  
    if(!await bcrypt.compare(loginUserDto.password, findUser.password)){
      throw new BadRequestException('Invalid Credentials');
    }

    const jwt = await this.jwtService.signAsync({id: findUser.id});
    return jwt;
  }

  async authorize(token: string){
    try{
      const user = await this.jwtService.verifyAsync(token);
      if(!user){
        throw new BadRequestException('Invalid Credentials');
      }
      return user;
    }catch(e){
      throw new BadRequestException('Invalid Credentials');
    }
  }

  findAll() : Promise<User[]>{
    return this.userRepository.find();
  }

  findOneById(id: number) : Promise<User> {
    return this.userRepository.findOneBy({id: id});
  }
  
  findOneByMail(email: string) : Promise<User> {
    return this.userRepository.findOneBy({email: email});
  }

  async update(id: number, updateUserDto: UpdateUserDto, request: Request) {
    const Authuser = await this.authorize(request.cookies['jwt']);
    if(Authuser.id != id){
      throw new UnauthorizedException('You are not authorized to update this user!');
    }
    let user = new User();
    user.name = updateUserDto.name;
    user.email = updateUserDto.email;
    const newhashPassword = await bcrypt.hash(updateUserDto.password, 12);
    user.password = newhashPassword;
    user.id = id;

    return this.userRepository.save(user);
  }

  remove(id: number) {
    return this.userRepository.delete(id);
  }
}
