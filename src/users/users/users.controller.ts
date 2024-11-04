import { Controller, Get, Param, Put, Res, Delete, BadRequestException } from '@nestjs/common';
import { Response } from 'express';

@Controller('/api/users')
export class UsersController {

    @Get()
    getUsers(@Res() res: Response) {
        try {
            res.status(200).json({
                message: "Success get all users"
            })
        } catch (error) {
            res.status(400).json({
                message: "Failed get al users"
            })
        }
    }

    @Put(":id")
    editUser(@Param() id: string, @Res() res: Response) {
        try {
            res.status(200).json({
                message: "Success edit user"
            })
        } catch (error) {
            res.status(400).json({
                message: "Failed edit user"
            })
        }
    }

    @Delete(":id")
    deleteUser(@Param("id") id: string, @Res() res: Response) {
        try {
            res.status(200).json({
                
            })
        } catch (error) {
            res.status(400).json({

            })
        }
    }

}
