import { Controller, Get, Param, Query } from '@nestjs/common';
import { CatalogueService } from './catalogue.service';
import { ListProductsDto } from './dto/list-products.dto';

@Controller('products')
export class CatalogueController {
  constructor(private readonly catalogueService: CatalogueService) {}

  /**
   * GET /api/products
   * Returns paginated list of active products with summary data.
   * Supports: q (search), category, cursor, limit, sortBy, sortDir
   */
  @Get()
  listProducts(@Query() dto: ListProductsDto) {
    return this.catalogueService.listProducts(dto);
  }

  /**
   * GET /api/products/:slug
   * Returns full product detail including variants, images and collections.
   */
  @Get(':slug')
  getProduct(@Param('slug') slug: string) {
    return this.catalogueService.getProductBySlug(slug);
  }
}
