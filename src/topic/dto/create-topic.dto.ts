import { IsNotEmpty } from 'class-validator';

export class CreateTopicDto {

  @IsNotEmpty()
  readonly name: string;

  readonly avatar: string;
  readonly intro: string;
  
}