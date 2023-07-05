import { buildSchemaSync } from 'type-graphql';
import { AuthorResolver } from './modules/authors/author.resolver';
import { BookResolver } from './modules/books/book.resolver';

export function createSchema() {
  return buildSchemaSync({
    resolvers: [AuthorResolver, BookResolver],
  });
}

