import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersController } from './users/users/users.controller';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';

@Module({
  imports: [AuthModule, UsersModule, PostsModule],
  controllers: [AppController, UsersController],
  providers: [AppService],
})
export class AppModule {}
