import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
  forwardRef
} from '@nestjs/common';
import { TopicService } from './topic.service';
import { TopicController } from './topic.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TopicEntity } from './topic.entity';
import { AuthMiddleware } from '../user/auth.middleware';
import { UserModule } from '../user/user.module';
import { TopicMiddleware } from './topic.middleware';

@Module({
  imports: [
    TypeOrmModule.forFeature([TopicEntity]),
    forwardRef(() => UserModule)
  ],
  providers: [TopicService],
  controllers: [TopicController],
  exports: [TopicService]
})
export class TopicModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: 'topics', method: RequestMethod.POST },
        { path: 'topics', method: RequestMethod.PATCH }
      )
      .apply(TopicMiddleware)
      .exclude(
        { path: 'topics', method: RequestMethod.GET },
        { path: 'topics', method: RequestMethod.POST }
      )
      .forRoutes(TopicController);
  }
}
