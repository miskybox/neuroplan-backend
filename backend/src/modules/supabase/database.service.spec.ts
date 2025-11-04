import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseService } from './database.service';
import { SupabaseService } from './supabase.service';

describe('DatabaseService', () => {
  let service: DatabaseService;
  let supabaseServiceMock: Partial<SupabaseService>;

  beforeEach(async () => {
    // Mock del cliente de Supabase
    const mockClient = {
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
    };

    // Mock del servicio de Supabase
    supabaseServiceMock = {
      getClient: jest.fn().mockReturnValue(mockClient),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DatabaseService,
        { provide: SupabaseService, useValue: supabaseServiceMock },
      ],
    }).compile();

    service = module.get<DatabaseService>(DatabaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get students by user ID', async () => {
    const mockData = [{ id: '1', name: 'Test Student' }];
    const mockResponse = { data: mockData, error: null };
    
    const clientMock = supabaseServiceMock.getClient!();
    jest.spyOn(clientMock, 'from').mockImplementation(() => {
      return {
        ...clientMock,
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnValue({
          data: mockData,
          error: null
        }),
      } as any;
    });

    const result = await service.getStudentsByUser('user-123');
    expect(supabaseServiceMock.getClient).toHaveBeenCalled();
    expect(result).toHaveProperty('data');
  });

  it('should test database connection', async () => {
    const clientMock = supabaseServiceMock.getClient!();
    jest.spyOn(clientMock, 'from').mockImplementation(() => {
      return {
        ...clientMock,
        select: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnValue({
          data: [{ count: 1 }],
          error: null
        }),
      } as any;
    });

    const result = await service.testConnection();
    expect(result).toBe(true);
  });
});