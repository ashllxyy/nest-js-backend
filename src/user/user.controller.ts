import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { Response, Request } from 'express';
import { Res } from '@nestjs/common';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto, @Res({passthrough: true}) response: Response) {      
    let token = await this.userService.register(createUserDto);
    response.cookie('jwt', token, {httpOnly: true});
    return "User created successfully!";
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto, @Res({passthrough: true}) response: Response) {  
    let token = await this.userService.login(loginUserDto);
    response.cookie('jwt', token, {httpOnly: true});
    return "User logged in Successfully!"
  }

  @Get('authorize')
  async authorize(@Req() request: Request) {
    let token = request.cookies['jwt'];
    let user = await this.userService.authorize(token);
    return user;
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOneById(@Param('id') id: string) {
    return this.userService.findOneById(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Req() request: Request) {
    return this.userService.update(+id, updateUserDto, request);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
