import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { AuthorsService } from './author.service';
import { Author } from './author.model';
import { CreateAuthorDto } from './dto/author.dto';
import { UpdateAuthorDto } from './dto/author.dto';
import { NotFoundException } from '@nestjs/common';

@Resolver(() => Author)
export class AuthorResolver {
  constructor(
  private readonly authorsService: AuthorsService) {}

  @Query(() => [Author], { name: 'authors' })
  async findAll() {
    return this.authorsService.findAll();
  }

  @Query(() => Author, { name: 'author' })
  async findOne(@Args('id', { type: () => Int }) id: number) {
    const author = await this.authorsService.findOne(id);
    if (!author) {
      throw new NotFoundException('Author not found');
    }
    return author;
  }

  @Mutation(() => Author)
  createAuthor(@Args('input') input: CreateAuthorDto) {
    return this.authorsService.create(input);
  }

  @Mutation(() => Author)
  async updateAuthor(@Args('id', { type: () => Int }) id: number, @Args('input') input: UpdateAuthorDto) {
    const updatedAuthor = await this.authorsService.update(id, input);
    if (!updatedAuthor) {
      throw new NotFoundException('Author not found');
    }
    return updatedAuthor;
  }
  
  @Mutation(() => Author)
  async removeAuthor(@Args('id', { type: () => Int }) id: number) {
    const removedAuthor = await this.authorsService.remove(id);
    if (!removedAuthor) {
      throw new NotFoundException('Author not found');
    }
    return removedAuthor;
  }
  
}
