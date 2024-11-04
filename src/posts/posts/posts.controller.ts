import { Controller, Get, Res, Post, Put, Delete, Param } from '@nestjs/common';
import { Response } from 'express';

@Controller('/api/posts')
export class PostsController {

    @Get()
    getAllPost(@Res() res: Response) {
        try {
            
        } catch (error) {
            
        }
    }

    @Post("/:userId/posts")
    addNewPost(@Param("userId") userId: string, @Res() res: Response) {
        try {
            
        } catch (error) {
            
        }
    }

    @Put(":postId")
    editPost(@Param("postId") postId: string, @Res() res: Response) {
        try {
            
        } catch (error) {
            
        }
    }


    @Delete(":postId")
    deletePost(@Param("postId") postId: string) {
        try {
            
        } catch (error) {
            
        }
    }

}
