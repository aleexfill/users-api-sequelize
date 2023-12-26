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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto } from './dto/request';
import { UserResponseDto } from './dto';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: 'Create user',
    description: 'Create a new user',
  })
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ description: 'Registration' })
  @ApiResponse({ type: CreateUserDto })
  @ApiOkResponse({ description: 'Successfully created user' })
  @ApiBadRequestResponse({ description: 'Incorrect registration data' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @ApiBearerAuth()
  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<CreateUserDto> {
    return await this.userService.create(createUserDto);
  }

  @ApiOperation({ summary: 'Get all users', description: 'Retrieve all users' })
  @ApiOkResponse({
    type: [UserResponseDto],
    description: 'Successfully found users',
  })
  @ApiBadRequestResponse({ description: 'Users not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @ApiBearerAuth()
  @Get()
  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.userService.findAll();
    return users.map(
      (user) =>
        new UserResponseDto(user.id, user.firstName, user.lastName, user.email),
    );
  }

  @ApiOperation({
    summary: 'Get user by ID',
    description: 'Retrieve a user by ID',
  })
  @ApiOkResponse({
    type: UserResponseDto,
    description: 'Successfully found user',
  })
  @ApiBadRequestResponse({ description: 'User not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @ApiBearerAuth()
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<UserResponseDto> {
    const user = await this.userService.findOne(id);
    return new UserResponseDto(
      user.id,
      user.firstName,
      user.lastName,
      user.email,
    );
  }

  @ApiOperation({ summary: 'Update user', description: 'Update a user by ID' })
  @ApiResponse({ type: UpdateUserDto })
  @ApiOkResponse({ description: 'Successfully updated user' })
  @ApiBadRequestResponse({ description: 'Incorrect update data.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data', 'application/json')
  @ApiBody({
    description: 'User update and avatar',
    type: UpdateUserDto,
  })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() avatar: Express.Multer.File,
  ): Promise<UpdateUserDto> {
    return await this.userService.update(id, updateUserDto, avatar);
  }

  @ApiOperation({ summary: 'Delete user', description: 'Delete a user by ID' })
  @ApiOkResponse({ description: 'Successfully deleted user' })
  @ApiBadRequestResponse({ description: 'Incorrect user ID.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @ApiBearerAuth()
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return await this.userService.remove(id);
  }
}
