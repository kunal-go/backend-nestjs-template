import { generateHash, getValidity, verifyHash } from "@common/utils"
import "reflect-metadata"
import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
	RelationId,
} from "typeorm"
import { UserEntity } from "./user.entity"

export const ACCESS_TOKEN_VALIDITY_IN_HOURS = 12 as const
export const USER_SESSION_ENTITY_TABLE_NAME = "user_sessions" as const

@Entity(USER_SESSION_ENTITY_TABLE_NAME)
export class UserSessionEntity {
	@PrimaryGeneratedColumn("uuid")
	id: string

	@CreateDateColumn({ name: "created_at" })
	createdAt: Date

	@ManyToOne(() => UserEntity, (el) => el.sessions, {
		nullable: false,
		onDelete: "CASCADE",
	})
	@JoinColumn({ name: "user_id" })
	user: Promise<UserEntity>

	@RelationId((el: UserSessionEntity) => el.user)
	userId: UserEntity["id"]

	@Column({ name: "ip_address", type: "text", nullable: true })
	ipAddress: string | null

	@Column({ name: "valid_till", type: "timestamp" })
	validTill: Date

	@Column({ name: "session_key_hash", type: "text" })
	sessionKeyHash: string

	@Column({ name: "refresh_at", type: "timestamp", nullable: true })
	refreshAt: Date | null

	get isExpired(): boolean {
		return this.validTill.getTime() < Date.now()
	}

	verifySessionKey(sessionKey: string): boolean {
		return verifyHash(sessionKey, this.sessionKeyHash)
	}

	init(init: InitPayload) {
		this.user = Promise.resolve(init.account)
		this.ipAddress = init.ipAddress ?? null
		this.sessionKeyHash = generateHash(init.refreshKey)
		this.validTill = getValidity(ACCESS_TOKEN_VALIDITY_IN_HOURS, "hour")

		return this
	}
}

type InitPayload = {
	account: UserEntity
	ipAddress?: string
	refreshKey: string
}
