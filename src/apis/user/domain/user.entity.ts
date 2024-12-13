import { AggregateRoot } from '@libs/ddd/aggregate-root.base';
import { UserCreatedDomainEvent } from '@src/apis/user/domain/events/user-created.event';
import type {
  CreateUserProps,
  UpdateLoginCredentialProps,
  UserProps,
} from '@src/apis/user/domain/user.entity-interface';
import { UserRole } from '@src/apis/user/types/user.constant';

import { getTsid } from 'tsid-ts';
import bcrypt from 'bcrypt';
import { LoginCredential } from '@src/apis/user/domain/value-objects/login-credentials.value-object';
import { config } from 'dotenv';

config();

export class UserEntity extends AggregateRoot<UserProps> {
  static async create(create: CreateUserProps): Promise<UserEntity> {
    const id = getTsid().toBigInt();

    const props: UserProps = {
      ...create,
      role: UserRole.USER,
      deletedAt: null,
    };

    const user = new UserEntity({ id, props });

    await user.updateLoginCredential({
      password: user.props.loginCredential.password,
    });

    user.addEvent(
      new UserCreatedDomainEvent({
        aggregateId: id,
        ...props.loginCredential.unpack(),
      }),
    );

    return user;
  }

  async updateLoginCredential(props: UpdateLoginCredentialProps) {
    const password = props.password
      ? await this.hashPassword(props.password)
      : this.props.loginCredential.password;

    const newLoginCredential = new LoginCredential({
      ...this.props.loginCredential.unpack(),
      ...props,
      password,
    });

    this.props.loginCredential = newLoginCredential;
  }

  private async hashPassword(password: string) {
    return bcrypt.hash(
      password,
      +(process.env.HASH_ROUND as unknown as string),
    );
  }

  public validate(): void {}
}