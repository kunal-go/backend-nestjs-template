import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { EntityService } from "./entity.service"
import {
	UserEntity,
	UserSessionEntity,
	UserVerificationRequestEntity,
} from "./entities"

@Module({
	imports: [
		TypeOrmModule.forFeature([
			UserEntity,
			UserVerificationRequestEntity,
			UserSessionEntity,
		]),
	],
	providers: [EntityService],
	exports: [EntityService],
})
export class EntityModule {}
