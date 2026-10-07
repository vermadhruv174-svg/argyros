import { Controller, Get, Post, Param, UseGuards, Req } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('wishlist')
@UseGuards(JwtAuthGuard)
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Get()
  getWishlist(@Req() req: any) {
    return this.wishlistService.getWishlist(req.user.id);
  }

  @Post(':variantId')
  toggleWishlistItem(@Req() req: any, @Param('variantId') variantId: string) {
    return this.wishlistService.toggleWishlistItem(req.user.id, variantId);
  }
}
