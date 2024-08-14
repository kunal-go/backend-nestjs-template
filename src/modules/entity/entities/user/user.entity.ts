import { generateHash, verifyHash } from "@common/utils"
import {
	BeforeInsert,
	BeforeUpdate,
	Column,
	CreateDateColumn,
	Entity,
	OneToMany,
	OneToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from "typeorm"
import { UserSessionEntity } from "./user-session.entity"
import { UserVerificationRequestEntity } from "./user-verification-request.entity"

export const USER_ENTITY_TABLE_NAME = "users" as const

@Entity(USER_ENTITY_TABLE_NAME)
export class UserEntity {
	@PrimaryGeneratedColumn("uuid")
	id: string

	@CreateDateColumn({ name: "created_at" })
	createdAt: Date

	@UpdateDateColumn({ name: "updated_at" })
	updatedAt: Date

	@Column({ name: "full_name", type: "text" })
	fullName: string

	@Column({ name: "email", type: "text", unique: true, nullable: true })
	email: string | null

	@Column({ name: "is_email_verified", type: "boolean", default: false })
	isEmailVerified: boolean

	@Column({ name: "mobile_no", type: "text", unique: true, nullable: true })
	mobileNo: string | null

	@Column({ name: "is_mobile_no_verified", type: "boolean", default: false })
	isMobileNoVerified: boolean

	@Column({ name: "hashed_password", type: "text", nullable: true })
	hashedPassword: string | null

	@Column({ name: "password_updated_at", type: "timestamp", nullable: true })
	passwordUpdatedAt: Date | null

	@OneToOne(() => UserVerificationRequestEntity, (el) => el.user)
	verificationRequest: Promise<UserVerificationRequestEntity | null>

	@Column({ name: "last_login_activity_at", type: "timestamp", nullable: true })
	lastLoginActivityAt: Date | null

	@OneToMany(() => UserSessionEntity, (el) => el.user)
	sessions: Promise<UserSessionEntity[]>

	@BeforeInsert()
	@BeforeUpdate()
	private _beforeSave() {
		if (this.email) {
			this.email = this.email.toLowerCase()
		}
	}

	isPasswordValid(password: string): boolean {
		if (this.hashedPassword) {
			return verifyHash(password, this.hashedPassword)
		}
		return false
	}

	initForEmailAuth(init: InitPayloadForEmailAuth) {
		this.fullName = init.fullName
		this.email = init.email
		this.hashedPassword = generateHash(init.password)
		return this
	}

	initForMobileAuth(init: InitPayloadForMobileAuth) {
		this.fullName = init.fullName
		this.mobileNo = init.mobileNo
		this.hashedPassword = generateHash(init.password)
		return this
	}
}

type InitPayloadForEmailAuth = {
	fullName: string
	email: string
	password: string
}

type InitPayloadForMobileAuth = {
	fullName: string
	mobileNo: string
	password: string
}