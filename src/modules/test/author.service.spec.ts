import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuthorsService } from '../authors/author.service';
import { Repository } from 'typeorm';
import { Author } from '../authors/author.model';
import { CreateAuthorDto, UpdateAuthorDto } from '../authors/dto/author.dto';

describe('AuthorsService', () => {
  let authorsService: AuthorsService;
  let authorRepository: Repository<Author>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthorsService,
        {
          provide: getRepositoryToken(Author),
          useClass: Repository,
        },
      ],
    }).compile();

    authorsService = moduleRef.get<AuthorsService>(AuthorsService);
    authorRepository = moduleRef.get<Repository<Author>>(getRepositoryToken(Author));
  });

  describe('findAll', () => {
    it('returns an array of authors with their books', async () => {
      const mockAuthors: Author[] = [
        {
          id: 1,
          name: 'Arooj',
          bio: 'Bio 1',
          books: [
            { id: 1, title: 'Book 1', description: 'Description 1', publishedYear: 2021, stockCount: 10, author: null },
            { id: 2, title: 'Book 2', description: 'Description 2', publishedYear: 2022, stockCount: 5, author: null },
          ],
        },
        {
          id: 2,
          name: 'Arooj Chaudhry',
          bio: 'Bio 2',
          books: [
            { id: 3, title: 'Book 3', description: 'Description 3', publishedYear: 2023, stockCount: 8, author: null },
            { id: 4, title: 'Book 4', description: 'Description 4', publishedYear: 2024, stockCount: 3, author: null },
          ],
        },
      ];
      jest.spyOn(authorRepository, 'find').mockResolvedValue(mockAuthors);

      const result = await authorsService.findAll();

      expect(result).toEqual(mockAuthors);
      expect(authorRepository.find).toHaveBeenCalledWith({ relations: ['books'] });
    });
  });

  describe('findOne', () => {
    it('returns the author with the given id', async () => {
      const mockAuthor: Author = { id: 1, name: 'Arooj', bio: 'Bio 1', books: [] };
      jest.spyOn(authorRepository, 'findOne').mockResolvedValue(mockAuthor);

      const result = await authorsService.findOne(1);

      expect(result).toEqual(mockAuthor);
      expect(authorRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('null if the author is not found', async () => {
      jest.spyOn(authorRepository, 'findOne').mockResolvedValue(null);

      const result = await authorsService.findOne(1);

      expect(result).toBeNull();
      expect(authorRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });
  
  describe('create', () => {
    it('creates a new author', async () => {
      const createAuthorDto: CreateAuthorDto = { name: 'Arooj', bio: 'Bio 1' };
      const mockAuthor: Author = { id: 1, name: 'Arooj', bio: 'Bio 1', books: [] };
      jest.spyOn(authorRepository, 'create').mockReturnValue(mockAuthor);
      jest.spyOn(authorRepository, 'save').mockResolvedValue(mockAuthor);

      const result = await authorsService.create(createAuthorDto);

      expect(result).toEqual(mockAuthor);
      expect(authorRepository.create).toHaveBeenCalledWith(createAuthorDto);
      expect(authorRepository.save).toHaveBeenCalledWith(mockAuthor);
    });
  });

  describe('update', () => {
    it('update and return the author if exists', async () => {
      const mockAuthor: Author = { id: 1, name: 'Arooj', bio: 'Bio 1', books: [] };
      const updatedAuthor: UpdateAuthorDto = { name: 'Arooj Updated' };
      jest.spyOn(authorsService, 'findOne').mockResolvedValue(mockAuthor);
      jest.spyOn(authorRepository, 'save').mockResolvedValue({ ...mockAuthor, ...updatedAuthor });

      const result = await authorsService.update(1, updatedAuthor);

      expect(result).toEqual({ ...mockAuthor, ...updatedAuthor });
      expect(authorsService.findOne).toHaveBeenCalledWith(1);
      expect(authorRepository.save).toHaveBeenCalledWith({ ...mockAuthor, ...updatedAuthor });
    });

    it('null if the author is not found', async () => {
      const id = 1;
      const updatedAuthor: UpdateAuthorDto = { name: 'Arooj Updated' };
      jest.spyOn(authorsService, 'findOne').mockResolvedValue(null);
      jest.spyOn(authorRepository, 'save'); // Add this line

      const result = await authorsService.update(id, updatedAuthor);

      expect(result).toBeNull();
      expect(authorsService.findOne).toHaveBeenCalledWith(id);
      expect(authorRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('removes and returns the author if found', async () => {
      const mockAuthor: Author = { id: 1, name: 'Arooj', bio: 'Bio 1', books: [] };
      const id = 1;
      jest.spyOn(authorsService, 'findOne').mockResolvedValue(mockAuthor);
      jest.spyOn(authorRepository, 'remove').mockResolvedValue(mockAuthor);

      const result = await authorsService.remove(id);

      expect(result).toEqual(mockAuthor);
      expect(authorsService.findOne).toHaveBeenCalledWith(id);
      expect(authorRepository.remove).toHaveBeenCalledWith(mockAuthor);
    });

    it('null if the author is not found', async () => {
      const id = 1;
      jest.spyOn(authorsService, 'findOne').mockResolvedValue(null);
      jest.spyOn(authorRepository, 'remove'); // Add this line

      const result = await authorsService.remove(id);

      expect(result).toBeNull();
      expect(authorsService.findOne).toHaveBeenCalledWith(id);
      expect(authorRepository.remove).not.toHaveBeenCalled();
    });
  });

});
