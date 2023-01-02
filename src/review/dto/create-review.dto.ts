import { IsString, IsNumber, Max, Min } from 'class-validator'

export class CreateReviewDto {
	@IsString()
	name: string

	@IsString()
	title: string

	@IsString()
	description: string

	@Min(1, { message: 'Minimun 1' })
	@Max(5)
	@IsNumber()
	rating: number

	@IsString()
	productId: string
}