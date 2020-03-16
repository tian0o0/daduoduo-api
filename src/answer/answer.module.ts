import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
  forwardRef
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
    forwardRef(() => UserModule)
  ],
  providers: [AnswerService],
  controllers: [AnswerController],
  exports: [AnswerService]
})
export class AnswerModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        {
          path: '*/answers', // questions/:questionId(\\d+)
          method: RequestMethod.POST
        },
        {
          path: '*/answers/:id(\\d+)',
          method: RequestMethod.PATCH
        },
        {
          path: '*/answers/:id(\\d+)',
          method: RequestMethod.DELETE
        }
      )
      .apply(CheckAnswerExistMiddleware)
      .forRoutes('*/answers/:id(\\d+)')
      .apply(CheckAnswerOwnerMiddleware)
      .forRoutes(
        {
          path: '*/answers/:id(\\d+)',
          method: RequestMethod.PATCH
        },
        {
          path: '*/answers/:id(\\d+)',
          method: RequestMethod.DELETE
        }
      );
  }
}
