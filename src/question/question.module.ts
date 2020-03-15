import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionController } from './question.controller';
import { QuestionService } from './question.service';
import { QuestionEntity } from './question.entity';
import { AuthMiddleware } from '../user/auth.middleware';
import { CheckQuestionExistMiddleware } from './check-question-exist.middleware';
import { UserModule } from '../user/user.module';
import { TopicEntity } from '../topic/topic.entity';
import { CheckQuestionOwnerMiddleware } from './check-question-owner.middleware';

@Module({
  imports: [
    TypeOrmModule.forFeature([QuestionEntity, TopicEntity]),
    UserModule
  ],
  controllers: [QuestionController],
  providers: [QuestionService]
})
export class QuestionModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: 'questions', method: RequestMethod.POST },
        { path: 'questions/:id(\\d+)', method: RequestMethod.PATCH },
        { path: 'questions/:id(\\d+)', method: RequestMethod.DELETE }
      )
      .apply(CheckQuestionExistMiddleware)
      .forRoutes({ path: 'questions/:id(\\d+)', method: RequestMethod.ALL })
      .apply(CheckQuestionOwnerMiddleware)
      .forRoutes(
        { path: 'questions/:id(\\d+)', method: RequestMethod.PATCH },
        { path: 'questions/:id(\\d+)', method: RequestMethod.DELETE }
      );
  }
}
