import { UserEntity } from "@modules/entity"
import { Injectable, UnprocessableEntityException } from "@nestjs/common"
import { EntityManager } from "typeorm"

@Injectable()
export class UserMobileService {
	async createUser(
		em: EntityManager,
		payload: { fullName: string; mobileNo: string; password: string },
	): Promise<UserEntity> {
		const { fullName, password, mobileNo } = payload
		await this.checkAvailabilityByMobile(em, mobileNo)
		const account = new UserEntity().initForMobileAuth({
			fullName,
			password,
			mobileNo,
		})
		return await em.save(account)
	}

	async getUserByMobileNo(
		em: EntityManager,
		mobileNo: string,
	): Promise<UserEntity | null> {
		return await em.findOneBy(UserEntity, { mobileNo })
	}

	async checkAvailabilityByMobile(em: EntityManager, mobileNo: string) {
		const user = await this.getUserByMobileNo(em, mobileNo)
		if (user) {
			throw new UnprocessableEntityException(
				"Email or Mobile number already taken!",
			)
		}
	}
}
