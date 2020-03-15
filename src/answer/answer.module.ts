import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod
} from '@nestjs/common';
import { AnswerService } from './answer.service';
import { AnswerController } from './answer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnswerEntity } from './answer.entity';
import { AuthMiddleware } from '../user/auth.middleware';
import { UserModule } from '../user/user.module';
import { QuestionEntity } from '../question/question.entity';
import { CheckAnswerExistMiddleware } from './check-answer-exist.middleware';
import { CheckAnswerOwnerMiddleware } from './check-answer-owner.middleware';

@Module({
  imports: [
    TypeOrmModule.forFeature([AnswerEntity, QuestionEntity]),
    UserModule
  ],
  providers: [AnswerService],
  controllers: [AnswerController]
})
export class AnswerModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        {
          path: 'questions/:questionId(\\d+)/answers',
          method: RequestMethod.POST
        },
        {
          path: 'questions/:questionId(\\d+)/answers/:id(\\d+)',
          method: RequestMethod.PATCH
        },
        {
          path: 'questions/:questionId(\\d+)/answers/:id(\\d+)',
          method: RequestMethod.DELETE
        }
      )
      .apply(CheckAnswerExistMiddleware)
      .forRoutes('questions/:questionId(\\d+)/answers/:id(\\d+)')
      .apply(CheckAnswerOwnerMiddleware)
      .forRoutes(
        {
          path: 'questions/:questionId(\\d+)/answers/:id(\\d+)',
          method: RequestMethod.PATCH
        },
        {
          path: 'questions/:questionId(\\d+)/answers/:id(\\d+)',
          method: RequestMethod.DELETE
        }
      );
  }
}
