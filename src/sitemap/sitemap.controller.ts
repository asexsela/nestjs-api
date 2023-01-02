import { Controller, Get, Header } from '@nestjs/common';
import { TopPageService } from '../top-page/top-page.service';
import { ConfigService } from '@nestjs/config';
import { format, subDays } from 'date-fns';
import { Builder } from 'xml2js';
import { CATEGORY_URL } from './sitemap.constants';
import { TopPageModel } from '../top-page/top-page.model';

@Controller('sitemap')
export class SitemapController {
	domain: string;
	constructor(
		private readonly topPageService: TopPageService,
		private readonly configService: ConfigService
	) {
		this.domain = configService.get('DOMAIN_NAME', 'http://localhost:3000');
	}
	
	@Get('xml')
	@Header('content-type', 'text/xml')
	async sitemap() {
		const formatString = 'yyyy-MM-dd\'T\'HH:mm:00.000xxx';
		let response = [{
			loc: this.domain,
			lastmod: format(subDays(new Date, 1), formatString),
			changefreg: 'daily',
			priority: '1.0'
		},{
			loc: `${this.domain}/cources`,
			lastmod: format(subDays(new Date, 1), formatString),
			changefreg: 'daily',
			priority: '1.0'
		}];
		
		const pages: TopPageModel[] = await this.topPageService.findAll();
		
		response = response.concat(pages.map((page: TopPageModel) => {
			return {
				loc: `${this.domain}${CATEGORY_URL[page.firstCategory]}/${page.alias}`,
				lastmod: format(new Date(page.updatedAt ?? new Date), formatString),
				changefreg: 'weekly',
				priority: '0.7'
			};
		}));
		
		const builder = new Builder({
			xmldec: {
				version: '1.0',
				encoding: 'UTF-8'
			}
		});
		
		return builder.buildObject({
			urlset: {
				$: {
					xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9'
				},
				url: response
			}
		});
	}
}
