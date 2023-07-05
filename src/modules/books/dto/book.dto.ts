import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateBookDto {
  @Field()
  @IsNotEmpty()
  @IsString()
  title: string;

  @Field()
  @IsNotEmpty()
  @IsNumber()
  authorId: number;

  @Field()
  @IsNotEmpty()
  @IsString()
  description: string;

  @Field()
  @IsNotEmpty()
  @IsNumber()
  publishedYear: number;

  @Field()
  @IsNotEmpty()
  @IsNumber()
  stockCount: number;
}

@InputType()
export class UpdateBookDto {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  title?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  authorId?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  publishedYear?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  stockCount?: number;
}
