import { Test } from '@nestjs/testing';
import { BooksService } from '../books/book.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { Book } from '../books/book.model';
import { Author } from '../authors/author.model';
import { CreateBookDto } from '../books/dto/book.dto';

describe('BooksService', () => {
  let booksService: BooksService;

  const mockBookRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };
  

  const mockBookData: CreateBookDto = {
    title: 'New Book',
    authorId: 1,
    description: 'Description of the book',
    publishedYear: 2022,
    stockCount: 10,
  };
  
  

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        BooksService,
        {
          provide: getRepositoryToken(Book),
          useValue: mockBookRepository,
        },
      ],
    }).compile();

    booksService = moduleRef.get<BooksService>(BooksService);
  });

  describe('findAll', () => {
    it('returns an array of the books', async () => {
      const mockBooks = [{ id: 1, title: 'Book 1' }, { id: 2, title: 'Book 2' }];
      mockBookRepository.find.mockResolvedValue(mockBooks);

      const result = await booksService.findAll();

      expect(result).toEqual(mockBooks);
      expect(mockBookRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('returns one book', async () => {
      const mockBook = { id: 1, title: 'Book 1' };
      mockBookRepository.findOne.mockResolvedValue(mockBook);

      const result = await booksService.findOne(1);

      expect(result).toEqual(mockBook);
      expect(mockBookRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });

    });
  });

  it('creating a new book', async () => {
    const createdBook = { id: 1, title: 'New Book' };
    mockBookRepository.create.mockReturnValue(createdBook);
    mockBookRepository.save.mockResolvedValue(createdBook);
  
    const result = await booksService.create(mockBookData);
  
    expect(result).toEqual(createdBook);
    expect(mockBookRepository.create).toHaveBeenCalledWith(mockBookData);
    expect(mockBookRepository.save).toHaveBeenCalledWith(createdBook);
  });
  

  describe('update', () => {
    it('update an existing book', async () => {
      const mockBookData = { title: 'Updated Book' };
      const updatedBook = { id: 1, title: 'Updated Book' };
  
      mockBookRepository.findOne.mockResolvedValueOnce(updatedBook);
  
      mockBookRepository.save.mockResolvedValue(updatedBook);
  
      const result = await booksService.update(1, mockBookData);
  
      expect(result).toEqual(updatedBook);
      expect(mockBookRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(mockBookRepository.save).toHaveBeenCalledWith(updatedBook);
    });
  
    it('throws NotFoundException if book is not found', async () => {
      const mockBookData = { title: 'Updated Book' };
  
      mockBookRepository.findOne.mockResolvedValue(undefined);
  
      await expect(booksService.update(1, mockBookData)).rejects.toThrow(NotFoundException);
      expect(mockBookRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    }); 
  });
  

  describe('remove', () => {
    it('removes an existing book and returns it', async () => {
      const mockBookId = 1;
      const mockBook = { id: mockBookId, title: 'Book 1' };
      mockBookRepository.findOne.mockResolvedValue(mockBook);
      mockBookRepository.remove.mockResolvedValue(mockBook);

      const result = await booksService.remove(mockBookId);

      expect(result).toEqual(mockBook);
      expect(mockBookRepository.findOne).toHaveBeenCalledWith({ where: { id: mockBookId } });
      expect(mockBookRepository.remove).toHaveBeenCalledWith(mockBook);
    });

    it('throws NotFoundException if book is not found', async () => {
      const mockBookId = 1;
      mockBookRepository.findOne.mockResolvedValue(undefined);
    
      await expect(booksService.remove(mockBookId)).rejects.toThrow(NotFoundException);
      expect(mockBookRepository.findOne).toHaveBeenCalledWith({ where: { id: mockBookId } });
      expect(mockBookRepository.remove).not.toHaveBeenCalledWith();
    });    
  });
  describe('Book', () => {
    it('creates a book instance', () => {
      const book = new Book();
      expect(book).toBeDefined();
    });
  
    it('have correct properties', () => {
      const book = new Book();
      expect(book.title).toBeUndefined();
      expect(book.description).toBeUndefined();
      expect(book.publishedYear).toBeUndefined();
      expect(book.stockCount).toBeUndefined();
      expect(book.author).toBeUndefined();
    });
    it('should set and get properties correctly', () => {
      const book = new Book();
      book.title = 'Sample Title';
      book.description = 'Sample Description';
      book.publishedYear = 2023;
      book.stockCount = 10;
  
      expect(book.title).toEqual('Sample Title');
      expect(book.description).toEqual('Sample Description');
      expect(book.publishedYear).toEqual(2023);
      expect(book.stockCount).toEqual(10);
    });
    it('have correct author relationship', () => {
      const book = new Book();
      const mockAuthor = { id: 1, name: 'Arooj', bio: 'Bio', books: [] } as Author;
      book.author = mockAuthor;
  
      expect(book.author).toEqual(mockAuthor);
    });
  });
});
