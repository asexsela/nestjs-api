import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { TopPageController } from './top-page.controller';
import { TopPageModel } from './top-page.model';
import { TopPageService } from './top-page.service';
import { HhModule } from '../hh/hh.module';

@Module({
	controllers: [TopPageController],
	imports: [
		TypegooseModule.forFeature([
			{
			typegooseClass: TopPageModel,
			schemaOptions: {
				collection: 'TopPage'
			}
			}
		]),
		HhModule
	],
  	providers: [TopPageService],
	exports: [TopPageService]
})
export class TopPageModule {}
