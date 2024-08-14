import { ExecutionContext, createParamDecorator } from "@nestjs/common"
import { GqlExecutionContext } from "@nestjs/graphql"

export const GqlRequest = createParamDecorator(
	(_data, executionContext: ExecutionContext) => {
		const context = GqlExecutionContext.create(executionContext).getContext()
		return context.req
	},
)
