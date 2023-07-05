import { Test } from '@nestjs/testing';
import { BooksController } from '../books/book.controller';
import { BooksService } from '../books/book.service';
import { AuthorsService } from '../authors/author.service';
import { NotFoundException } from '@nestjs/common';
import { Book } from '../books/book.model';
import { CreateBookDto, UpdateBookDto } from '../books/dto/book.dto';

describe('BooksController', () => {
  let booksController: BooksController;
  let booksService: BooksService;
  let authorsService: AuthorsService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [BooksController],
      providers: [
        BooksService,
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
        AuthorsService,
      ],
    }).compile();

    booksController = moduleRef.get<BooksController>(BooksController);
    booksService = moduleRef.get<BooksService>(BooksService);
    authorsService = moduleRef.get<AuthorsService>(AuthorsService);
  });

  describe('findAll', () => {
    it('returning an array of books', async () => {
      const mockBooks: Book[] = [
        {
          id: 1,
          title: 'Book 1',
          description: 'Description of Book 1',
          publishedYear: 2021,
          stockCount: 10,
          author: null,
        },
        {
          id: 2,
          title: 'Book 2',
          description: 'Description of Book 2',
          publishedYear: 2022,
          stockCount: 5,
          author: null,
        },
      ];
      jest.spyOn(booksService, 'findAll').mockResolvedValue(mockBooks);

      const result = await booksController.findAll();

      expect(result).toEqual(mockBooks);
      expect(booksService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('returns a single book', async () => {
      const mockBook: Book = {
        id: 1,
        title: 'Book 1',
        description: 'Description of Book 1',
        publishedYear: 2021,
        stockCount: 10,
        author: null,
      };
      jest.spyOn(booksService, 'findOne').mockResolvedValue(mockBook);

      const result = await booksController.findOne(1);

      expect(result).toEqual(mockBook);
      expect(booksService.findOne).toHaveBeenCalledWith(1);
    });

    it('throws NotFoundException when book is not found', async () => {
      jest.spyOn(booksService, 'findOne').mockResolvedValue(null);

      await expect(booksController.findOne(999)).rejects.toThrow(NotFoundException);
      expect(booksService.findOne).toHaveBeenCalledWith(999);
    });
  });

  describe('create', () => {
    it('creating a new book', async () => {
      const createBookDto: CreateBookDto = {
        title: 'New Book',
        description: 'Description of New Book',
        publishedYear: 2023,
        stockCount: 20,
        authorId: 1,
      };
      const createdBook: Book = {
        id: 1,
        title: 'New Book',
        description: 'Description of New Book',
        publishedYear: 2023,
        stockCount: 20,
        author: null,
      };
      jest.spyOn(authorsService, 'findOne').mockResolvedValue({ id: 1, name: 'Arooj', bio: 'Bio', books: [] });
      jest.spyOn(booksService, 'create').mockResolvedValue(createdBook);

      const result = await booksController.create(createBookDto);

      expect(result).toEqual(createdBook);
      expect(authorsService.findOne).toHaveBeenCalledWith(1);
      expect(booksService.create).toHaveBeenCalledWith({
        ...createBookDto,
        author: { id: 1, name: 'Arooj', bio: 'Bio', books: [] },
      });
    });
  });

  describe('update', () => {
    it('updating an existing book', async () => {

      const updateBookDto: UpdateBookDto = {
        title: 'Updated Book',
        description: 'Updated description',
        publishedYear: 2022,
        stockCount: 15,
      };
      jest.spyOn(booksService, 'update').mockResolvedValue({} as Book);


      const result = await booksController.update(1, updateBookDto);


      expect(result).toEqual({ message: 'Book updated successfully.' });
      expect(booksService.update).toHaveBeenCalledWith(1, updateBookDto);
    });

    it('throws NotFoundException when book is not found', async () => {
      const updateBookDto: UpdateBookDto = {
        title: 'Updated Book',
        description: 'Updated description',
        publishedYear: 2022,
        stockCount: 15,
      };
      jest.spyOn(booksService, 'update').mockResolvedValue(null);

      await expect(booksController.update(999, updateBookDto)).rejects.toThrow(NotFoundException);
      expect(booksService.update).toHaveBeenCalledWith(999, updateBookDto);
    });
  });

  describe('remove', () => {
    it('removes an existing book', async () => {
      jest.spyOn(booksService, 'remove').mockResolvedValue({} as Book);
  
      const result = await booksController.remove(1);
  
      expect(result).toEqual({ message: 'Book deleted successfully.' });
      expect(booksService.remove).toHaveBeenCalledWith(1);
    });
  
    it('throws Error when failed to delete book', async () => {
      jest.spyOn(booksService, 'remove').mockResolvedValue(undefined);
    
      await expect(booksController.remove(999)).rejects.toThrow(Error);
      expect(booksService.remove).toHaveBeenCalledWith(999);
    });
  });
  
});
