import { BadRequestException, Body, Controller, HttpCode, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { USER_EXISTS } from './auth.constants';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {

	constructor(
		private readonly authService: AuthService
	) {}

	@UsePipes(new ValidationPipe())
	@Post('register')
	async register(@Body() dto: AuthDto) {
		const oldUser = await this.authService.findUser(dto.login);

		if (oldUser) {
			throw new BadRequestException(USER_EXISTS);
		}

		return this.authService.createUser(dto);
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('login')
	async login(@Body() { login, password }: AuthDto) {
		const { email } = await this.authService.validateUser(login, password);
		return this.authService.login(email);
	}
}
