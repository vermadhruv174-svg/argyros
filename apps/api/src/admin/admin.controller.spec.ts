import 'reflect-metadata';
jest.mock('./admin.service', () => ({ AdminService: class {} }));
jest.mock('./dto/admin.dto', () => ({
  CreateProductDto: class {},
  UpdateProductDto: class {},
  TransitionOrderStatusDto: class {},
  UpdateStockDto: class {},
}));

import { AdminController } from './admin.controller';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OwnerGuard, RecentOwnerAuthGuard } from './roles.guard';

describe('AdminController access policy', () => {
  it('requires authentication before the server-side owner check for every route', () => {
    const guards = Reflect.getMetadata('__guards__', AdminController) as unknown[];

    expect(guards).toEqual([JwtAuthGuard, OwnerGuard]);
  });

  it('adds recent re-authentication to every Owner Space write route', () => {
    for (const method of [
      'createProduct',
      'updateProduct',
      'publishProduct',
      'archiveProduct',
      'transitionOrderStatus',
      'resolveApprovalGate',
      'updateStock',
    ]) {
      expect(Reflect.getMetadata('__guards__', AdminController.prototype[method as keyof AdminController])).toEqual([
        RecentOwnerAuthGuard,
      ]);
    }
  });
});
