import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { QuestionEntity } from '../question/question.entity';
import { AnswerEntity } from '../answer/answer.entity';

@Entity('comment')
export class CommentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false
  })
  content: string;

  @ManyToOne(type => UserEntity, {
    eager: true
  })
  commentator: UserEntity;

  @ManyToOne(type => QuestionEntity)
  question: QuestionEntity;

  @ManyToOne(type => AnswerEntity)
  answer: AnswerEntity;

  // 二级评论
  @ManyToOne(
    type => CommentEntity,
    comment => comment.subComments,
    { onDelete: 'CASCADE' }
  )
  rootComment: CommentEntity;

  @OneToMany(
    type => CommentEntity,
    comment => comment.rootComment
  )
  subComments: CommentEntity[];

  @ManyToOne(type => UserEntity)
  replyTo: UserEntity;

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt: Date;
}
