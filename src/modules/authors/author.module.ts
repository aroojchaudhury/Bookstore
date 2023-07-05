import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Author } from './author.model';
import { AuthorsService } from './author.service';
import { AuthorsController } from './author.controller';
import { AuthorResolver } from './author.resolver';
import { BooksModule } from '../books/book.module';

@Module({
  imports: [TypeOrmModule.forFeature([Author]),
  forwardRef(() => BooksModule),
],
  providers: [AuthorsService, AuthorResolver],
  exports: [AuthorsService],
  controllers: [AuthorsController],
})
export class AuthorsModule {}
