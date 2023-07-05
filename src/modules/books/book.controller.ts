import { Controller, Get, Param, Post, Body, Put, Delete, NotFoundException } from '@nestjs/common';
import { BooksService } from './book.service';
import { CreateBookDto, UpdateBookDto } from './dto/book.dto';
import { forwardRef, Inject } from '@nestjs/common';
import { AuthorsService } from '../authors/author.service';

@Controller('books')
export class BooksController {
  constructor(
    private readonly booksService: BooksService,
    @Inject(forwardRef(() => AuthorsService))
    private readonly authorsService: AuthorsService,
  ) {}

  @Get()
  async findAll() {
    return this.booksService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const book = await this.booksService.findOne(id);
    if (!book) {
      throw new NotFoundException('Book not found');
    }
    return book;
  }
  

  @Post()
  async create(@Body() createBookDto: CreateBookDto) {
    try {
      const author = await this.authorsService.findOne(createBookDto.authorId);
      if (!author) {
        throw new NotFoundException('Author not found');
      }

      const book = {
        ...createBookDto,
        author,
      };

      return this.booksService.create(book);
    } catch (error) {
      throw new Error('Failed to create book');
    }
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateBookDto: UpdateBookDto) {
    const isUpdated = await this.booksService.update(id, updateBookDto);
    if (isUpdated) {
      return { message: 'Book updated successfully.' };
    } else {
      throw new NotFoundException('Book not found');
    }
  }
  

  @Delete(':id')
  async remove(@Param('id') id: number) {
    try {
      const isDeleted = await this.booksService.remove(id);
      if (isDeleted) {
        return { message: 'Book deleted successfully.' };
      } else {
        throw new NotFoundException('Book not found');
      }
    } catch (error) {
      throw new Error('Failed to delete book');
    }
  }
}
