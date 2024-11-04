import { Response } from 'express'
import { readUserData, writeUserData } from 'src/utils/utils'
import * as bcrypt from 'bcryptjs'
import { Controller, Get, Param, Put, Res, Delete, BadRequestException, Body } from '@nestjs/common'

type UserDataTypes = {
    name?: string
    email?: string
    password?: string
}

@Controller('/api/users')
export class UsersController {

    @Get()
    getUsers(@Res() res: Response) {
        const userData = readUserData()
        const transformData = userData.map(({password, ...obj}) => {
            return obj
        })
        res.status(200).json({
            message: "Success get users",
            data: transformData
        })
    }

    @Get(":userId")
    getUser(@Param("userId") userId: string, @Res() res: Response) {
        const userData = readUserData()
        let user = userData.find(obj => obj.id === userId)
        if(!user) {
            throw new BadRequestException("User not found")
        }
        delete user.password
        res.status(200).json({
            message: "Success get user",
            data: user
        })
    }

    @Put(":id")
    async editUser(@Param("id") id: string, @Body() body: UserDataTypes, @Res() res: Response) {
        const userData = readUserData()
        const user = userData.find(obj => obj.id === id)
        console.log(id)
        if(!user) {
            throw new BadRequestException("User not found")
        }
        const salt = await bcrypt.genSalt(10)
        let hashPassword
        if(body.password) {
            hashPassword = await bcrypt.hash(body.password, salt)
        } 
        body.password = hashPassword
        const transformData = userData.map(obj => {
            if(obj.id === id) {
                return {
                    ...obj,
                    ...body
                }
            } else {
                return obj
            }
        })
        writeUserData(JSON.stringify(transformData))
        res.status(200).json({
            message: "Success edit user"
        })
    }

    @Delete(":id")
    deleteUser(@Param("id") id: string, @Res() res: Response) {
        const userData = readUserData()
        const user = userData.find(obj => obj.id === id)
        if(!user) {
            throw new BadRequestException("User not found")
        }
        const transformData = userData.filter(obj => obj.id !== id)
        writeUserData(JSON.stringify(transformData))
        res.status(200).json({
            message: "Success delete user"
        })
    }

}
