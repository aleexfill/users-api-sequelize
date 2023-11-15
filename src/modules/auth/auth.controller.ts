import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto';
import { JwtAuthGuard } from '../jwt/jwt-auth.guard';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'User registration',
    description: 'Register a new user',
  })
  @ApiResponse({ type: CreateUserDto })
  @ApiOkResponse({ description: 'Successfully registered user' })
  @ApiBadRequestResponse({ description: 'Invalid registration data' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    const user = await this.authService.register(createUserDto);
    return user;
  }

  @ApiOperation({
    summary: 'User login',
    description: 'Authenticate and log in a user',
  })
  @ApiOkResponse({ description: 'Successfully logged in user' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @Post('login')
  async login(@Body() loginUserDto: { email: string; password: string }) {
    try {
      const result = await this.authService.login(loginUserDto);
      if (!result) {
        throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
      }
      return result;
    } catch (error) {
      console.error('Login error:', error);
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Change user password',
    description: 'Change the password for the authenticated user',
  })
  @ApiOkResponse({ description: 'Successfully changed password' })
  @ApiBadRequestResponse({ description: 'Invalid request data' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @Post('change-password')
  async changePassword(
    @Request() req: any,
    @Body('newPassword') newPassword: string,
  ) {
    const pass = await this.authService.changePassword(
      req.user.userId,
      newPassword,
    );
    return pass;
  }
}
