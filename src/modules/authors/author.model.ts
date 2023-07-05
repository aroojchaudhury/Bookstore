import { Entity, Column, PrimaryGeneratedColumn, OneToMany} from 'typeorm';
import { Book } from '../books/book.model';
import { ObjectType, Field, ID } from '@nestjs/graphql';

@Entity()
@ObjectType() 
export class Author {
  @PrimaryGeneratedColumn()
  @Field(() => ID) 
  id: number;

  @Column()
  @Field() 
  name: string;

  @Column()
  @Field() 
  bio: string;

  @OneToMany(() => Book, (book) => book.author)
  @Field(() => [Book]) 
  books: Book[];
}

