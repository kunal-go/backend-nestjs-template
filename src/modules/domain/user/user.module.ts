import { Module } from "@nestjs/common"
import { UserEmailService } from "./user-email.service"
import { UserVerificationService } from "./user-verification.service"

@Module({
	providers: [UserEmailService, UserVerificationService],
	exports: [UserEmailService, UserVerificationService],
})
export class UserModule {}
