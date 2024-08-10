import { UserEntity } from "@modules/entity"
import { Injectable, UnprocessableEntityException } from "@nestjs/common"
import { EntityManager } from "typeorm"

@Injectable()
export class UserEmailService {
	async createUserWithEmail(
		em: EntityManager,
		payload: { fullName: string; email: string; password: string },
	): Promise<UserEntity> {
		await this.checkEmailAvailability(em, payload.email)
		const account = new UserEntity().initForEmailAuth(payload)
		return await em.save(account)
	}

	async getUserByEmail(em: EntityManager, email: string) {
		return await em.findOneBy(UserEntity, { email: email.toLowerCase() })
	}

	private async checkEmailAvailability(em: EntityManager, email: string) {
		const userFoundWithEmail = await this.getUserByEmail(em, email)
		if (userFoundWithEmail) {
			throw new UnprocessableEntityException(
				"Account already exists with this email",
			)
		}
	}
}
