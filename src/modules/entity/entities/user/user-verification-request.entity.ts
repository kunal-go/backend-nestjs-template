import { generateHash, getValidity, verifyHash } from "@common/utils"
import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	OneToOne,
	PrimaryGeneratedColumn,
	RelationId,
} from "typeorm"
import { UserEntity } from "./user.entity"

const EMAIL_VERIFICATION_VALIDITY_IN_MINS = 10 as const
export const USER_VERIFICATION_REQUEST = "user_verification_requests" as const

@Entity(USER_VERIFICATION_REQUEST)
export class UserVerificationRequestEntity {
	@PrimaryGeneratedColumn("uuid")
	id: string

	@CreateDateColumn({ name: "created_at" })
	createdAt: Date

	@OneToOne(() => UserEntity, (el) => el.verificationRequest, {
		onDelete: "CASCADE",
	})
	@JoinColumn({ name: "user_id" })
	user: Promise<UserEntity>

	@RelationId((el: UserVerificationRequestEntity) => el.user)
	userId: string

	@Column({ name: "hashed_verification_code", type: "text" })
	hashedVerificationCode: string

	@Column({ name: "valid_till", type: "timestamp" })
	validTill: Date

	get isExpired(): boolean {
		return this.validTill.getTime() < Date.now()
	}

	isVerificationCodeValid(code: string): boolean {
		return !this.isExpired && verifyHash(code, this.hashedVerificationCode)
	}

	init(init: InitPayload) {
		this.user = Promise.resolve(init.user)
		this.hashedVerificationCode = generateHash(init.verificationCode)
		this.validTill = getValidity(EMAIL_VERIFICATION_VALIDITY_IN_MINS, "minute")
		return this
	}
}

type InitPayload = {
	user: UserEntity
	verificationCode: string
}
