import {
  Controller,
  Get,
  Post,
  Put,
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
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users', description: 'Retrieve all users' })
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get user by ID',
    description: 'Retrieve a user by ID',
  })
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update user', description: 'Update a user by ID' })
  @ApiResponse({ type: UpdateUserDto })
  @ApiOkResponse({ description: 'Successfully updated user' })
  @ApiBadRequestResponse({ description: 'Incorrect update data.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user', description: 'Delete a user by ID' })
  @ApiOkResponse({ description: 'Successfully deleted user' })
  @ApiBadRequestResponse({ description: 'Incorrect user ID.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
