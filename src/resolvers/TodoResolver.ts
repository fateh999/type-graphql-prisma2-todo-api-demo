import {
  Args,
  Ctx,
  Field,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import { User } from "../model/User";
import { Context } from "../server";
import bcryptjs from "bcryptjs";
import { Todo } from "../model/Todo";
import { CREATE_TODO_ARGS, EDIT_TODO_ARGS } from "../inputs/TodoInput";
import { ID_ARGS } from "../inputs/UserInput";

@Resolver()
export class TodoResolver {
  @Query(() => [Todo])
  async todos(@Ctx() { prisma, user }: Context) {
    const todosData = await prisma.todo.findMany({
      where: {
        userId: user?.id,
      },
    });
    return todosData;
  }

  @Mutation(() => Todo, { nullable: true })
  async createTodo(
    @Args(() => CREATE_TODO_ARGS) todo: CREATE_TODO_ARGS,
    @Ctx() { prisma, user }: Context
  ) {
    const { title } = todo;
    const newTodo = prisma.todo.create({
      data: {
        title,
        user: {
          connect: { id: user?.id },
        },
      },
    });
    return newTodo;
  }

  @Mutation(() => Todo, { nullable: true })
  async updateTodo(
    @Args(() => EDIT_TODO_ARGS) todo: EDIT_TODO_ARGS,
    @Ctx() { prisma, user }: Context
  ) {
    const { title, id, completed } = todo;
    const updatedTodo = prisma.todo.update({
      data: {
        title,
        completed,
      },
      where: {
        id,
      },
    });
    return updatedTodo;
  }

  @Mutation(() => Boolean)
  async deleteTodo(
    @Args(() => ID_ARGS) { id }: ID_ARGS,
    @Ctx() { prisma }: Context
  ) {
    try {
      await prisma.todo.delete({
        where: {
          id,
        },
      });
      return true;
    } catch (error) {
      return false;
    }
  }
}
