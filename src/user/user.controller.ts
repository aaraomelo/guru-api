import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User as UserModel } from '@prisma/client';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) { }

  @Get()
  async getAllUsers(): Promise<UserModel[]> {
    return this.userService.users({
      where: {},
    });
  }

  @Get('filtered-users/:searchString')
  async getUserListWithCursor(
    @Param('searchString') searchString: string,
    @Query('take') take: string,
    @Query('cursor') cursor: string
  ): Promise<UserModel[]> {
    return this.userService.getCursorPaginationList(
      {
        take: Number(take),
        cursor: { id: Number(cursor) }
      },
      searchString
    )
  };

  @Post()
  async signupUser(
    @Body() userData: { name: string; email: string, password: string },
  ): Promise<UserModel> {
    return this.userService.createUser(userData);
  }

  @Put(':id')
  async updateUser(@Param('id') id: string, @Body() userData: UserModel): Promise<UserModel> {
    return this.userService.updateUser({
      where: { id: Number(id) },
      data: { ...userData },
    });
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<UserModel> {
    return this.userService.deleteUser({ id: Number(id) });
  }

}
