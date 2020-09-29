import {
  Args,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import { ID_ARGS, LOGIN_ARGS, USER_ARGS } from "../inputs/UserInput";
import { User } from "../model/User";
import { Context } from "../server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { privateKey } from "../constants";

const salt = bcryptjs.genSaltSync(10);

@ObjectType()
class Auth_Type {
  @Field()
  user: User;

  @Field()
  token: string;
}

@Resolver()
export class UserResolver {
  @Query(() => User)
  async user(@Ctx() { prisma, user }: Context) {
    console.log(await prisma.user.findMany());
    const userData = await prisma.user.findOne({
      where: {
        id: user?.id,
      },
      include: {
        todos: true,
      },
    });
    return userData;
  }

  @Mutation(() => Auth_Type, { nullable: true })
  async register(
    @Args(() => USER_ARGS) user: USER_ARGS,
    @Ctx() { prisma }: Context
  ) {
    const { email, name, password } = user;
    const findUser = await prisma.user.findOne({ where: { email } });
    if (!findUser) {
      const hashedPassword = bcryptjs.hashSync(password, salt);
      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
      });
      return {
        user: newUser,
        token: jwt.sign({ id: newUser.id }, privateKey),
      };
    } else {
      return null;
    }
  }

  @Query(() => Auth_Type, { nullable: true })
  async login(
    @Args(() => LOGIN_ARGS) user: LOGIN_ARGS,
    @Ctx() { prisma }: Context
  ) {
    const { email, password } = user;
    const findUser = await prisma.user.findOne({ where: { email } });
    if (findUser) {
      const isValidPassword = bcryptjs.compareSync(password, findUser.password);
      if (isValidPassword) {
        return {
          user: findUser,
          token: jwt.sign({ id: findUser.id }, privateKey),
        };
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  @Mutation(() => Boolean)
  async deleteUser(@Ctx() { user, prisma }: Context) {
    try {
      await prisma.user.delete({
        where: {
          id: user?.id,
        },
      });
      return true;
    } catch (error) {
      return false;
    }
  }
}
