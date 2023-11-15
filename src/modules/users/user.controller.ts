import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto } from './dto';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ description: 'Registration' })
  @ApiResponse({ type: CreateUserDto })
  @ApiOkResponse({ description: 'Successfully created user' })
  @ApiBadRequestResponse({ description: 'Incorrect registration data' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.create(createUserDto);
    return user;
  }

  @Get()
  @ApiOperation({ summary: 'Get all users', description: 'Retrieve all users' })
  @ApiOkResponse({ description: 'Successfully found users' })
  @ApiBadRequestResponse({ description: 'Users not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async findAll() {
    const users = await this.userService.findAll();
    return users;
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get user by ID',
    description: 'Retrieve a user by ID',
  })
  @ApiOkResponse({ description: 'Successfully found user' })
  @ApiBadRequestResponse({ description: 'User not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async findOne(@Param('id') id: string) {
    const user = await this.userService.findOne(id);
    return user;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user', description: 'Update a user by ID' })
  @ApiResponse({ type: UpdateUserDto })
  @ApiOkResponse({ description: 'Successfully updated user' })
  @ApiBadRequestResponse({ description: 'Incorrect update data.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const user = await this.userService.update(id, updateUserDto);
    return user;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user', description: 'Delete a user by ID' })
  @ApiOkResponse({ description: 'Successfully deleted user' })
  @ApiBadRequestResponse({ description: 'Incorrect user ID.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async remove(@Param('id') id: string) {
    const user = this.userService.remove(id);
    return user;
  }
}
