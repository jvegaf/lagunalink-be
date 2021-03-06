import { UserId } from '../../../../../src/Contexts/LLBE/Shared/domain/Users/UserId';
import { UserEmail } from '../../../../../src/Contexts/LLBE/Users/domain/UserEmail';
import { UserPassword } from '../../../../../src/Contexts/LLBE/Users/domain/UserPassword';
import { UserIsActive } from '../../../../../src/Contexts/LLBE/Users/domain/UserIsActive';
import { UserCreatedAt } from '../../../../../src/Contexts/LLBE/Users/domain/UserCreatedAt';
import { UserUpdatedAt } from '../../../../../src/Contexts/LLBE/Users/domain/UserUpdatedAt';
import { User } from '../../../../../src/Contexts/LLBE/Users/domain/User';
import { UserRole } from '../../../../../src/Contexts/LLBE/Users/domain/UserRole';
import { CreateUserRequest } from '../../../../../src/Contexts/LLBE/Users/application/CreateUserRequest';
import { UserIdMother } from '../../Shared/domain/Users/UserIdMother';
import { UserEmailMother } from './UserEmailMother';
import { UserPasswordMother } from './UserPasswordMother';
import { UserIsActiveMother } from './UserIsActiveMother';
import { UserRoleMother } from './UserRoleMother';
import { UserCreatedAtMother } from './UserCreatedAtMother';
import { UserUpdatedAtMother } from './UserUpdatedAtMother';
import { UserAvatar } from '../../../../../src/Contexts/LLBE/Users/domain/UserAvatar';
import { UserAvatarMother } from './UserAvatarMother';

export class UserMother {
  static create(
    id: UserId,
    email: UserEmail,
    password: UserPassword,
    isActive: UserIsActive,
    role: UserRole,
    avatar: UserAvatar,
    createdAt: UserCreatedAt,
    updatedAt: UserUpdatedAt
  ): User {

    return new User(
      id,
      email,
      password,
      isActive,
      role,
      avatar,
      createdAt,
      updatedAt
    );
  }

  static fromRequest(request: CreateUserRequest): User {
    return this.create(
      UserIdMother.create(request.id),
      UserEmailMother.create(request.email),
      UserPasswordMother.create(request.password),
      UserIsActiveMother.create(request.isActive),
      UserRoleMother.create(request.role),
      UserAvatarMother.create(),
      UserCreatedAtMother.create(request.createdAt),
      UserUpdatedAtMother.create(request.updatedAt)
    );
  }

  static random(): User {
    return this.create(
      UserIdMother.random(),
      UserEmailMother.random(),
      UserPasswordMother.random(),
      UserIsActiveMother.random(),
      UserRoleMother.random(),
      UserAvatarMother.random(),
      UserCreatedAtMother.random(),
      UserUpdatedAtMother.random()
    );
  }
}
