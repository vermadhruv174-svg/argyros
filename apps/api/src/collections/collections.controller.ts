import { Controller, Get, Param, Req, UseGuards, Headers, Query } from '@nestjs/common';
import { CollectionsService } from './collections.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { StaffGuard } from '../admin/roles.guard';
import { Request } from 'express';

@Controller('collections')
export class CollectionsController {
  constructor(private readonly collectionsService: CollectionsService) {}

  @Get()
  async findAll() {
    return this.collectionsService.findAll();
  }

  @Get(':slug')
  async findOne(
    @Param('slug') slug: string,
    @Req() req: Request,
    @Headers('x-session-id') sessionId?: string,
  ) {
    const collection = await this.collectionsService.findOne(slug);

    // Track view asynchronously
    const userId = (req.user as any)?.id;
    this.collectionsService.trackView(collection.id, sessionId, userId).catch(err => {
      console.error('Failed to track view', err);
    });

    return collection;
  }

  @UseGuards(JwtAuthGuard, StaffGuard)
  @Get(':slug/stats')
  async getStats(@Param('slug') slug: string) {
    const collection = await this.collectionsService.findOne(slug);
    return this.collectionsService.getStats(collection.id);
  }
}
