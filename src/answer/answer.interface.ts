import { AnswerEntity } from './answer.entity';

export interface AnswerR0 {
  data: AnswerEntity[];
  count: number;
}

export type OrderBy = 'voteCount' | 'updatedAt';
