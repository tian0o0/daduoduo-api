import { IsNotEmpty } from 'class-validator';

export class CreateAnswerDto {
  @IsNotEmpty()
  content: string;
}

export class UpdateAnswerDto {
  @IsNotEmpty()
  content: string;
}
