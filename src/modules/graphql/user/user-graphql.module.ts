import { UserModule } from "@modules/domain/user"
import { EntityModule } from "@modules/entity"
import { Module } from "@nestjs/common"
import { EmailAuthMutation } from "./mutations/email-auth.mutation"
import { VerificationMutation } from "./mutations/verification.mutation"
import { MobileAuthMutation } from "./mutations/mobile-auth.mutation"
import { AuthModule } from "@modules/domain/auth/auth.module"
import { AuthService } from "@modules/domain/auth"

@Module({
	imports: [EntityModule, UserModule, AuthModule],
	providers: [
		EmailAuthMutation,
		MobileAuthMutation,
		VerificationMutation,
		AuthService,
	],
})
export class UserGraphQLModule {}
