import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { Item, HHResponse, DataResponse } from './hh.models';
import { catchError, firstValueFrom } from 'rxjs';

@Injectable()
export class HhService {
	token: string;
	url: string;
	
	constructor(
		private readonly configService: ConfigService,
		private readonly httpService: HttpService
	) {
		this.url = configService.get('HH_URL') ?? '';
		this.token = configService.get('HH_TOKEN') ?? '';
	}
	
	async getData(text: string): Promise<DataResponse> {
		const { data } = await firstValueFrom(
			this.httpService.get<DataResponse>(this.url, {
				params: {
					api_key: this.token,
					page: 1,
					per_page: 20
				}
			}).pipe(
				catchError(() => {
					throw new Error('Error hh get data');
				}),
			),
		);
		
		return data;
	}
	
	private parseData(data: HHResponse): Item {
		const result = data.data.orders.find(e => e.app_type === 'site');
		
		if (!result) {
			throw new Error('Not Found');
		}
		
		return result;
	}
}
