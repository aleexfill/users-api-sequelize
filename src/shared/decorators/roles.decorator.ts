import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../enums';
import { ROLES_KEY } from 'src/common/constants';

export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
