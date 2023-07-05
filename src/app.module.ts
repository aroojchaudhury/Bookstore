import 'reflect-metadata';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './modules/books/book.model';
import { Author } from './modules/authors/author.model';
import { BooksModule } from './modules/books/book.module';
import { AuthorsModule } from './modules/authors/author.module';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'bookstore_user',
      password: 'password',
      database: 'bookstore',
      entities: [Book, Author],
      synchronize: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true
    }),
    BooksModule,
    AuthorsModule,
  ],
  
})
export class AppModule {}
