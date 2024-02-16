import { User } from 'src/user/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

export enum PostStatus {
  DRAFT = 'draft',
  PUBLISH = 'publish',
}

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column({ default: PostStatus.DRAFT })
  status: PostStatus;

  @ManyToOne(() => User, user => user.posts)
  user: User;
}
