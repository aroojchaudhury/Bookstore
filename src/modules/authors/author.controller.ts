import { Controller, Get, Param, Post, Body, Put, Delete, NotFoundException } from '@nestjs/common';
import { AuthorsService } from './author.service';
import { CreateAuthorDto, UpdateAuthorDto } from './dto/author.dto';

@Controller('authors')
export class AuthorsController {
  constructor(private readonly authorsService: AuthorsService) {}

  @Get()
  async findAll() {
    return this.authorsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    try {
      const author = await this.authorsService.findOne(id);
      if (!author) {
        throw new NotFoundException('Author not found');
      }
      return author;
    } catch (error) {
      throw new NotFoundException('Author not found');
    }
  }

  @Post()
  async create(@Body() createAuthorDto: CreateAuthorDto) {
    try {
      return this.authorsService.create(createAuthorDto);
    } catch (error) {
      throw new Error('Failed to create author');
    }
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateAuthorDto: UpdateAuthorDto) {
    try {
      const isUpdated = await this.authorsService.update(id, updateAuthorDto);
      if (isUpdated) {
        return { message: 'Author updated successfully.' };
      } else {
        throw new NotFoundException('Author not found');
      }
    } catch (error) {
      throw new Error('Failed to update author');
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    const isDeleted = await this.authorsService.remove(id);
    if (isDeleted) {
      return { message: 'Author deleted successfully.' };
    } else {
      throw new NotFoundException('Author not found');
    }
  }
  
}

