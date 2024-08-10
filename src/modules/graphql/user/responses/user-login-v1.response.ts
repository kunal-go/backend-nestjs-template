import { Field, GraphQLISODateTime, ObjectType } from "@nestjs/graphql"

@ObjectType("UserLoginV1Response")
export class UserLoginV1Response {
	@Field(() => String)
	accessToken!: string

	@Field(() => String)
	refreshToken!: string

	@Field(() => GraphQLISODateTime)
	refreshTokenAfter!: Date
}
