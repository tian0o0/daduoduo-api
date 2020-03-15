import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('topic')
export class TopicEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false
  })
  name: string;

  @Column({
    default: ''
  })
  avatar: string;

  @Column({
    default: ''
  })
  intro: string;
}
