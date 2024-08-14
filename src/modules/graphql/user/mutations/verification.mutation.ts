import { generateRandomString, validateOtp } from "@common/utils"
import { UserVerificationService } from "@modules/domain/user"
import { GqlRequest } from "@common/decorators/gql-request.decorator"
import { AuthService } from "@modules/domain/auth/auth.service"
import { UserSessionService } from "@modules/domain/user/user-session.service"
import { EntityService } from "@modules/entity/entity.service"
import { UnprocessableEntityException } from "@nestjs/common"
import { Args, Mutation, Resolver } from "@nestjs/graphql"
import { Request } from "express"
import { UserLoginV1Response } from "../responses/user-login-v1.response"

@Resolver()
export class VerificationMutation {
	constructor(
		private readonly entity: EntityService,
		private readonly authService: AuthService,
		private readonly verificationService: UserVerificationService,
		private readonly sessionService: UserSessionService,
	) {}

	@Mutation(() => UserLoginV1Response)
	async verifyUserV1(
		@Args("otp") otp: string,
		@Args("registrationId") registrationId: string,
		@GqlRequest() req: Request,
	): Promise<UserLoginV1Response> {
		validateOtp(otp)

		const em = this.entity.getManager()
		const user = await em.transaction(async (em) => {
			const verificationRequest =
				await this.verificationService.getUserVerificationRequestById(
					em,
					registrationId,
				)

			const isCodeValid =
				verificationRequest && verificationRequest.isVerificationCodeValid(otp)
			if (!isCodeValid) {
				throw new UnprocessableEntityException("Code is invalid or expired!")
			}

			return await this.verificationService.verifyUser(em, verificationRequest)
		})
		const sessionKey = generateRandomString(10)

		const session = await em.transaction(async (em) => {
			return await this.sessionService.createNewSession(em, {
				user,
				ipAddress: req.ip!,
				sessionKey,
			})
		})

		return new UserLoginV1Response(this.authService, { session, sessionKey })
	}
}
