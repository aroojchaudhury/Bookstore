import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Author } from '../authors/author.model';
import { ObjectType, Field, ID } from '@nestjs/graphql';

@Entity()
@ObjectType() 
export class Book {
  @PrimaryGeneratedColumn()
  @Field(() => ID) 
  id: number;

  @Column()
  @Field() 
  title: string;

  @Column()
  @Field() 
  description: string;

  @Column()
  @Field() 
  publishedYear: number;

  @Column()
  @Field() 
  stockCount: number;

  @ManyToOne(() => Author, author => author.books)
  @Field(() => Author) 
  author: Author;
}
