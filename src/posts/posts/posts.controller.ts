import { Controller, Get, Res, Post, Put, Delete, Param, Body, BadRequestException } from '@nestjs/common';
import { Response } from 'express'
import { v4 as uuid } from 'uuid'
import { readPostData, readUserData,  writeUserData, writePostData } from 'src/utils/utils'

type PostBodyTypes = {
    title: string
    content: string
}

type PostBodyTypesEdit = {
    title?: string
    content?: string
}

@Controller('/api/posts')
export class PostsController {

    @Get()
    getAllPost(@Res() res: Response) {
        const postData = readPostData()
        res.status(200).json({
            message: "Success get post data",
            data: postData
        })
    }

    @Post("/:userId/post")
    addNewPost(@Param("userId") userId: string, @Body() body:PostBodyTypes, @Res() res: Response) {
        if(!body.title || !body.content) {
            throw new BadRequestException("All field is required")
        }
        const postsData = readPostData()
        const userData = readUserData()
        let user = userData.find(obj => obj.id === userId)
        if(!user) {
            throw new BadRequestException("User not found")
        }
        let newPost = {
            id: uuid(),
            date: new Date(),
            ...body,
        }
        user.posts.push(newPost)
        const transformUserData = userData.map(obj => {
            if(obj.id === userId) {
                return {
                    ...obj,
                    ...user
                }
            } else {
                return obj
            }
        })
        postsData.push({
            ...newPost,
            author: {
                userId
            }
        })
        writePostData(JSON.stringify(postsData))
        writeUserData(JSON.stringify(transformUserData))
        res.status(200).json({
            message: `Success add new post from userId: ${userId}`
        })
    }

    @Put("/:userId/update/:postId")
    editPost(@Param() param: {userId: string, postId: string}, @Body() body: PostBodyTypesEdit, @Res() res: Response) {
        const postData = readPostData() 
        const userData = readUserData()

        const user = userData.find(obj => obj.id === param.userId)
        if(!user) {
            throw new BadRequestException("User not found")
        }
        const post = postData.find(obj => obj.id === param.postId) 
        if(!post) {
            throw new BadRequestException("Post not found")
        }
        
        const transformPostsData = postData.map(obj => {
            if(obj.id === param.postId) {
                return {
                    ...obj,
                    ...body
                }
            } else {
                return obj
            }
        })
        const transformUserData = userData.map(obj => {
            if(obj.id === param.userId) {
                return {
                    ...obj,
                    posts: user.posts.map(obj => {
                        if(obj.id === param.postId) {
                            return {
                                ...obj,
                                ...body
                            }
                        } else {
                            return obj
                        }
                    })
                }
            } else {
                return obj
            }
        })
        writePostData(JSON.stringify(transformPostsData))
        writeUserData(JSON.stringify(transformUserData))
        res.status(200).json({
            message: `Success update post with postId = ${param.postId} and userId = ${param.userId}`
        })
    }


    @Delete("/:userId/delete/:postId")
    deletePost(@Param() param: {userId: string, postId: string}, @Res() res: Response) {
        const postData = readPostData()
        const userData = readUserData()

        const user = userData.find(obj => obj.id === param.userId)
        if(!user) {
            throw new BadRequestException("User not found")
        }
        const post = postData.find(obj => obj.id === param.postId) 
        if(!post) {
            throw new BadRequestException("Post not found")
        }

        const transformPostsData = postData.filter(obj => obj.id !== param.postId) 
        const transformUserData = userData.map(obj => {
            if(obj.id === param.userId) {
                return {
                    ...obj,
                    posts: user.posts.filter(obj => obj.id !== param.postId)
                }
            } else {
                return obj
            }
        })
        writePostData(JSON.stringify(transformPostsData))
        writeUserData(JSON.stringify(transformUserData))

        res.status(200).json({
            message: `Success delete post with postId = ${param.postId} and userId = ${param.userId}`
        })
    }

}
