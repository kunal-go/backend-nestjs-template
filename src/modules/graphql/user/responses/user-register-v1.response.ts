import { UserVerificationRequestEntity } from "@modules/entity"
import { Field, GraphQLISODateTime, ID, ObjectType } from "@nestjs/graphql"

@ObjectType("UserRegisterV1Response")
export class UserRegisterV1Response {
	@Field(() => ID)
	registrationId: string

	@Field(() => GraphQLISODateTime)
	registrationValidTill: Date

	constructor(el: UserVerificationRequestEntity) {
		return {
			registrationId: el.id,
			registrationValidTill: el.validTill,
		}
	}
}
