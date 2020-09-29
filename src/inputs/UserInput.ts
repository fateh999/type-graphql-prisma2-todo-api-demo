import { ArgsType, Field, ObjectType } from "type-graphql";

@ArgsType()
export class ID_ARGS {
  @Field()
  id: number;
}

@ArgsType()
export class USER_ARGS {
  @Field()
  name: string;
  @Field()
  email: string;
  @Field()
  password: string;
}

@ArgsType()
export class LOGIN_ARGS {
  @Field()
  email: string;
  @Field()
  password: string;
}
