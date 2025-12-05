import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { AuthPayload, SignInInput, SignUpInput } from './dto';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Query(() => String, { name: 'health' })
  health(): string {
    return 'ok';
  }

  @Mutation(() => AuthPayload)
  async signUp(@Args('input') input: SignUpInput): Promise<AuthPayload> {
    return this.authService.signUp(input);
  }

  @Mutation(() => AuthPayload)
  async signIn(@Args('input') input: SignInInput): Promise<AuthPayload> {
    return this.authService.signIn(input);
  }
}


