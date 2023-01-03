export class HHResponse {
	success: boolean;
	data: DataResponse;
	meta: Meta;
	
}

export class DataResponse {
	last_update: Date;
	orders: Item[];
	
}

export class Item {
	id: number;
	unit_id: number;
	delivery_method: string;
	app_type: string;
	date: Date;
	timezone: Timezone;
	currency: string;
	unit: string;
	price: number;
	amount: number;
	discount_amount: number;
	delivery_cost: number;
	total_amount: number;
}

export class Timezone {
	timezone_type: number;
	timezone: string;
}

export class Meta {
	total: number|string;
	per_page: number|string;
	current_page: number|string;
	last_page: number|string;
}
