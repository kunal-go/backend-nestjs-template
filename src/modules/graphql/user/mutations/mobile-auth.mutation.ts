import { validatePassword } from "@common/utils"
import { UserVerificationService } from "@modules/domain/user"
import { UserMobileService } from "@modules/domain/user/user-mobile.service"
import { RegistrationMode } from "@modules/entity/entities/user/enums"
import { EntityService } from "@modules/entity/entity.service"
import { Args, Mutation, Resolver } from "@nestjs/graphql"
import { UserRegisterV1Response } from "../responses/user-register-v1.response"

@Resolver()
export class MobileAuthMutation {
	constructor(
		private readonly entity: EntityService,
		private readonly mobileService: UserMobileService,
		private readonly verificationService: UserVerificationService,
	) {}

	@Mutation(() => UserRegisterV1Response)
	async registerUserWithMobileV1(
		@Args("fullName") fullName: string,
		@Args("password") password: string,
		@Args("mobileNo") mobileNo: string,
	): Promise<UserRegisterV1Response> {
		validatePassword(password)

		const em = this.entity.getManager()
		const verificationRequest = await em.transaction(async (em) => {
			const user = await this.mobileService.createUser(em, {
				fullName,
				password,
				mobileNo,
			})
			return await this.verificationService.createUserVerificationRequest(em, {
				user,
				mode: RegistrationMode.Email,
			})
		})

		return new UserRegisterV1Response(verificationRequest)
	}
}
