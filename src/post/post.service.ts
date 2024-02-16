import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post, PostStatus } from './entities/post.entity';
import { faker } from '@faker-js/faker'; // Importing faker from Faker.js
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async seedData(): Promise<void> {
    const postData: Partial<Post>[] = [
      { title: 'Post 1', content: 'Content for Post 1', status: PostStatus.DRAFT },
      { title: 'Post 2', content: 'Content for Post 2', status: PostStatus.PUBLISH },
      { title: 'Post 3', content: 'Content for Post 3', status: PostStatus.PUBLISH },
      { title: 'Post 4', content: 'Content for Post 4', status: PostStatus.DRAFT },
    ];

    try {
      await this.postRepository.save(postData);
      Logger.log('Data seeded successfully');
    } catch (error) {
      Logger.error(`Error seeding data: ${error.message}`, error.stack);
    }
  }
  
  async seedDatawithFaker(): Promise<void> {
    const postData: Partial<Post>[] = [];
    const postCount = 10;

    // Generate fake data using Faker.js
    for (let i = 0; i < postCount; i++) {
      const title = faker.lorem.sentence();
      const content = faker.lorem.paragraph();
      // Alternating between draft and publish
      const status = i % 2 === 0 ? PostStatus.DRAFT : PostStatus.PUBLISH; 

      postData.push({ title, content, status });
    }

    try {
      await this.postRepository.save(postData);
      Logger.log('Data seeded successfully');
    } catch (error) {
      Logger.error(`Error seeding data: ${error.message}`, error.stack);
    }
  }
  
  // seed both users and posts
  async seedRelations() {
    await this.seedUsers();
    await this.seedPost();
  }

  //seed users
  async seedUsers() {
    const users = [];
    const numUsers = 10;
    for (let i = 0; i < numUsers; i++) {
      const user = new User();
      user.name = faker.person.fullName(); // Generating a fake full name
      user.bio = faker.person.bio(); // Generating a fake bio
      users.push(user);
    }
    // Saving users to the database
    await this.userRepository.save(users); 
  }

  // Seed posts
  async seedPost() {
    // Finding all users from the database
    const users = await this.userRepository.find(); 
    const posts = [];
    for (const user of users) {
      const numPosts = 20; // Generating 20 posts per user
      for (let i = 0; i < numPosts; i++) {
        const post = new Post();
        // Alternating between draft and publish status for each post
        const status = i % 2 === 0 ? PostStatus.DRAFT : PostStatus.PUBLISH; 

        post.title = faker.lorem.words(); // Generating a fake title
        post.content = faker.lorem.paragraph(); // Generating a fake content
        post.status = status;
        post.user = user; // Assigning the user to the post
        posts.push(post);
      }
    }
    // Saving posts to the database
    await this.postRepository.save(posts); 
  }
}
