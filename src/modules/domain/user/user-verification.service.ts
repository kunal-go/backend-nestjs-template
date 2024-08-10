import { generateVerificationCode } from "@common/utils"
import { UserEntity, UserVerificationRequestEntity } from "@modules/entity"
import { Injectable } from "@nestjs/common"
import { EntityManager } from "typeorm"

@Injectable()
export class UserVerificationService {
	async createUserVerificationRequest(
		em: EntityManager,
		user: UserEntity,
	): Promise<UserVerificationRequestEntity> {
		const verificationCode = generateVerificationCode()
		const verificationRequest = new UserVerificationRequestEntity().init({
			user,
			verificationCode,
		})
		await em.save(verificationRequest)

		// TODO: send email with verification code
		return verificationRequest
	}
}
