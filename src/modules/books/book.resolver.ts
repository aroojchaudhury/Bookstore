import { Resolver, Query, Mutation, Args, ResolveField, Root } from '@nestjs/graphql';
import { BooksService } from './book.service';
import { Book } from './book.model';
import { forwardRef, Inject } from '@nestjs/common';
import { AuthorsService } from '../authors/author.service';
import { CreateBookDto, UpdateBookDto } from './dto/book.dto';
import { NotFoundException } from '@nestjs/common';
import { Int } from 'type-graphql';

@Resolver(() => Book)
export class BookResolver {
  constructor(
    private readonly booksService: BooksService,
    @Inject(forwardRef(() => AuthorsService))
    private readonly authorsService: AuthorsService,
  ) {}
  
  @Query(() => [Book])
  async books() {
    return this.booksService.findAll();
  }

  @Query(() => Book)
  async book(@Args('id') id: number): Promise<Book> {
    return this.booksService.findOne(id);
  }


  @Mutation(() => Book) 
  async createBook(@Args('createBookDto') createBookDto: CreateBookDto) {
    const author = await this.authorsService.findOne(createBookDto.authorId);
    if (!author) {
      throw new Error('Author not found');
    }
  
    const book = {
      ...createBookDto,
      author,
    };
  
    return this.booksService.create(book);
  }
  
  
  @Mutation(() => Book)
  async updateBook(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateBookDto') updateBookDto: UpdateBookDto,
  ) {
    const updatedBook = await this.booksService.update(id, updateBookDto);
    if (!updatedBook) {
      throw new NotFoundException('Book not found');
    }
    return updatedBook;
  }

  @Mutation(() => Boolean)
  async deleteBook(@Args('id', { type: () => Int }) id: number): Promise<boolean> {
    const deletedBook = await this.booksService.remove(id);
    if (!deletedBook) {
      throw new NotFoundException('Book not found');
    }
    return true;
  }
}
