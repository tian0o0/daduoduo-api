import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity('topic')
export class TopicEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // @Index({ unique: true })
  // 废弃，因为 like '%xxx%' %开头不走索引查询
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
