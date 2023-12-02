import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

describe('UserService', () => {
 let service: UserService;
 let userRepository: Repository<User>;
 let jwtService: JwtService;

 const mockUserRepository = {
   find: jest.fn(),
   findOne: jest.fn(),
   save: jest.fn(),
   delete: jest.fn(),
 };

 const mockJwtService = {
   signAsync: jest.fn(),
   verifyAsync: jest.fn(),
 };

 beforeEach(async () => {
   const module: TestingModule = await Test.createTestingModule({
     providers: [
       UserService,
       {
         provide: getRepositoryToken(User),
         useValue: mockUserRepository,
       },
       {
         provide: JwtService,
         useValue: mockJwtService,
       },
     ],
   }).compile();

   service = module.get<UserService>(UserService);
   userRepository = module.get<Repository<User>>(getRepositoryToken(User));
   jwtService = module.get<JwtService>(JwtService);
 });

 it('should be defined', () => {
   expect(service).toBeDefined();
 });
});
