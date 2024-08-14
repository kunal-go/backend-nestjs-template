import { UserEntity } from "@modules/entity"
import { Injectable, UnprocessableEntityException } from "@nestjs/common"
import { EntityManager } from "typeorm"

@Injectable()
export class UserEmailService {
	async createUser(
		em: EntityManager,
		payload: { fullName: string; password: string; email: string },
	): Promise<UserEntity> {
		const { email, fullName, password } = payload
		await this.checkAvailabilityByEmail(em, payload.email)
		const account = new UserEntity().initForEmailAuth({
			fullName,
			password,
			email,
		})
		return await em.save(account)
	}

	async getUserByEmail(em: EntityManager, email: string) {
		return await em.findOneBy(UserEntity, { email: email.toLowerCase() })
	}

	async checkAvailabilityByEmail(em: EntityManager, email: string) {
		const user = await this.getUserByEmail(em, email)
		if (user) {
			throw new UnprocessableEntityException(
				"Email or Mobile number already taken!",
			)
		}
	}
}
