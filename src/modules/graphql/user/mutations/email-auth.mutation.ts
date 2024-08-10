import { EntityService } from "@modules/entity/entity.service"
import { Args, Mutation, Resolver } from "@nestjs/graphql"
import { UserRegisterV1Response } from "../responses/user-register-v1.response"
import { validatePassword } from "@common/utils"
import { UserEmailService, UserVerificationService } from "@modules/domain/user"

@Resolver()
export class EmailAuthMutation {
	constructor(
		private readonly entity: EntityService,
		private readonly userEmailService: UserEmailService,
		private readonly verificationService: UserVerificationService,
	) {}

	@Mutation(() => UserRegisterV1Response)
	async registerUserWithEmailV1(
		@Args("fullName") fullName: string,
		@Args("email") email: string,
		@Args("password") password: string,
	): Promise<UserRegisterV1Response> {
		validatePassword(password)

		const em = this.entity.getManager()
		const verificationRequest = await em.transaction(async (em) => {
			const user = await this.userEmailService.createUserWithEmail(em, {
				fullName,
				email,
				password,
			})
			return await this.verificationService.createUserVerificationRequest(
				em,
				user,
			)
		})

		return new UserRegisterV1Response(verificationRequest)
	}
}
