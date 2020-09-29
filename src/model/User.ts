import { Field, ObjectType } from "type-graphql";

import { Todo } from "./Todo";

@ObjectType()
export class User {
  @Field()
  id: number;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field(() => [Todo], { nullable: true })
  todos: Todo[];
}
