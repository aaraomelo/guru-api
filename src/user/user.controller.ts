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
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

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
    @Body() userData: CreateUserDto,
  ): Promise<UserModel> {
    return this.userService.createUser(userData);
  }

  @Put(':id')
  async updateUser(@Param('id') id: string, @Body() userData: UpdateUserDto): Promise<UserModel> {
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
