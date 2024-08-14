import { generateVerificationCode } from "@common/utils"
import { UserEntity, UserVerificationRequestEntity } from "@modules/entity"
import { RegistrationMode } from "@modules/entity/entities/user/enums"
import { Injectable, UnprocessableEntityException } from "@nestjs/common"
import { EntityManager } from "typeorm"

@Injectable()
export class UserVerificationService {
	async createUserVerificationRequest(
		em: EntityManager,
		payload: { user: UserEntity; mode: RegistrationMode },
	): Promise<UserVerificationRequestEntity> {
		const verificationCode = generateVerificationCode()
		console.log("Code", verificationCode)

		const verificationRequest = new UserVerificationRequestEntity().init({
			user: payload.user,
			verificationCode,
			mode: payload.mode,
		})
		await em.save(verificationRequest)

		// TODO: send email with verification code
		return verificationRequest
	}

	async getUserVerificationRequestById(
		em: EntityManager,
		id: string,
	): Promise<UserVerificationRequestEntity | null> {
		return await em.findOneBy(UserVerificationRequestEntity, { id })
	}

	async verifyUser(
		em: EntityManager,
		userVerificationRequest: UserVerificationRequestEntity,
	): Promise<UserEntity> {
		const user = await userVerificationRequest.user
		if (userVerificationRequest.mode === RegistrationMode.Email) {
			user.isEmailVerified = true
		} else if (userVerificationRequest.mode === RegistrationMode.MobileNo) {
			user.isMobileNoVerified = true
		}
		await em.save(user)
		await em.remove(userVerificationRequest)
		return user
	}
}
