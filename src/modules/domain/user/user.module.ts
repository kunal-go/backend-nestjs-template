import { Module } from "@nestjs/common"
import { UserVerificationService } from "./user-verification.service"
import { UserMobileService } from "./user-mobile.service"
import { UserEmailService } from "./user-email.service"
import { UserSessionService } from "./user-session.service"

@Module({
	providers: [
		UserEmailService,
		UserMobileService,
		UserSessionService,
		UserVerificationService,
	],
	exports: [
		UserEmailService,
		UserMobileService,
		UserSessionService,
		UserVerificationService,
	],
})
export class UserModule {}
