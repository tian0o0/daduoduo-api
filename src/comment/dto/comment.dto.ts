import { IsNotEmpty } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty()
  content: string;

  rootCommentId: number;

  replyTo: number;
}

export class UpdateCommentDto {
  @IsNotEmpty()
  content: string;
}
