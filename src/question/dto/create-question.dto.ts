import { IsNotEmpty } from 'class-validator';
import { UserEntity } from '../../user/user.entity';
import { TopicEntity } from '../../topic/topic.entity';

export class CreateQuestionDto {
  @IsNotEmpty()
  title: string;

  description?: string;

  questioner: UserEntity;

  topics?: TopicEntity[];
}

export class UpdateQuestionDto {
  title?: string;

  description?: string;

  questioner: UserEntity;

  topics?: TopicEntity[];
}
