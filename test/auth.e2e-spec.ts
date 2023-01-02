import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AuthDto } from '../src/auth/dto/auth.dto';
import { AppModule } from '../src/app.module';
import { USER_NOT_FOUND, WRONG_PASSWORD } from '../src/auth/auth.constants';
import { disconnect } from 'mongoose';


const loginDto: AuthDto = {
	login: 'admin@admin.com',
	password: '123456'
}

describe('AuthController (e2e)', () => { 
	let app: INestApplication

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule]
		}).compile()

		app = moduleFixture.createNestApplication()
		await app.init()
	})

	it('/auth/login (POST) - success', (done) => {
		request(app.getHttpServer())
			.post('/auth/login')
			.send(loginDto)
			.expect(200)
			.then(({ body }: request.Response) => {
				expect(body.access_token).toBeDefined()
				expect(body.access_token).not.toBeNull()
				done()
			})
	})

	it('/auth/login (POST) - fail password', () => {
		return request(app.getHttpServer())
			.post('/auth/login')
			.send({...loginDto, password: '12345'})
			.expect(401, {
				statusCode: 401,
				message: WRONG_PASSWORD,
				error: 'Unauthorized'
			})
	})

	it('/auth/login (POST) - fail login', () => {
		return request(app.getHttpServer())
			.post('/auth/login')
			.send({...loginDto, login: 'admin1@admin.com'})
			.expect(401, {
				statusCode: 401,
				message: USER_NOT_FOUND,
				error: 'Unauthorized'
			})
	})

	afterAll(() => {
		disconnect()
	})
})