import { Field, ObjectType } from "@nestjs/graphql"

@ObjectType("SystemHealthInfoV1Response")
export class SystemHealthInfoV1Response {
	@Field(() => String)
	status!: string

	constructor() {
		return {
			status: "Ok",
		}
	}
}
