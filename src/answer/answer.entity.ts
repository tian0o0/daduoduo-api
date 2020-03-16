import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { QuestionEntity } from '../question/question.entity';

@Entity('answer')
export class AnswerEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false
  })
  content: string;

  @ManyToOne(type => UserEntity, {
    eager: true
  })
  answerer: UserEntity;

  @ManyToOne(type => QuestionEntity)
  question: QuestionEntity;

  @Column({
    default: 0
  })
  voteCount: number;

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt: Date;
}
