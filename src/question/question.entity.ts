import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany,
  JoinTable
} from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { TopicEntity } from '../topic/topic.entity';

@Entity('question')
export class QuestionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false
  })
  title: string;

  @Column({
    default: ''
  })
  description: string;

  @ManyToOne(type => UserEntity, {
    eager: true
  })
  questioner: UserEntity;

  @Column()
  questionerId: number;

  @ManyToMany(type => TopicEntity, {
    eager: true
  })
  @JoinTable()
  topics: TopicEntity[];
}
