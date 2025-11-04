import { Test, TestingModule } from '@nestjs/testing';
import { LlmService } from './llm.service';
import { HttpService } from '../common/http/http.service';
import { BadRequestException } from '@nestjs/common';

describe('LlmService', () => {
  let service: LlmService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LlmService,
        {
          provide: HttpService,
          useValue: {
            post: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<LlmService>(LlmService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateText', () => {
    const mockPrompt = 'Generate a PEI';

    it('should successfully generate text from Ollama', async () => {
      const mockResponse = {
        data: {
          response: 'Mock PEI content',
        },
      };
      (httpService.post as jest.Mock).mockResolvedValue(mockResponse);

      const result = await service.generateText(mockPrompt);

      expect(result).toBe('Mock PEI content');
      expect(httpService.post).toHaveBeenCalled();
    });

    it('should throw BadRequestException if Ollama fails', async () => {
      (httpService.post as jest.Mock).mockRejectedValue(new Error('Ollama unavailable'));

      await expect(service.generateText(mockPrompt)).rejects.toThrow();
    });
  });

  describe('peiFromText', () => {
    const mockStudent = {
      id: 'student-123',
      name: 'John Doe',
      gradeLevel: '3rd Grade',
    };
    const mockText = 'Clinical assessment text';
    const mockContext = 'Additional context';

    it('should generate PEI from text', async () => {
      const mockResponse = {
        data: {
          response: JSON.stringify({
            meta: { version: '1.0' },
            student: { name: 'John Doe' },
            assessment: { level: 'Medium' },
            goals: [],
            supports: [],
            plan: {},
          }),
        },
      };
      (httpService.post as jest.Mock).mockResolvedValue(mockResponse);

      const result = await service.peiFromText(mockStudent, mockText, mockContext);

      expect(result).toBeDefined();
      expect(httpService.post).toHaveBeenCalled();
    });

    it('should throw BadRequestException for invalid JSON response', async () => {
      const mockResponse = {
        data: {
          response: 'Invalid JSON response',
        },
      };
      (httpService.post as jest.Mock).mockResolvedValue(mockResponse);

      await expect(service.peiFromText(mockStudent, mockText)).rejects.toThrow(BadRequestException);
    });
  });

  describe('handleOllamaError', () => {
    it('should throw BadRequestException for service unavailable', () => {
      const error = {
        code: 'ECONNREFUSED',
        message: 'Connection refused',
      } as any;

      expect(() => service['handleOllamaError'](error)).toThrow(BadRequestException);
    });
  });
});

