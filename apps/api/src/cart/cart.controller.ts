import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Headers,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CartService, FormattedCart } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  async getCart(@Headers('x-cart-token') cartToken?: string): Promise<FormattedCart> {
    return this.cartService.getOrCreateCart(cartToken);
  }

  @Post('items')
  @HttpCode(HttpStatus.OK)
  async addItem(
    @Headers('x-cart-token') cartToken: string | undefined,
    @Body() dto: AddToCartDto,
  ): Promise<FormattedCart> {
    return this.cartService.addItem(cartToken, dto);
  }

  @Patch('items/:itemId')
  async updateItem(
    @Headers('x-cart-token') cartToken: string,
    @Param('itemId') itemId: string,
    @Body() dto: UpdateCartItemDto,
  ): Promise<FormattedCart> {
    return this.cartService.updateItem(cartToken, itemId, dto);
  }

  @Delete('items/:itemId')
  async removeItem(
    @Headers('x-cart-token') cartToken: string,
    @Param('itemId') itemId: string,
  ): Promise<FormattedCart> {
    return this.cartService.removeItem(cartToken, itemId);
  }

  @Delete()
  async clearCart(@Headers('x-cart-token') cartToken: string): Promise<FormattedCart> {
    return this.cartService.clearCart(cartToken);
  }
}
