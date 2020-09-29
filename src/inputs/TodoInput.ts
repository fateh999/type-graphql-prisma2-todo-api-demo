import { ArgsType, Field } from "type-graphql";

@ArgsType()
export class CREATE_TODO_ARGS {
  @Field()
  title: string;
}

@ArgsType()
export class EDIT_TODO_ARGS {
  @Field()
  id: number;
  @Field()
  title: string;
  @Field()
  completed: boolean;
}
