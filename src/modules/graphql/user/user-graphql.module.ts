import { UserModule } from "@modules/domain/user"
import { Module } from "@nestjs/common"
import { EmailAuthMutation } from "./mutations/email-auth.mutation"
import { EntityModule } from "@modules/entity"

@Module({
	imports: [EntityModule, UserModule],
	providers: [EmailAuthMutation],
})
export class UserGraphQLModule {}
