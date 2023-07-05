import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthorsController } from '../authors/author.controller';
import { AuthorsService } from '../authors/author.service';
import { Author } from '../authors/author.model';
import { CreateAuthorDto, UpdateAuthorDto } from '../authors/dto/author.dto';

describe('AuthorsController', () => {
    let authorsController: AuthorsController;
    let authorsService: AuthorsService;
  
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        controllers: [AuthorsController],
        providers: [
          AuthorsService,
          {
            provide: 'AuthorRepository',
            useValue: {
              find: jest.fn(),
              findOne: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              remove: jest.fn(),
            },
          },
        ],
      }).compile();
  
      authorsController = module.get<AuthorsController>(AuthorsController);
      authorsService = module.get<AuthorsService>(AuthorsService);
    });
  

  describe('findAll', () => {
    it('returns all authors', async () => {
      const mockAuthors = [{ id: 1, name: 'Arooj', bio: 'Bio 1', books: [] }];
      jest.spyOn(authorsService, 'findAll').mockResolvedValue(mockAuthors);

      const result = await authorsController.findAll();

      expect(result).toEqual(mockAuthors);
      expect(authorsService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('returns the author if found', async () => {
      const mockAuthor = { id: 1, name: 'Arooj', bio: 'Bio 1', books: [] };
      const id = 1;
      jest.spyOn(authorsService, 'findOne').mockResolvedValue(mockAuthor);

      const result = await authorsController.findOne(id);

      expect(result).toEqual(mockAuthor);
      expect(authorsService.findOne).toHaveBeenCalledWith(id);
    });

    it('throws NotFoundException if the author is not found', async () => {
      const id = 1;
      jest.spyOn(authorsService, 'findOne').mockResolvedValue(null);

      await expect(authorsController.findOne(id)).rejects.toThrowError(NotFoundException);
      expect(authorsService.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('create', () => {
    it('creates a new author', async () => {
      const createAuthorDto: CreateAuthorDto = { name: 'Arooj', bio: 'Bio 1' };
      const mockCreatedAuthor = { id: 1, name: 'Arooj', bio: 'Bio 1', books: [] };
      jest.spyOn(authorsService, 'create').mockResolvedValue(mockCreatedAuthor);

      const result = await authorsController.create(createAuthorDto);

      expect(result).toEqual(mockCreatedAuthor);
      expect(authorsService.create).toHaveBeenCalledWith(createAuthorDto);
    });

    it('throws an error if failed to create author', async () => {
      const createAuthorDto: CreateAuthorDto = { name: 'Arooj', bio: 'Bio 1' };
      jest.spyOn(authorsService, 'create').mockRejectedValue(new Error('Failed to create author'));

      await expect(authorsController.create(createAuthorDto)).rejects.toThrowError('Failed to create author');
      expect(authorsService.create).toHaveBeenCalledWith(createAuthorDto);
    });
  });

  describe('update', () => {
    it('updats the author if found', async () => {
      const updateAuthorDto: UpdateAuthorDto = { name: 'Arooj', bio: 'Bio 2' };
      const id = 1;
      const updatedAuthor: Author = { id, name: 'Arooj', bio: 'Bio 2', books: [] };
      jest.spyOn(authorsService, 'update').mockResolvedValue(updatedAuthor);
  
      const result = await authorsController.update(id, updateAuthorDto);
  
      expect(result).toEqual({ message: 'Author updated successfully.' });
      expect(authorsService.update).toHaveBeenCalledWith(id, updateAuthorDto);
    });
  
  
    it('throws an error if failed to update author', async () => {
      const updateAuthorDto: UpdateAuthorDto = { name: 'Arooj', bio: 'Bio 2' };
      const id = 1;
      jest.spyOn(authorsService, 'update').mockRejectedValue(new Error('Failed to update author'));
  
      await expect(authorsController.update(id, updateAuthorDto)).rejects.toThrowError('Failed to update author');
      expect(authorsService.update).toHaveBeenCalledWith(id, updateAuthorDto);
    });
  });
  
  

  describe('remove', () => {
    it('removes the author if found', async () => {
      const id = 1;
      jest.spyOn(authorsService, 'remove').mockResolvedValue({} as Author);
  
      const result = await authorsController.remove(id);
  
      expect(result).toEqual({ message: 'Author deleted successfully.' });
      expect(authorsService.remove).toHaveBeenCalledWith(id);
    });
  
    it('throws NotFoundException if the author is not found', async () => {
      const id = 1;
      jest.spyOn(authorsService, 'remove').mockResolvedValue(null);
  
      await expect(authorsController.remove(id)).rejects.toThrow(NotFoundException);
      expect(authorsService.remove).toHaveBeenCalledWith(id);
    });
  
  });
  
  
});
