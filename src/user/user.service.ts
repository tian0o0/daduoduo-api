import {
  Injectable,
  BadRequestException,
  Scope,
  Inject,
  ConflictException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getRepository, DeleteResult } from 'typeorm';
import { UserEntity } from './user.entity';
import { CreateUserDto, LoginUserDto, UpdateUserDto } from './dto';
const jwt = require('jsonwebtoken');
import { SECRET } from '../config';
import { UserData } from './user.interface';
import { validate } from 'class-validator';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { HttpStatus } from '@nestjs/common';
import * as argon2 from 'argon2';
import { TopicEntity } from '../topic/topic.entity';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

@Injectable({ scope: Scope.REQUEST })
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(TopicEntity)
    private readonly topicRepository: Repository<TopicEntity>,
    @Inject(REQUEST)
    private readonly req: Request
  ) {}

  async listUsers(perPage: number, page: number): Promise<UserEntity[]> {
    return await getRepository(UserEntity)
      .createQueryBuilder('user')
      .take(perPage)
      .skip(page * perPage)
      .getMany();
  }

  async findByEmail(email: string): Promise<UserData> {
    const user = await this.userRepository.findOne({
      email
    });
    return this.buildUserRO(user);
  }

  async update(id: number, dto: UpdateUserDto): Promise<UserEntity> {
    let toUpdate = await this.userRepository.findOne(id);
    if (Reflect.has(dto, 'locations')) {
      dto.locations = await this.topicRepository.findByIds(dto.locations);
    }
    let updated = Object.assign(toUpdate, dto);
    return await this.userRepository.save(updated);
  }

  async findOne({ email, password }: LoginUserDto): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      select: ['id', 'password'], // 这里要加id，不然报错
      where: { email }
    });
    if (!user) {
      return null;
    }

    if (await argon2.verify(user.password, password)) {
      return user;
    }

    return null;
  }

  async create(dto: CreateUserDto): Promise<UserData> {
    // check uniqueness of username/email
    const { name, email, password } = dto;
    const qb = await getRepository(UserEntity)
      .createQueryBuilder('user')
      .where('user.name = :name', { name })
      .orWhere('user.email = :email', { email });

    const user = await qb.getOne();

    if (user) {
      throw new ConflictException('用户名或邮箱已存在');
    }

    // create new user
    let newUser = new UserEntity();
    newUser.name = name;
    newUser.email = email;
    newUser.password = password;

    const errors = await validate(newUser);
    if (errors.length > 0) {
      throw new BadRequestException('参数校验错误！');
    } else {
      const savedUser = await this.userRepository.save(newUser);
      return this.buildUserRO(savedUser);
    }
  }

  async delete(email: string): Promise<DeleteResult> {
    return await this.userRepository.delete({ email: email });
    // 删除成功返回200：
    // {
    // "raw": {
    // "fieldCount": 0,
    // "affectedRows": 0,
    // "insertId": 0,
    // "serverStatus": 34,
    // "warningCount": 0,
    // "message": "",
    // "protocol41": true,
    // "changedRows": 0
    // },
    // "affected": 1
    // }
  }

  async findById(id: number): Promise<UserEntity> {
    return await this.userRepository.findOne(id);
  }

  async listFollowing(id: number): Promise<UserEntity[]> {
    return (
      await this.userRepository.findOne(id, {
        relations: ['following']
      })
    ).following;
  }

  async listFollower(id: number): Promise<UserEntity[]> {
    return (
      await this.userRepository.findOne(id, {
        relations: ['followers']
      })
    ).followers;
  }

  async follow(id: number): Promise<void> {
    const selfId = this.req.user.id;
    const me = await this.userRepository.findOne(selfId, {
      relations: ['following']
    });
    if (!me.following.map(user => user.id).includes(id)) {
      const newFollowing = await this.userRepository.findOne(id);
      me.following.push(newFollowing);
      await this.userRepository.save(me);
    }
  }

  async unfollow(id: number): Promise<void> {
    const selfId = this.req.user.id;
    const me = await this.userRepository.findOne(selfId, {
      relations: ['following']
    });
    const index = me.following.map(user => user.id).indexOf(id);
    if (index > -1) {
      me.following.splice(index, 1);
      await this.userRepository.save(me);
    }
  }

  async followTopic(id: number): Promise<void> {
    const selfId = this.req.user.id;
    const me = await this.userRepository.findOne(selfId, {
      relations: ['followingTopics']
    });
    if (!me.followingTopics.map(topic => topic.id).includes(id)) {
      const newFollowingTopic = await this.topicRepository.findOne(id);
      me.followingTopics.push(newFollowingTopic);
      await this.userRepository.save(me);
    }
  }

  async unfollowTopic(id: number): Promise<void> {
    const selfId = this.req.user.id;
    const me = await this.userRepository.findOne(selfId, {
      relations: ['followingTopics']
    });
    const index = me.followingTopics.map(topic => topic.id).indexOf(id);
    if (index > -1) {
      me.followingTopics.splice(index, 1);
      await this.userRepository.save(me);
    }
  }

  public generateJWT(user) {
    let today = new Date();
    let exp = new Date(today);
    exp.setDate(today.getDate() + 60);

    return jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
        exp: exp.getTime() / 1000
      },
      SECRET
    );
  }

  private buildUserRO(user: UserEntity): UserData {
    return { ...user, token: this.generateJWT(user) };
  }
}
