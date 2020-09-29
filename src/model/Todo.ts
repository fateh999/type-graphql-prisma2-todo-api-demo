import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class Todo {
  @Field()
  id: number;

  @Field()
  title: string;

  @Field()
  completed: boolean;
}
