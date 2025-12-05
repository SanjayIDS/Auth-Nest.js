import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { User } from './user.schema';

@InputType()
export class SignUpInput {
  @Field()
  email!: string;

  @Field()
  password!: string;
}

@InputType()
export class SignInInput {
  @Field()
  email!: string;

  @Field()
  password!: string;
}

@ObjectType()
export class UserType {
  @Field()
  id!: string;

  @Field()
  email!: string;
}

@ObjectType()
export class AuthPayload {
  @Field()
  token!: string;

  @Field(() => UserType)
  user!: UserType;
}


