import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode, Logger,
	NotFoundException,
	Param,
	Patch,
	Post, UseGuards,
	UsePipes, ValidationPipe,
} from '@nestjs/common';
import { FindTopPageDto } from './dto/find-top-page.dto';
import { TopPageService } from './top-page.service';
import { CreateTopPageDto } from './dto/create-top-page.dto';
import { IdValidationPipe } from '../pipes/ad-validation.pipe';
import { NOT_FOUND } from './top-page.constants';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { HhService } from '../hh/hh.service';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';

@Controller('top-page')
export class TopPageController {

	constructor(
		private readonly topPageService: TopPageService,
		private readonly hhService: HhService,
		private readonly scheduleRegistry: SchedulerRegistry
	) {}

	@UseGuards(JwtAuthGuard)
	@UsePipes(new ValidationPipe())
	@Post('create')
	async create(@Body() dto: CreateTopPageDto) {
		return this.topPageService.create(dto);
	}

	@Get(':id')
	async get(@Param('id', IdValidationPipe) id: string) {
		const page = await this.topPageService.findById(id);
		if (!page) {
			throw new NotFoundException(NOT_FOUND);
		}

		return page;
	}

	@Get('/by-alias/:alias')
	async getByAlias(@Param('alias') alias: string) {
		const page = await this.topPageService.findByAlias(alias);
		if (!page) {
			throw new NotFoundException(NOT_FOUND);
		}

		return page;
	}

	@UseGuards(JwtAuthGuard)
	@Delete(':id')
	async delete(@Param('id', IdValidationPipe) id: string) {
		const deletedPage = await this.topPageService.deleteById(id);
		if (!deletedPage) {
			throw new NotFoundException(NOT_FOUND);
		}
	}

	@UseGuards(JwtAuthGuard)
	@UsePipes(new ValidationPipe())
	@Patch(':id')
	async update(@Param('id', IdValidationPipe) id: string, @Body() dto: CreateTopPageDto) {
		const updatedPage = await this.topPageService.updateById(id, dto);
		if (!updatedPage) {
			throw new NotFoundException(NOT_FOUND);
		}

		return updatedPage;
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('find')
	async find(@Body() dto: FindTopPageDto) {
		return this.topPageService.findByCategory(dto.firstCategory);
	}

	@Get('text-search/:text')
	async textSearch(@Param('text') text: string) {
		return this.topPageService.findByText(text);
	}
	
	@Cron(CronExpression.EVERY_10_SECONDS, { name: 'test' })
	async test() {
		const job = this.scheduleRegistry.getCronJob('test');
		Logger.log(`Test CRON ${job.running} ` + new Date());
	}
}
