import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './book.model';
import { BooksService } from './book.service';
import { BooksController } from './book.controller';
import { BookResolver } from './book.resolver';
import { AuthorsService } from '../authors/author.service';
import { AuthorsModule } from '../authors/author.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Book]),
    forwardRef(() => AuthorsModule),
  ],
  providers: [BooksService, BookResolver],
  exports: [BooksService],
  controllers: [BooksController],
})
export class BooksModule {}
