import { Test, TestingModule } from '@nestjs/testing';
import { AuthorResolver } from '../authors/author.resolver';
import { AuthorsService } from '../authors/author.service';
import { NotFoundException } from '@nestjs/common';
import { CreateAuthorDto, UpdateAuthorDto } from '../authors/dto/author.dto';
import { Author } from '../authors/author.model';

describe('AuthorResolver', () => {
    let authorResolver: AuthorResolver;
    let authorsService: AuthorsService;
  
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          AuthorResolver,
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
  
      authorResolver = module.get<AuthorResolver>(AuthorResolver);
      authorsService = module.get<AuthorsService>(AuthorsService);
    });

  describe('findAll', () => {
    it('returns all authors', async () => {
      const expectedResult: Author[] = [
        { id: 1, name: 'Arooj', bio: 'Bio 1', books: [] },
        { id: 2, name: 'Chaudhry', bio: 'Bio 2', books: [] },
      ];
      jest.spyOn(authorsService, 'findAll').mockResolvedValue(expectedResult);

      const result = await authorResolver.findAll();

      expect(result).toEqual(expectedResult);
      expect(authorsService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('returns the author with the given id', async () => {
      const id = 1;
      const expectedAuthor: Author = { id: 1, name: 'Arooj', bio: 'Bio 1', books: [] };
      jest.spyOn(authorsService, 'findOne').mockResolvedValue(expectedAuthor);

      const result = await authorResolver.findOne(id);

      expect(result).toEqual(expectedAuthor);
      expect(authorsService.findOne).toHaveBeenCalledWith(id);
    });
    it('throws NotFoundException if author is not found', async () => {
      const mockAuthorId = 1;
      jest.spyOn(authorsService, 'findOne').mockResolvedValue(undefined);
    
      await expect(authorResolver.findOne(mockAuthorId)).rejects.toThrowError(NotFoundException);
      expect(authorsService.findOne).toHaveBeenCalledWith(mockAuthorId);
    });
    
  });

  describe('createAuthor', () => {
    it('creating a new author', async () => {
      const createAuthorDto: CreateAuthorDto = { name: 'Arooj', bio: 'Bio 1'};
      const expectedAuthor: Author = { id: 1, name: 'Arooj', bio: 'Bio 1', books: [] };
      jest.spyOn(authorsService, 'create').mockResolvedValue(expectedAuthor);

      const result = await authorResolver.createAuthor(createAuthorDto);

      expect(result).toEqual(expectedAuthor);
      expect(authorsService.create).toHaveBeenCalledWith(createAuthorDto);
    });
  });

  describe('updateAuthor', () => {
    it('updating the author with the given id', async () => {
      const id = 1;
      const updateAuthorDto: UpdateAuthorDto = { name: 'Arooj', bio: 'Updated Bio' };
      const expectedAuthor: Author = { id: 1, name: 'Arooj', bio: 'Updated Bio', books: [] };
      jest.spyOn(authorsService, 'update').mockResolvedValue(expectedAuthor);

      const result = await authorResolver.updateAuthor(id, updateAuthorDto);

      expect(result).toEqual(expectedAuthor);
      expect(authorsService.update).toHaveBeenCalledWith(id, updateAuthorDto);
    });
    it('throws NotFoundException if author is not found', async () => {
      const mockAuthorId = 1;
      const mockUpdateAuthorDto: UpdateAuthorDto = { name: 'Arooj', bio: 'Updated Bio' };
      jest.spyOn(authorsService, 'update').mockResolvedValue(undefined);
    
      await expect(authorResolver.updateAuthor(mockAuthorId, mockUpdateAuthorDto)).rejects.toThrowError(NotFoundException);
      expect(authorsService.update).toHaveBeenCalledWith(mockAuthorId, mockUpdateAuthorDto);
    });
  });

  describe('removeAuthor', () => {
    it('removes the author with the given id', async () => {
      const id = 1;
      const expectedAuthor: Author = { id: 1, name: 'Arooj', bio: 'Bio 1', books: [] };
      jest.spyOn(authorsService, 'remove').mockResolvedValue(expectedAuthor);

      const result = await authorResolver.removeAuthor(id);

      expect(result).toEqual(expectedAuthor);
      expect(authorsService.remove).toHaveBeenCalledWith(id);
    });

    it('throws NotFoundException if the author is not found', async () => {
        const id = 1;
        jest.spyOn(authorsService, 'remove').mockResolvedValue(null);
  
        await expect(authorResolver.removeAuthor(id)).rejects.toThrowError(NotFoundException);
        expect(authorsService.remove).toHaveBeenCalledWith(id);
      });
  });
});
