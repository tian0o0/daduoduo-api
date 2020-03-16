import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod
} from '@nestjs/common';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentEntity } from './comment.entity';
import { AuthMiddleware } from '../user/auth.middleware';
import { CheckCommentExistMiddleware } from './check-comment-exist.middleware';
import { CheckCommentOwnerMiddleware } from './check-comment-owner.middleware';
import { UserModule } from '../user/user.module';
import { AnswerEntity } from '../answer/answer.entity';
import { QuestionEntity } from '../question/question.entity';
import { UserEntity } from '../user/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CommentEntity,
      AnswerEntity,
      QuestionEntity,
      UserEntity
    ]),
    UserModule
  ],
  controllers: [CommentController],
  providers: [CommentService]
})
export class CommentModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        {
          path: '*/comments',
          method: RequestMethod.POST
        },
        {
          path: '*/comments/:id(\\d+)',
          method: RequestMethod.PATCH
        },
        {
          path: '*/comments/:id(\\d+)',
          method: RequestMethod.DELETE
        }
      )
      .apply(CheckCommentExistMiddleware)
      .forRoutes('*/comments/:id(\\d+)')
      .apply(CheckCommentOwnerMiddleware)
      .forRoutes(
        {
          path: '*/comments/:id(\\d+)',
          method: RequestMethod.PATCH
        },
        {
          path: '*/comments/:id(\\d+)',
          method: RequestMethod.DELETE
        }
      );
  }
}
