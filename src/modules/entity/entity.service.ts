import { Inject, Injectable } from "@nestjs/common"
import { EntityManager } from "typeorm"

@Injectable()
export class EntityService {
	constructor(
		@Inject(EntityManager)
		private readonly entityManager: EntityManager,
	) {}

	getManager() {
		return this.entityManager
	}
}
