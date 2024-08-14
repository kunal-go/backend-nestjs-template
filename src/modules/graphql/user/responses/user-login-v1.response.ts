import { AuthService } from "@modules/domain/auth"
import { UserSessionEntity } from "@modules/entity"
import { Field, GraphQLISODateTime, ObjectType } from "@nestjs/graphql"

@ObjectType("UserLoginV1Response")
export class UserLoginV1Response {
	@Field(() => String)
	accessToken!: string

	@Field(() => String)
	refreshToken!: string

	@Field(() => GraphQLISODateTime)
	refreshTokenAfter!: Date

	constructor(
		authService: AuthService,
		payload: { session: UserSessionEntity; sessionKey: string },
	) {
		return authService.createTokens(payload.session, payload.sessionKey)
	}
}
