import { Test, TestingModule } from '@nestjs/testing';
import { CatalogueController } from './catalogue.controller';
import { CatalogueService } from './catalogue.service';

const mockCatalogueService = {
  listProducts: jest.fn().mockResolvedValue({
    data: [],
    meta: { total: 0, limit: 24, nextCursor: null },
  }),
  getProductBySlug: jest.fn().mockResolvedValue({
    id: 'cuid1',
    slug: 'celeste-halo-ring',
    name: 'Celeste Halo Ring',
    description: 'A halo ring.',
    category: 'Rings',
    metalPurity: '925 Sterling Silver',
    brandId: 'argyros',
    seoTitle: null,
    seoDescription: null,
    images: [],
    variants: [],
    collections: [],
  }),
};

describe('CatalogueController', () => {
  let controller: CatalogueController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CatalogueController],
      providers: [{ provide: CatalogueService, useValue: mockCatalogueService }],
    }).compile();

    controller = module.get<CatalogueController>(CatalogueController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('listProducts returns paginated response', async () => {
    const result = await controller.listProducts({ limit: 24 });
    expect(result).toHaveProperty('data');
    expect(result).toHaveProperty('meta');
  });

  it('getProduct returns product detail', async () => {
    const result = await controller.getProduct('celeste-halo-ring');
    expect(result).toHaveProperty('slug', 'celeste-halo-ring');
    expect(result).toHaveProperty('brandId', 'argyros');
  });
});
