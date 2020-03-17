import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
  forwardRef
} from '@nestjs/common';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';
import { AuthMiddleware } from './auth.middleware';
import { TopicEntity } from '../topic/topic.entity';
import { CheckOwnMiddleware } from './check-owner.middleware';
import { CheckUserExistMiddleware } from './check-user-exist.middleware';
import { CheckTopicExistMiddleware } from '../topic/check-topic-exist.middleware';
import { TopicModule } from '../topic/topic.module';
import { QuestionEntity } from '../question/question.entity';
import { AnswerEntity } from '../answer/answer.entity';
import { CheckAnswerExistMiddleware } from '../answer/check-answer-exist.middleware';
import { AnswerModule } from '../answer/answer.module';

/**
 * userModule and TopicModule is the relationship of Circular dependency
 * cannot use: `imports: [TopicModule]`, but use `forwardRef` on each other
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      TopicEntity,
      QuestionEntity,
      AnswerEntity
    ]),
    forwardRef(() => TopicModule),
    forwardRef(() => AnswerModule)
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService]
})

// 包含 middleware 的模块必须实现 NestModule 接口
export class UserModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: 'users/login', method: RequestMethod.POST },
        { path: 'users', method: RequestMethod.POST }
      )
      .forRoutes(UserController)
      .apply(CheckOwnMiddleware)
      .forRoutes({ path: 'users/:id(\\d+)', method: RequestMethod.ALL })
      .apply(CheckUserExistMiddleware)
      .forRoutes({
        path: 'users/*follow/:id(\\d+)',
        method: RequestMethod.ALL
      })
      .apply(CheckTopicExistMiddleware)
      .forRoutes({
        path: 'users/*follow/topic/:id(\\d+)',
        method: RequestMethod.ALL
      })
      .apply(CheckAnswerExistMiddleware)
      .forRoutes('users/*answer/:id(\\d+)');
  }
}
