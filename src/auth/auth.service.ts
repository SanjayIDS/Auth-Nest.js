import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { User } from './user.schema';
import { AuthPayload, SignInInput, SignUpInput, UserType } from './dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  private toUserType(user: User): UserType {
    return {
      id: user.id,
      email: user.email,
    };
  }

  private signToken(user: User): string {
    const secret = process.env.JWT_SECRET || 'changeme';
    // No expiry, simple token payload
    return jwt.sign({ sub: user.id, email: user.email }, secret);
  }

  async signUp(input: SignUpInput): Promise<AuthPayload> {
    const email = input.email.toLowerCase().trim();
    const existing = await this.userModel.findOne({ email }).exec();
    if (existing) {
      throw new UnauthorizedException('Email already in use');
    }

    const passwordHash = await bcrypt.hash(input.password, 10);
    const user = await this.userModel.create({ email, passwordHash });
    const token = this.signToken(user);

    return {
      token,
      user: this.toUserType(user),
    };
  }

  async signIn(input: SignInInput): Promise<AuthPayload> {
    const email = input.email.toLowerCase().trim();
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const valid = await bcrypt.compare(input.password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.signToken(user);

    return {
      token,
      user: this.toUserType(user),
    };
  }
}


