import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  JoinColumn,
  RelationCount
} from 'typeorm';
import { IsEmail } from 'class-validator';
import * as argon2 from 'argon2';
// import { ArticleEntity } from '../article/article.entity';
import { TopicEntity } from '../topic/topic.entity';

enum Gender {
  Male = 'male',
  Female = 'female'
}

enum Diploma {
  One,
  Two,
  Three,
  Four,
  Five
}

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    nullable: false
  })
  @IsEmail()
  email: string;

  @Column({ default: '' })
  avatar: string;

  @Column({ default: '' })
  headline: string;

  @Column({
    nullable: false,
    default: Gender.Male
  })
  gender: Gender;

  @Column({
    select: false
  })
  password: string;

  @BeforeInsert()
  async hashPassword() {
    this.password = await argon2.hash(this.password);
  }

  @OneToOne(type => TopicEntity, {
    eager: true
  })
  @JoinColumn()
  business: TopicEntity;

  @ManyToMany(type => TopicEntity, {
    eager: true, // 自动加载
    cascade: true // 自动保存
  })
  @JoinTable()
  locations: TopicEntity[];

  @ManyToMany(
    type => UserEntity,
    user => user.following
  )
  @JoinTable()
  followers: UserEntity[];

  @ManyToMany(
    type => UserEntity,
    user => user.followers
  )
  following: UserEntity[];

  @RelationCount((user: UserEntity) => user.followers)
  followersCount: number;

  @RelationCount((user: UserEntity) => user.following)
  followingCount: number;

  @ManyToMany(type => TopicEntity)
  @JoinTable()
  followingTopics: TopicEntity[];

  // @OneToOne(type => TopicEntity)
  // @JoinColumn()
  // employments: {
  //   company: TopicEntity,
  //   job: TopicEntity
  // }[]

  // @OneToOne(type => TopicEntity)
  // @JoinColumn()
  // educations: {
  //   school: TopicEntity,
  //   major: TopicEntity,
  //   entryYear: number,
  //   graduationYear: number,
  //   diploma: Diploma
  // }[]
}
