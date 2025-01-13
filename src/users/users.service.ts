import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { hashing } from 'src/utils/bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const password = await hashing(createUserDto.password);
    createUserDto.password = password;
    createUserDto.email = createUserDto.email.toLowerCase();

    try {
      const existingUser = await this.usersRepository.findOne({
        where: { email: createUserDto.email },
      });

      if (existingUser) {
        throw new BadRequestException('User with this email already exists');
      }
      const user = this.usersRepository.create(createUserDto);
      const newUser = await this.usersRepository.save(user);
      return newUser;
    } catch (error) {
      console.error(error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to create user');
    }
  }

  async findAll(): Promise<User[]> {
    try {
      return await this.usersRepository.find({
        order: {
          createdAt: 'DESC',
        },
      });
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  }

  async findOne(uuid: string): Promise<User> {
    console.log(uuid);
    try {
      const user = await this.usersRepository.findOne({
        where: { uuid },
      });

      if (!user) {
        throw new NotFoundException(`User with ID ${uuid} not found`);
      }

      return user;
    } catch (error) {
      console.error(error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to fetch user');
    }
  }

  async update(uuid: string, updateUserDto: UpdateUserDto): Promise<User> {
    delete updateUserDto.password;
    try {
      const user = await this.findOne(uuid);
      if (updateUserDto.email && updateUserDto.email !== user.email) {
        const existingUser = await this.usersRepository.findOne({
          where: { email: updateUserDto.email },
        });

        if (existingUser) {
          throw new BadRequestException('Email already in use');
        }
      }
      updateUserDto.email = updateUserDto.email.toLowerCase();
      Object.assign(user, updateUserDto);
      return await this.usersRepository.save(user);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException('Failed to update user');
    }
  }

  async remove(uuid: string): Promise<string> {
    try {
      const user = await this.findOne(uuid);
      await this.usersRepository.remove(user);
      return `User id ${uuid} has been remove.`;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to delete user');
    }
  }

  async findByEmail(email: string): Promise<User> {
    try {
      const user = await this.usersRepository.findOne({
        where: { email },
      });

      if (!user) {
        throw new NotFoundException(`User with email ${email} not found`);
      }

      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to fetch user by email');
    }
  }

  async isEmailTaken(email: string): Promise<boolean> {
    try {
      const user = await this.usersRepository.findOne({
        where: { email },
      });
      return !!user;
    } catch (error) {
      console.error('Error checking email:', error);
      throw new BadRequestException('Failed to check email availability');
    }
  }
}
