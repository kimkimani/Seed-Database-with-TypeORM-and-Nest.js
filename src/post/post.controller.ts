import { Controller, Get} from '@nestjs/common';
import { PostService } from './post.service';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get('seed')
  async  seedData(): Promise<string> {
    await this.postService.seedData();
    return 'Database seeded successfully!';
  }
  
  @Get('seed/relations')
  async seedRelations() {
    await this.postService.seedRelations();
    return { message: 'Database seeded successfully.' };
  }

  @Get('seed/faker')
  async  seedDatawithFaker(): Promise<string> {
    await this.postService.seedDatawithFaker();
    return 'Database seeded successfully!';
  }
} 
