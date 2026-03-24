import { Injectable, NotFoundException } from '@nestjs/common';
import { IUser } from './user.interface';
import * as fs from 'fs';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  test(): [] {
    return [];
  }

  findAll(): IUser[] {
    const users = JSON.parse(
      fs.readFileSync('data/users.json', 'utf-8'),
    ) as IUser[];

    return users;
  }

  findOne(id: string, fields?: string[]): IUser | Partial<IUser> {
    const user = this.findAll().find((user) => user.id === id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!fields) {
      return user;
    } else {
      return fields.reduce((acc, field) => {
        if (field in user) {
          acc[field] = user[field as keyof IUser];
        }
        return acc;
      }, {} as Partial<IUser>);
    }
  }

  create(dto: CreateUserDto) {
    const users = JSON.parse(
      fs.readFileSync('data/users.json', 'utf-8'),
    ) as IUser[];

    const lastId = users[users.length - 1].id;
    const newId = (Number(lastId) + 1).toString();

    const newUser = {
      id: newId,
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      username: dto.username,
    };

    users.push(newUser);
    fs.writeFileSync('data/users.json', JSON.stringify(users, null, 2));
    return newUser;
  }
}
