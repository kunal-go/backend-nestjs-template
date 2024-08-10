import { BadRequestException } from "@nestjs/common"

export function validatePassword(password: string) {
	if (password.length < 8 || password.length > 30) {
		throw new BadRequestException(
			"Password must be between 8 and 30 characters",
		)
	}
}
