import { Body, Controller, Res, Post, BadRequestException } from '@nestjs/common';
import { Response } from 'express'
import * as bcrypt from "bcryptjs"
import { v4 as uuid } from "uuid"
import * as fs from "fs"
import * as path from "path"
import { readUserData, writeUserData } from 'src/utils/utils';

type LoginBodyTypes = {
    email: string
    password: string
}

type RegisterBodyTypes = {
    name: string
    email: string
    password: string
}

@Controller('/api/auth')
export class AuthController {

    @Post("/login")
    async login(@Body() body: LoginBodyTypes, @Res() res: Response): Promise<any> {
        if(!body.email || !body.password) {
            throw new BadRequestException("All field is required")
        }
        const userData = readUserData()
        const checkExistUser = userData.find(obj => obj.email === body.email)
        if(!checkExistUser) {
            throw new BadRequestException("Email not found")
        }
        console.log(userData)
        const checkPassword = await bcrypt.compare(body.password, checkExistUser?.password)
        if(!checkPassword) {
            throw new BadRequestException("Password Incorrect")
        }
        try {
            res.status(200).json({
                message: "Success login"
            })
        } catch (error: any) {
            res.status(400).json({
                message: error.message || "Failed login"
            })
        }
    }


    @Post("/register")
    async register(@Body() body: RegisterBodyTypes, @Res() res: Response): Promise<any> {
        if(!body.name || !body.email || !body.password) {
            throw new BadRequestException("All field is required")
        }
        const userData = readUserData()
        const checkExistUser = userData.find(obj => obj.email === body.email)

        if(checkExistUser) {
            throw new BadRequestException("Email already registered")
        }
        
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(body.password, salt)
        const user = {
            id: uuid(),
            name: body.name,
            email: body.email,
            password: hashPassword,
            posts:[]
        }
        userData.push(user)
        writeUserData(JSON.stringify(userData))
        res.status(200).json({
            message: "Success create new user"
        })
    }

}
