import { Test } from '@nestjs/testing';
import { BookResolver } from '../books/book.resolver';
import { BooksService } from '../books/book.service';
import { AuthorsService } from '../authors/author.service';
import { Author } from '../authors/author.model';
import { Book } from '../books/book.model';
import { NotFoundException } from '@nestjs/common';

describe('BookResolver', () => {
  let bookResolver: BookResolver;
  let booksService: BooksService;
  let authorsService: AuthorsService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        BookResolver,
        BooksService,
        AuthorsService,
        {
          provide: 'BookRepository',
          useClass: class {
            find = jest.fn();
            findOne = jest.fn();
            create = jest.fn();
            update = jest.fn();
            remove = jest.fn();
          },
        },
        {
          provide: 'AuthorRepository',
          useClass: class {
            find = jest.fn();
            findOne = jest.fn();
          },
        },
      ],
    }).compile();

    bookResolver = moduleRef.get<BookResolver>(BookResolver);
    booksService = moduleRef.get<BooksService>(BooksService);
    authorsService = moduleRef.get<AuthorsService>(AuthorsService);
  });

  describe('books', () => {
    it('returns an array of the books', async () => {
      const mockBooks: Book[] = [
        {
          id: 1,
          title: 'Book 1',
          description: 'Description 1',
          publishedYear: 2021,
          stockCount: 10,
          author: null,
        },
        {
          id: 2,
          title: 'Book 2',
          description: 'Description 2',
          publishedYear: 2022,
          stockCount: 5,
          author: null,
        },
      ];
      jest.spyOn(booksService, 'findAll').mockResolvedValue(mockBooks);

      const result = await bookResolver.books();

      expect(result).toEqual(mockBooks);
      expect(booksService.findAll).toHaveBeenCalled();
    });
  });

  describe('book', () => {
    it('returning a book by ID', async () => {
      const mockBookId = 1;
      const mockBook: Book = {
        id: mockBookId,
        title: 'Book 1',
        description: 'Description 1',
        publishedYear: 2021,
        stockCount: 10,
        author: null,
      };
      jest.spyOn(booksService, 'findOne').mockResolvedValue(mockBook);

      const result = await bookResolver.book(mockBookId);

      expect(result).toEqual(mockBook);
      expect(booksService.findOne).toHaveBeenCalledWith(mockBookId);
    });
  });

  describe('createBook', () => {
    it('creating a new book', async () => {
      const mockCreateBookDto = {
        title: 'New Book',
        description: 'Description',
        publishedYear: 2023,
        stockCount: 5,
        authorId: 1,
      };
      const mockAuthor = { id: 1, name: 'Arooj Chaudhry' } as Author; 
      const mockCreatedBook: Book = {
        id: 1,
        title: 'New Book',
        description: 'Description',
        publishedYear: 2023,
        stockCount: 5,
        author: mockAuthor,
      };

      jest.spyOn(authorsService, 'findOne').mockResolvedValue(mockAuthor);
      jest.spyOn(booksService, 'create').mockResolvedValue(mockCreatedBook);

      const result = await bookResolver.createBook(mockCreateBookDto);

      expect(result).toEqual(mockCreatedBook);
      expect(authorsService.findOne).toHaveBeenCalledWith(mockCreateBookDto.authorId);
      expect(booksService.create).toHaveBeenCalledWith({
        ...mockCreateBookDto,
        author: mockAuthor,
      });
    });

    it('throws an error if author is not found', async () => {
      const mockCreateBookDto = {
        title: 'New Book',
        description: 'Description',
        publishedYear: 2023,
        stockCount: 5,
        authorId: 1,
      };
      jest.spyOn(authorsService, 'findOne').mockResolvedValue(undefined);

      await expect(bookResolver.createBook(mockCreateBookDto)).rejects.toThrow(Error);
      expect(authorsService.findOne).toHaveBeenCalledWith(mockCreateBookDto.authorId);
    });
  });

  describe('updateBook', () => {
    it('updating a book', async () => {
      const mockBookId = 1;
      const mockUpdateBookDto = {
        title: 'Updated Book',
        description: 'Updated Description',
        publishedYear: 2023,
        stockCount: 10,
        authorId: 1,
      };
      const mockUpdatedBook: Book = {
        id: mockBookId,
        title: 'Updated Book',
        description: 'Updated Description',
        publishedYear: 2023,
        stockCount: 10,
        author: null,
      };

      jest.spyOn(booksService, 'update').mockResolvedValue(mockUpdatedBook);

      const result = await bookResolver.updateBook(mockBookId, mockUpdateBookDto);

      expect(result).toEqual(mockUpdatedBook);
      expect(booksService.update).toHaveBeenCalledWith(mockBookId, mockUpdateBookDto);
    });
    it('throws NotFoundException if book is not found', async () => {
      const mockBookId = 1;
      const mockUpdateBookDto = {
        title: 'Updated Book',
        description: 'Updated Description',
        publishedYear: 2023,
        stockCount: 10,
        authorId: 1,
      };
    
      jest.spyOn(booksService, 'update').mockResolvedValue(undefined);
    
      await expect(bookResolver.updateBook(mockBookId, mockUpdateBookDto)).rejects.toThrowError(NotFoundException);
      expect(booksService.update).toHaveBeenCalledWith(mockBookId, mockUpdateBookDto);
    });
  });

  describe('deleteBook', () => {
    it('deleting a book', async () => {
      const mockBookId = 1;
      const mockDeletedBook: Book = {
        id: mockBookId,
        title: 'Book 1',
        description: 'Description 1',
        publishedYear: 2021,
        stockCount: 10,
        author: null,
      };

      jest.spyOn(booksService, 'remove').mockResolvedValue(mockDeletedBook);

      const result = await bookResolver.deleteBook(mockBookId);

      expect(result).toBe(true);
      expect(booksService.remove).toHaveBeenCalledWith(mockBookId);
    });

    it('throws NotFoundException if book is not found', async () => {
      const mockBookId = 1;
      jest.spyOn(booksService, 'remove').mockResolvedValue(undefined);
    
      await expect(bookResolver.deleteBook(mockBookId)).rejects.toThrowError(NotFoundException);
      expect(booksService.remove).toHaveBeenCalledWith(mockBookId);
    });
  });
});
