import { type PaginatedResult } from '@shared/domain/contracts/paginated-result.contract';

import { type User } from '../entities/user.entity';

export interface UserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findAll(tenantId: string, page: number, limit: number): Promise<PaginatedResult<User>>;
  save(user: User): Promise<void>;
  delete(id: string): Promise<void>;
  existsByEmail(email: string): Promise<boolean>;
}
