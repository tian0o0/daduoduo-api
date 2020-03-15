import { TopicEntity } from '../../topic/topic.entity';

export class UpdateUserDto {
  readonly name?: string;
  readonly email?: string;
  readonly headline?: string;
  readonly avatar?: string;
  readonly password?: string;
  readonly gender?: string;
  readonly business?: number;
  locations?: TopicEntity[];
}
