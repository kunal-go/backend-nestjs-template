import { generateHash } from "@common/utils"
import { UserEntity, UserSessionEntity } from "@modules/entity"
import { Injectable, UnauthorizedException } from "@nestjs/common"
import { EntityManager } from "typeorm"

@Injectable()
export class UserSessionService {
	async getAccountSessionById(
		em: EntityManager,
		id: string,
	): Promise<UserSessionEntity | null> {
		return await em.findOneBy(UserSessionEntity, { id })
	}

	async createNewSession(
		em: EntityManager,
		{
			user,
			ipAddress,
			sessionKey,
		}: {
			user: UserEntity
			ipAddress: string
			sessionKey: string
		},
	): Promise<UserSessionEntity> {
		await this.deleteAllExistingSessionsOfAccount(em, user)
		const newAccountSession = new UserSessionEntity().init({
			user,
			ipAddress,
			sessionKey,
		})
		await em.save(newAccountSession)

		user.lastLoginActivityAt = new Date()
		await em.save(user)
		return newAccountSession
	}

	async deleteSessionById(em: EntityManager, id: string) {
		const session = await em.findOneBy(UserSessionEntity, { id })
		if (!session) {
			return
		}
		await em.remove(session)
	}

	async deleteAllExistingSessionsOfAccount(
		em: EntityManager,
		user: UserEntity,
	) {
		const existingSessions = await em.findBy(UserSessionEntity, { user })
		if (existingSessions) {
			await em.remove(existingSessions)
		}
	}

	async refreshSession(
		em: EntityManager,
		{
			accountSessionId,
			ipAddress,
			sessionKey,
			newRefreshKey,
		}: {
			accountSessionId: string
			ipAddress: string
			sessionKey: string
			userAgent?: string
			newRefreshKey: string
		},
	): Promise<UserSessionEntity> {
		const accountSession = await em.findOne(UserSessionEntity, {
			where: { id: accountSessionId },
		})
		if (!accountSession) {
			throw new UnauthorizedException("Invalid session")
		}
		if (!accountSession.verifySessionKey(sessionKey)) {
			throw new UnauthorizedException("Invalid session")
		}

		accountSession.ipAddress = ipAddress
		accountSession.sessionKeyHash = generateHash(newRefreshKey)
		accountSession.refreshAt = new Date()
		return await em.save(accountSession)
	}
}
